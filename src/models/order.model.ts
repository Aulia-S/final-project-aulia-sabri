import mail from '@/utils/mail'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const OrderSchema = new Schema(
  {
    grandTotal: {
      type: Number,
      required: true,
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        productId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

OrderSchema.post('save', async function (doc) {
  const order: any = await doc.populate('createdBy')

  console.log('sendmail order success to ' + order.createdBy.username)

  const content = await mail.render('order-success.ejs', {
    customerName: order.createdBy.fullName,
    orderItems: order.orderItems,
    grandTotal: order.grandTotal,
    contactEmail: 'sanber57@ecommerce.com',
    companyName: 'Sanber Ecommerce',
    year: new Date().getFullYear(),
  })

  await mail.send({
    to: order.createdBy.email,
    subject: 'Order Success',
    content,
  })
})

const OrderModel = mongoose.model('Order', OrderSchema)

export default OrderModel
