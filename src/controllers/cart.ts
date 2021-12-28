import { Request, Response, NextFunction } from 'express'

import Cart from '../models/Cart'
import CartService from '../services/cart'
import { BadRequestError } from '../helpers/apiError'

// POST /carts
export const createCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      user,
      items: { product, quantity },
    } = req.body

    const cart = new Cart({
      user,
      created: new Date().toLocaleDateString(),
      items: {
        product,
        quantity,
      },
    })

    await CartService.create(cart)

    res.json(cart)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// PUT /carts/:cartId
export const updateCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const cartId = req.params.cartId
    const updatedCart = await CartService.update(cartId, update)
    res.json(updatedCart)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /carts/:cartId
export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await CartService.deleteCart(req.params.cartId)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /carts/:cartId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await CartService.findById(req.params.cartId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /carts
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await CartService.findAll())
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
