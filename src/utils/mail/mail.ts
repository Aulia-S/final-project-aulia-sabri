import nodemailer from 'nodemailer'
import path from 'path'
import ejs from 'ejs'
import { EMAIL_SERVICE, EMAIL_HOST, EMAIL_PORT, EMAIL_AUTH_USER, EMAIL_AUTH_PASS, EMAIL_FROM } from '../env'
const smtpConfig: any = {
  service: EMAIL_SERVICE,
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: true,
  auth: {
    user: EMAIL_AUTH_USER,
    pass: EMAIL_AUTH_PASS,
  },
  requireTLS: true,
}

const transporter = nodemailer.createTransport(smtpConfig)

const send = async ({ to, subject, content }: { to: string | string[]; subject: string; content: string }) => {
  const result = await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    html: content,
  })

  return result
}

const render = async (template: string, data: any) => {
  const content = await ejs.renderFile(path.join(__dirname, `templates/${template}`), data)

  return content as string
}

export default {
  send,
  render,
}
