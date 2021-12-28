import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

export async function sendMail(
  email?: string,
  subject?: string,
  text?: string
) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // const testAccount = await nodemailer.createTestAccount()
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST_HOT,
      service: process.env.SERVICE_HOT,
      port: 587,
      tls: {
        ciphers: 'SSLv3',
      },
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.USER_EMAIL, // generated ethereal user
        pass: process.env.PASS_USER, // generated ethereal password
      },
    })

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.USER_EMAIL, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      //html: `<b>Hello ✔ ${email}?</b>`, // html body
      text: text, // plain text body
    })

    return info.messageId
  } catch (error) {
    console.log(error, 'email not sent')
    return 'email is not sent'
  }
}
