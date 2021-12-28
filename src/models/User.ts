/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document, Schema } from 'mongoose'
import { ProductDocument } from './Product'
import uniqueValidator from 'mongoose-unique-validator'

export type UserDocument = Document & {
  userId: string
  userName: string
  firstName: string
  lastName: string
  gender: string
  email: string
  password?: string
  address: {
    street: string
    postalCode: string
    country: string
  }
  products: ProductDocument[]
  createdAt: Date
  avatar: string
  isAdmin: boolean
  cart?: ProductDocument[]
}

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  address: {
    street: {
      type: String,
      default: '',
    },
    postalCode: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  cart: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: {
    type: Date,
    default: new Date().toLocaleString(),
  },
  avatar: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

// add(configure) unique validator to mongoose
userSchema.plugin(uniqueValidator)

//hash the password
/* userSchema.pre<UserDocument>('save', async function (next) {
  if(this.password !== ''){
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
  }
  next()
}) */

// compare password
/* userSchema.methods.isValidPassword = async function(password: string) {
  const user = this
  const compare = await bcrypt.compare(password, this.password)
  return compare
} 
 */

//userSchema.plugin(findOrCreate)

// modifiy the mongose_id and delete the  __v
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.password
  },
})
export default mongoose.model<UserDocument>('User', userSchema)
