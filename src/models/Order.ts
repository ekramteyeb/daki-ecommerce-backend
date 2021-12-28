/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document, Schema } from 'mongoose'
import { ProductDocument } from './Product'
import { UserDocument } from './User'

export type OrderDocument = Document & {
  user: UserDocument
  total: number
  status: string
  startDate: Date
  endDate: Date
  items: [
    {
      product: ProductDocument
      quantity: number
    }
  ]
}

const orderSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  total: {
    type: Number,
    default: 0,
  },
  started: {
    type: Date,
  },
  dispatched: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['onprogress', 'onhold', 'completed', 'cancelled'],
    default: 'onprogress',
    required: true,
  },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
})
orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default mongoose.model<OrderDocument>('Order', orderSchema)
