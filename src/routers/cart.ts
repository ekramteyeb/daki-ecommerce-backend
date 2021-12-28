import express from 'express'
import passport from 'passport'

import {
  createCart,
  findById,
  deleteCart,
  findAll,
  updateCart,
} from '../controllers/cart'

const router = express.Router()

// Every path we define here will get /api/v1/carts prefix
router.get('/', passport.authenticate('jwt', { session: false }), findAll)
router.get(
  '/:cartId',
  passport.authenticate('jwt', { session: false }),
  findById
)
router.put(
  '/:cartId',
  passport.authenticate('jwt', { session: false }),
  updateCart
)
router.delete(
  '/:cartId',
  passport.authenticate('jwt', { session: false }),
  deleteCart
)
router.post('/', passport.authenticate('jwt', { session: false }), createCart)

export default router
