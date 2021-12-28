import express from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Request, Response, NextFunction } from 'express'

const router = express.Router()

router.post(
  '/google',
  passport.authenticate('google-id-token', { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    //GENERATE JWT TOKEN USING USER
    try {
      const user = req.user
      const token = jwt.sign({ user }, process.env.JWT_SECRET || '')
      res.json({
        message: 'Sign in/up successfull',
        user: user,
        token: token,
        status: req.user ? 200 : 401,
      })
    } catch (error) {
      next(error)
    }
  }
)
//return done(null, false, { message: 'User already exists please login' })
/* POST signup. */
router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        message: 'Signup/Sign in  successful',
        user: req.user,
      })
    } catch (error) {
      next(error)
    }
  }
)
// POST login
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('login', async (err, user) => {
      try {
        if (err || !user) {
          //const error = new Error('email/password is not correct.')
          return next(err)
        }
        req.login(user, { session: false }, async (error) => {
          if (!error) {
            const body = {
              id: user.id,
              email: user.email /* , isAdmin: user.isAdmin */,
            }
            const token = jwt.sign(
              { user: body },
              process.env.JWT_SECRET || '',
              {
                expiresIn: '24h',
              }
            )
            return res.json({ token, id: user.id })
          }
          return next(error)
        })
      } catch (error) {
        return next(error)
      }
    })(req, res, next)
  }
)
export default router
