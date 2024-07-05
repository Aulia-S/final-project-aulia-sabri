import dotenv from 'dotenv'
dotenv.config()

export const SECRET: string = process.env.SECRET || ''
export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || ''
export const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || ''
export const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || ''
export const DATABASE_URL: string = process.env.DATABASE_URL || ''
export const EMAIL_SERVICE: string = process.env.EMAIL_SERVICE || ''
export const EMAIL_HOST: string = process.env.EMAIL_HOST || ''
export const EMAIL_PORT: Number = (process.env.EMAIL_PORT as unknown as Number) || ''
export const EMAIL_AUTH_USER: string = process.env.EMAIL_AUTH_USER || ''
export const EMAIL_AUTH_PASS: string = process.env.EMAIL_AUTH_PASS || ''
export const EMAIL_FROM: string = process.env.EMAIL_FROM || ''
