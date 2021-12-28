import Cart, { CartDocument } from '../models/Cart'
import { NotFoundError } from '../helpers/apiError'

const create = async (cart: CartDocument): Promise<CartDocument> => {
  return cart.save()
}

const findById = async (cartId: string): Promise<CartDocument> => {
  const foundCart = await Cart.findById(cartId)

  if (!foundCart) {
    throw new NotFoundError(`Cart ${cartId} not found`)
  }

  return foundCart
}
const findByUserId = async (userId: string | any): Promise<CartDocument> => {
  const foundCart = await Cart.findOne({ user: userId })

  if (!foundCart) {
    throw new NotFoundError(`Cart with this ${userId} not found`)
  }

  return foundCart
}

const findAll = async (): Promise<CartDocument[]> => {
  return Cart.find({})
    .populate('user', { firstName: 1 })
    .populate('product', { items: { name: 1, category: 1 } })
    .sort({ created: 1 })
}

const update = async (
  cartId: string,
  update: Partial<CartDocument>
): Promise<CartDocument | null> => {
  const foundCart = await Cart.findByIdAndUpdate(cartId, update, {
    new: true,
  })

  if (!foundCart) {
    throw new NotFoundError(`Cart ${cartId} not found`)
  }

  return foundCart
}

const deleteCart = async (cartId: string): Promise<CartDocument | null> => {
  const foundCart = Cart.findByIdAndDelete(cartId)

  if (!foundCart) {
    throw new NotFoundError(`Cart ${cartId} not found`)
  }

  return foundCart
}

export default {
  create,
  findById,
  findAll,
  findByUserId,
  update,
  deleteCart,
}
