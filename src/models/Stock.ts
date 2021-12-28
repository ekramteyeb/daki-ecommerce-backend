/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document, Schema } from 'mongoose'
import { ProductDocument } from './Product'
import { UserDocument } from './User'

export type StockDocument = Document & {
  user: UserDocument
  total: number
  created: Date
  items: [
    {
      product: ProductDocument
      quantity: number
    }
  ]
}

const stockSchema = new mongoose.Schema({
  total: {
    type: Number,
    default: 0,
  },

  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      available: { type: Number, default: 1 },
      returned: { type: Number, default: 0 },
      sold: { type: Number, default: 0 },
      enteryDate: {
        type: Date,
      },
    },
  ],
})

export default mongoose.model<StockDocument>('Cart', stockSchema)
