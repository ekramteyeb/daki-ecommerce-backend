import express from 'express'
import passport from 'passport'
//import UserService from '../services/user'

import {
  createUser,
  findById,
  deleteUser,
  findAll,
  findEmail,
  checkPassword,
  updateUser,
  forgotPassword,
  resetPassword,
} from '../controllers/user'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
router.get('/', passport.authenticate('jwt', { session: false }), findAll)

router.get(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  findById
)
router.put(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  updateUser
)
/* router.put(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  updateUser
) */
router.delete(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  deleteUser
)
router.post('/', createUser)
//

router.post('/checkEmail', findEmail)
router.post('/checkPassword', checkPassword)
router.post('/forgotpassword', forgotPassword)
router.post(
  '/resetpassword',
  passport.authenticate('jwt', { session: false }),
  resetPassword
)

export default router
