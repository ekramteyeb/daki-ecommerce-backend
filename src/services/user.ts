import User, { UserDocument } from '../models/User'
import { NotFoundError } from '../helpers/apiError'
import bcrypt from 'bcrypt'
import hashPassword from '../util/salt'

const create = async (user: UserDocument): Promise<UserDocument> => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(user.password, salt)
    user.password = hashedPassword
  }
  return user.save()
}
const findById = async (userId: string): Promise<UserDocument> => {
  const foundUser = await User.findById(userId).populate('products', {
    category: 1,
    name: 1,
    productCode: 1,
  })

  if (!foundUser) {
    throw new NotFoundError(`User ${userId} not found`)
  }
  return foundUser
}
//check email
const emailFound = async (email: string): Promise<boolean> => {
  const foundUser = await User.findOne({ email: email })
  if (foundUser) {
    throw new NotFoundError(
      `${email} already used please login/use another email `
    )
  }
  return false
}

const findByEmail = async (email: string): Promise<UserDocument> => {
  const foundUser = await User.findOne({ email: email })
  if (!foundUser) {
    throw new NotFoundError(`${email} not found`)
  }
  return foundUser
}
// check password checkPassword
const checkPassword = async (
  id: string,
  password: string
): Promise<UserDocument> => {
  const foundUser = await User.findById(id)
  if (!foundUser) {
    throw new NotFoundError(`user ${id} not found`)
  }
  const pass: string | any = foundUser?.password
  const validate = await bcrypt.compare(password, pass)
  if (!validate) {
    throw new NotFoundError(`User ${id}  password dont match`)
  }
  return foundUser
}
const findOrCreate = async (
  payload: Partial<UserDocument>
): Promise<UserDocument> => {
  const foundUser = await User.findOne({ email: payload.email })
  if (!foundUser) {
    const newUser = new User({
      userName: payload.userName,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      avatar: payload.avatar,
    })
    newUser.save()
    console.log(newUser, 'created user')
    return newUser
  }

  return foundUser
}
// find all users and populate PRODUCTS with their users
const findAll = async (): Promise<UserDocument[]> => {
  return User.find()
    .populate('products', { category: 1, name: 1, productCode: 1 })
    .sort({ firstName: -1 })
}

const update = async (
  userId: string,
  update: Partial<UserDocument>
): Promise<UserDocument | null> => {
  const fetchUser: any = await User.findById(userId)
  if (fetchUser) {
    //check if put request includes address property to change
    if (update['address']) {
      const { street, postalCode, country } = update['address']
      update = {
        ...update,
        address: {
          street: street ? street : fetchUser?.address?.street,
          postalCode: postalCode ? postalCode : fetchUser?.address?.postalCode,
          country: country ? country : fetchUser?.address?.country,
        },
      }
    }
    //check if put request includes products property to change
    if (update['products']) {
      const products = update['products']
      //check if available already
      //const found = fetchUser.products.find((p) => p == products)
      update = {
        ...update,
        products: [...fetchUser?.products, products],
      }
    }
    //check if password is used
    if (update['password'] && update['password'] !== '') {
      const password = update['password']
      const validate = await bcrypt.compare(password, fetchUser.password)
      if (!validate) {
        throw new NotFoundError('User password dont match')
      }
      const hashedPassword: string | any = await hashPassword(password)
      console.log('password after hash', hashedPassword)
      update = {
        ...update,
        password: hashedPassword,
      }
      console.log('update inside password', update)
    }
  }
  const foundUser = await User.findByIdAndUpdate(userId, update, {
    new: true,
  })
  if (!foundUser) {
    throw new NotFoundError(`User ${userId} not found`)
  }
  return foundUser
}

//reset forgotten password
const resetPassword = async (
  userId: string,
  update: Partial<UserDocument>
): Promise<UserDocument | null> => {
  const fetchUser: any = await User.findById(userId)
  if (fetchUser) {
    //check if password is used
    if (update['password'] && update['password'] !== '') {
      const password = update['password']
      const hashedPassword: string | any = await hashPassword(password)
      update = {
        ...update,
        password: hashedPassword,
      }
    }
  }
  const updatedUser = await User.findByIdAndUpdate(userId, update, {
    new: true,
  })
  if (!updatedUser) {
    throw new NotFoundError(`User ${userId} not found`)
  }
  return updatedUser
}

const deleteUser = async (userId: string): Promise<UserDocument | null> => {
  const foundUser = User.findByIdAndDelete(userId)

  if (!foundUser) {
    throw new NotFoundError(`User ${userId} not found`)
  }

  return foundUser
}

export default {
  create,
  findById,
  findAll,
  update,
  findByEmail,
  checkPassword,
  resetPassword,
  emailFound,
  findOrCreate,
  deleteUser,
}
