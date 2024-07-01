import { Request, Response } from 'express'
import ProductsModel from '@/models/products.model'
import mongoose from 'mongoose'
import CategoriesModel from '@/models/categories.model'
import * as Yup from 'yup'

const createValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  price: Yup.number().required(),
  category: Yup.string().required(),
  description: Yup.string().required(),
  images: Yup.array().of(Yup.string()).required().min(1),
  qty: Yup.number().required().min(1),
})

interface IPaginationQuery {
  page: number
  limit: number
  search?: string
}

export default {
  async create(req: Request, res: Response) {
    const createdProduct = new ProductsModel({ ...req.body })

    let category
    try {
      await createValidationSchema.validate(req.body)
      category = await CategoriesModel.findById(req.body.category)
    } catch (error) {
      const err = error as Error
      return res.status(500).json({
        data: err,
        message: 'Failed create product',
      })
    }

    let result
    try {
      const sess = await mongoose.startSession()
      sess.startTransaction()
      result = await createdProduct.save({ session: sess })
      category?.products.push(result)
      await category?.save({ session: sess })
      await sess.commitTransaction()

      res.status(201).json({
        data: result,
        message: 'Success create product',
      })
    } catch (error) {
      const err = error as Error
      res.status(500).json({
        data: err.message,
        message: 'Failed create product',
      })
    }
  },
  async findAll(req: Request, res: Response) {
    try {
      const { limit = 10, page = 1, search = '' } = req.query as unknown as IPaginationQuery

      const query = {}

      if (search) {
        Object.assign(query, {
          name: { $regex: search, $options: 'i' },
        })
      }

      const result = await ProductsModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .populate('category')

      const total = await ProductsModel.countDocuments(query)

      res.status(200).json({
        data: result,
        message: 'Success get all products',
        page: +page,
        limit: +limit,
        total,
        totalPages: Math.ceil(total / limit),
      })
    } catch (error) {
      const err = error as Error
      res.status(500).json({
        data: err.message,
        message: 'Failed get all products',
      })
    }
  },
  async findOne(req: Request, res: Response) {
    try {
      const result = await ProductsModel.findOne({
        _id: req.params.id,
      })
      res.status(200).json({
        data: result,
        message: 'Success get one product',
      })
    } catch (error) {
      const err = error as Error
      res.status(500).json({
        data: err.message,
        message: 'Failed get one product',
      })
    }
  },
  async update(req: Request, res: Response) {
    try {
      const result = await ProductsModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
      })

      res.status(200).json({
        data: result,
        message: 'Success update product',
      })
    } catch (error) {
      const err = error as Error
      res.status(500).json({
        data: err.message,
        message: 'Failed update product',
      })
    }
  },
  async delete(req: Request, res: Response) {
    try {
      const result = await ProductsModel.findOneAndDelete({
        _id: req.params.id,
      })

      res.status(200).json({
        data: result,
        message: 'Success delete product',
      })
    } catch (error) {
      const err = error as Error
      res.status(500).json({
        data: err.message,
        message: 'Failed delete product',
      })
    }
  },
}
