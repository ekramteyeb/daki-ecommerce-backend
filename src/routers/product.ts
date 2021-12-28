import express from 'express'
import passport from 'passport'
//import passport from 'passport'
//import Product from 'src/models/Product'
//import Product, { ProductDocument } from '../../src/models/Product'

import {
  createProduct,
  findById,
  deleteProduct,
  findAll,
  updateProduct,
} from '../controllers/product'

const router = express.Router()

// Every path we define here will get /api/v1/products prefix
router.get('/', findAll)
router.get('/:productId', findById)
router.put(
  '/:productId',
  /* passport.authenticate('jwt', { session: false }), */
  updateProduct
)
router.delete(
  '/:productId',
  passport.authenticate('jwt', { session: false }),
  deleteProduct
)
router.post(
  '/',
  /* passport.authenticate('jwt', { session: false }), */
  createProduct
)

export default router
