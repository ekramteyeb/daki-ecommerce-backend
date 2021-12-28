/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document, Schema } from 'mongoose'
import Product, { ProductDocument } from './Product'
import User, { UserDocument } from './User'

export type CartDocument = Document & {
  user: UserDocument
  created: Date
  items: [
    {
      product: ProductDocument
      quantity: number
    }
  ]
}

const cartSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  created: {
    type: Date,
  },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
})

export default mongoose.model<CartDocument>('Cart', cartSchema)
