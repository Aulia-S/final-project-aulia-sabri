import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CategoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
)

const CategoriesModel = mongoose.model('Category', CategoriesSchema)

export default CategoriesModel
