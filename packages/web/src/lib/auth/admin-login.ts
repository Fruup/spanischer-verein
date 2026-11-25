import z from 'zod'

export const OTP_LENGTH = 6

export const sendLoginOTPSchema = z.object({ email: z.email() })

export const verifyLoginOTPSchema = z.object({
	otp: z.string().length(OTP_LENGTH),
})
