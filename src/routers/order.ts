import express from 'express'
import passport from 'passport'

import {
  createOrder,
  findById,
  deleteOrder,
  findAll,
  updateOrder,
} from '../controllers/order'

const router = express.Router()

// Every path we define here will get /api/v1/orders prefix
router.get('/', findAll)
router.get('/:orderId', findById)
router.put(
  '/:orderId',
  passport.authenticate('jwt', { session: false }),
  updateOrder
)
router.delete(
  '/:orderId',
  passport.authenticate('jwt', { session: false }),
  deleteOrder
)
router.post('/', passport.authenticate('jwt', { session: false }), createOrder)

export default router
