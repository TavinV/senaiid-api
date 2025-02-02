import PasswordResetToken from '../models/forgot_password_token_model.js'
import { randomBytes } from 'crypto'

const createPasswordResetToken = async (user_id) => {
    const tokenCode = randomBytes(30).toString('hex')
    const expires = new Date(Date.now() + 10 * 60 * 1000)

    try {
        const passwordResetToken = await PasswordResetToken.create({ user_id, token: tokenCode, expires })
        return [tokenCode, null]

    } catch (error) {
        console.log("PASSWORD RESET SERVICE ERROR")
        console.log(error)
        return [false, 500]
    }
}

const verifyPasswordResetToken = async (token) => {
    const tokenData = await PasswordResetToken.findOne({ token: token })

    if (!tokenData) {
        return [null, 404]
    } else {
        return [tokenData, null]
    }
}

const deletePasswordResetToken = async (token) => {
    await PasswordResetToken.deleteMany({ token: token })
}

export { createPasswordResetToken, verifyPasswordResetToken, deletePasswordResetToken }
