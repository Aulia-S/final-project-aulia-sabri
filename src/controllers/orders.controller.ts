import { Request, Response } from 'express'
import ProductsModel from '@/models/products.model'
import mongoose from 'mongoose'
import CategoriesModel from '@/models/categories.model'
import * as Yup from 'yup'
import OrderModel from '@/models/order.model'
import UserModel from '@/models/user.model'
import { IReqUser } from '@/utils/interfaces'

const orderItemsSchema = Yup.object().shape({
  name: Yup.string().required(),
  productId: Yup.string().required(),
  price: Yup.number().required(),
  quantity: Yup.number().min(1).max(5).required(),
})

const createValidationSchema = Yup.object().shape({
  grandTotal: Yup.number().required(),
  orderItems: Yup.array().of(orderItemsSchema).min(1, 'At least one order item is required').required(),
  createdBy: Yup.string().required(),
  status: Yup.string<'pending' | 'completed' | 'cancelled'>().required(),
})

interface IPaginationQuery {
  page: number
  limit: number
  search?: string
}

export default {
  async create(req: Request, res: Response) {
    const orderData = { ...req.body, createdBy: (req as IReqUser).user.id }

    // data validation
    try {
      await createValidationSchema.validate(orderData)
    } catch (error) {
      const err = error as Error
      return res.status(400).json({
        message: 'Failed create order. Please check your data',
        data: err,
      })
    }

    // check user and product are exists
    let user
    let products
    const productsIds = req.body.orderItems.map((items: any) => items.productId)
    try {
      user = await UserModel.findById((req as IReqUser).user.id)
      products = await ProductsModel.find({ _id: { $in: productsIds } })
    } catch (error) {
      const err = error as Error
      return res.status(500).json({
        data: err,
        message: 'Failed create order',
      })
    }

    // check quantity order <= quatity in product
    const quantityInOrder = orderData.orderItems.map((item: any) => item.quantity)
    const quantityInProducts = products.map((product) => product.qty)
    const checkQuantity = quantityInOrder.every((value: number, index: number) => value <= quantityInProducts[index])

    if (!checkQuantity) {
      return res.status(500).json({
        message: 'Failed create order',
      })
    }

    // save to db
    const createdOrder = new OrderModel(orderData)
    try {
      // start transaction
      const sess = await mongoose.startSession()
      sess.startTransaction()

      // save order
      const result = await createdOrder.save({ session: sess })

      // add order to user
      user?.orders.push(result)
      await user?.save({ session: sess })

      // reduce qty in products
      for (const index in products) {
        products[index].qty -= quantityInOrder[index]
        await products[index].save({ session: sess })
      }

      // end transaction
      await sess.commitTransaction()

      res.status(201).json({
        data: result,
        message: 'Success create order',
      })
    } catch (error) {
      const err = error as Error
      res.status(500).json({
        data: err.message,
        message: 'Failed create order',
      })
    }
  },
  async findAllByUserId(req: Request, res: Response) {
    try {
      const { limit = 10, page = 1 } = req.query as unknown as IPaginationQuery
      const query = { createdBy: (req as IReqUser).user.id }

      const result = await OrderModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })

      const total = await OrderModel.countDocuments(query)

      res.status(200).json({
        data: result,
        message: 'Success get all orders',
        page: +page,
        limit: +limit,
        total,
        totalPages: Math.ceil(total / limit),
      })
    } catch (error) {
      const err = error as Error
      res.status(500).json({
        data: err.message,
        message: 'Failed get all orders',
      })
    }
  },
}
