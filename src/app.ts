import express from 'express'
import path from 'path'
import lusca from 'lusca'
import cors from 'cors'
import compression from 'compression'
import productRouter from './routers/product'
import loginRouter from './routers/login'
import userRouter from './routers/user'
import cartRouter from './routers/cart'
import orderRouter from './routers/order'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'
import dotenv from 'dotenv'

dotenv.config()
//require('dotenv').config()
require('./config/passport')
//dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.set('port', process.env.PORT || 3000)
app.use(apiContentType)

// Use common 3rd-party middlewares
app.use(compression())
app.use(express.json())
app.use(cors())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use(express.static('build'))
app.use(express.static(path.join(__dirname, 'build')))

// Use  routers
app.use('/api/v1/products', productRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/carts', cartRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/users', loginRouter)
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
/* app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
}) */
// Custom API error handler
app.use(apiErrorHandler)

export default app
