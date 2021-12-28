import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import UserService from '../services/user'
import { BadRequestError, NotFoundError } from '../helpers/apiError'
import { sendMail } from '../util/sendEmail'
import dotenv from 'dotenv'

dotenv.config()
//require('dotenv').config()
// POST /users
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      userName,
      firstName,
      lastName,
      email,
      password,
      address: { street, postalCode, country },
      products,
      cart,
      avatar,
      isAdmin,
    } = req.body

    const user = new User({
      userName,
      firstName,
      lastName,
      email,
      password,
      address: {
        street,
        postalCode,
        country,
      },
      products,
      cart,
      avatar,
      isAdmin,
    })

    await UserService.create(user)
    res.json(user)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// PUT /users/:userId
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const userId = req.params.userId
    const updateUser = await UserService.update(userId, update)
    res.json(updateUser)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /users/:userId
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.deleteUser(req.params.userId)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /users/:userId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.findById(req.params.userId)
    res.json(user)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
// GET /users/:userEmail
export const findEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.findByEmail(req.body.email)
    if (user) {
      res.json('User is available')
    } else {
      next(new NotFoundError('Email not found'))
    }
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Email not found', error))
    } else {
      next(error)
    }
  }
}

// GET /users/:userEmail
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //check if the email is available
    const user = await UserService.findByEmail(req.body.email)
    //send verification code to the user email address
    if (user) {
      const body = {
        id: user.id,
        email: user.email,
      }
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET || '', {
        expiresIn: '24h',
      })

      //create link
      const link = `${process.env.BASE_URL}/passwordreset/token=${token}`
      console.log(link, 'the link is')
      const sendEmailResponse = await sendMail(
        user.email,
        'Password reset',
        link
      )
      console.log(sendEmailResponse, 'response from sendimg ')
      return res.json('Password reset link sent to your email account')
    }
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      console.log(error)
      next(new BadRequestError('An error occured'))
    } else {
      next(error)
    }
  }
}
//resetPassword

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get the token from url
    const tokenString = req.headers.authorization
    const token: string | any = tokenString?.slice(7)

    //decode the token
    const decoded: any = jwt.decode(token, { json: true })
    const { email, id } = decoded.user

    const response = await UserService.resetPassword(id, {
      email: email,
      password: req.body.password,
    })

    if (response) {
      return res.status(200).json('Password reset successful')
    } else {
      return res.status(404).json('Password reset not successful')
    }
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      console.log(error)
      next(new BadRequestError('An error occured'))
    } else {
      next(error)
    }
  }
}

export const checkPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isAvailable = await UserService.checkPassword(
      req.body.id,
      req.body.password
    )
    res.json(isAvailable)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Password does not match', error))
    } else {
      next(error)
    }
  }
}
// GET /users
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findAll())
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
