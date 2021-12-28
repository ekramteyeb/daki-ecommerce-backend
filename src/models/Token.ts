import mongoose, { Document, Schema } from 'mongoose'
import { UserDocument } from './User'

export type TokenDocument = Document & {
  userId: UserDocument
  token: string
  createdAt: Date
}

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
})

module.exports = mongoose.model<TokenDocument>('token', tokenSchema)
