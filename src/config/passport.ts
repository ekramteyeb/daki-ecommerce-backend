import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
//import { OAuth2Client } from 'google-auth-library'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const GoogleTokenStrategy = require('passport-google-id-token')
import userService from '../services/user'
import User from '../models/User'

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

//JWT Strategy for authorization
passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      //can access the token from various location : header , urlqueryparameter or authrization as bearer
      jwtFromRequest: ExtractJWT.fromExtractors([
        ExtractJWT.fromUrlQueryParameter('token'),
        ExtractJWT.fromHeader('token'),
        ExtractJWT.fromAuthHeaderAsBearerToken(),
      ]),
    },
    async function (token, done) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      try {
        await User.findById(token.user.id, function (err: any, user: any) {
          if (err) {
            return done(err, false)
          }
          if (user) {
            return done(null, user)
          } else {
            return done(null, false)
          }
        }).clone()
        /* return done(null, token.user) */
      } catch (err) {
        done(err)
      }
    }
  )
)
passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function (email: string, password: string, done) {
      //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
      try {
        const isemailAvailable = await userService.emailFound(email)

        if (!isemailAvailable) {
          const userCreate = new User({
            email: email.toLocaleLowerCase(), //sanitize
            password: password,
          })
          const user = await userService.create(userCreate)
          return done(null, user, { message: 'Signed up  Successfully' })
        }
      } catch (err) {
        return done(err, false, { message: 'Incorrect email or password' })
      }
    }
  )
)

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await userService.findByEmail(email)
        if (!user) {
          return done(null, false, { message: 'User not found' })
        }
        const pass: string | any = user.password
        const validate = await bcrypt.compare(password, pass)
        //const validate = await user.isValidPassword(password)
        if (!validate) {
          return done(null, false, { message: 'Wrong Password' })
        }
        return done(null, user, { message: 'Logged in Successfully' })
      } catch (error) {
        return done(error)
      }
    }
  )
)

export const googleStrategy = new GoogleTokenStrategy(
  {
    clientId: process.env.GOOGLE_CLIENT_ID,
    //getGoogleCerts: optionalCustomGetGoogleCerts,
  },
  async function (parsedToken: any, clientId: string, done: any) {
    const userPayload = {
      userName: parsedToken?.payload?.given_name,
      email: parsedToken?.payload?.email,
      firstName: parsedToken?.payload?.given_name,
      lastName: parsedToken?.payload?.family_name,
      avatar: parsedToken?.payload?.picture,
    }
    try {
      const user = await userService.findOrCreate(userPayload)
      done(null, user)
    } catch (e) {
      done(e)
    }
  }
)
passport.use('google-id-token', googleStrategy)

/* const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const googleAuth = async (token: any) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
  const payload = ticket.getPayload()

  console.log(`User ${payload?.name} verified`)

  //const { sub, email, name, picture } = payload; 
  //const { sub, email, name, picture } = payload
  //const userId = sub
  //return {userId, email, fullName: name, photoUrl: picture}
  return payload
}
export default googleAuth */
//export const jwtStrategy = new JwtStrategy({}, function () {})
