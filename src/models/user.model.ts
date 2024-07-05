import mongoose from 'mongoose'
import { encrypt } from '@/utils/encryption'
import { SECRET } from '@/utils/env'
import mail from '@/utils/mail'

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: String,
        default: 'user',
      },
    ],
    profilePicture: {
      type: String,
      default: 'default.jpg',
    },
    orders: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Order',
      },
    ],
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', async function (next) {
  const user = this
  user.password = encrypt(SECRET, user.password)
  next()
})

UserSchema.pre('save', async function (doc) {
  const user = this

  console.log(this.isNew)
  if (this.isNew) {
    console.log('sendmail register success to ' + user.username)

    const content = await mail.render('register-success.ejs', {
      username: user.username,
    })

    await mail.send({
      to: user.email,
      subject: 'Registration Success',
      content,
    })
  }
})

UserSchema.pre('updateOne', async function (next) {
  const user = (this as unknown as { _update: any })._update
  user.password = encrypt(SECRET, user.password)
  next()
})

UserSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

const UserModel = mongoose.model('User', UserSchema)

export default UserModel
