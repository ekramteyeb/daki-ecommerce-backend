/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import User, { UserDocument } from './User'

export type ProductDocument = Document & {
  name: string
  category: string
  productCode: string
  productionYear: number
  price: number
  rating?: number
  amount?: number
  color?: string
  warranty?: number
  modelType?: string
  techInfo?: string[]
  createdAt?: Date
  image?: string
  users?: UserDocument[]
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: true,
  },
  category: {
    type: String,
    enum: ['tv', 'mobile', 'computer', 'tablet'],
    default: '',
    required: true,
  },
  productCode: {
    type: String,
    required: true,
    unique: true,
  },
  productionYear: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  amount: {
    type: Number,
    min: 0,
  },
  color: {
    type: String,
  },
  warranty: {
    type: Number,
  },
  modelType: {
    type: String,
  },
  techInfo: [String],
  createdAt: {
    type: Date,
    default: new Date().toLocaleString(),
  },
  image: {
    type: String,
  },
  users: [{ type: Schema.Types.ObjectId, ref: User }],
})
// add(configure) unique validator to mongoose
productSchema.plugin(uniqueValidator)

//add elastic search not implemented yet
/* productSchema.plugin(mongoosastic, {
  host: 'localhost',
  port: 3001,
}) */

// modifiy the mongose_id and delete the  __v
productSchema.set('toJSON', {
  transform: (Document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default mongoose.model<ProductDocument>('Product', productSchema)
