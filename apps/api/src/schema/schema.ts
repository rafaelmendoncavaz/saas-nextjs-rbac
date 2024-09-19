import { z } from "zod"

export const createAccountSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(6),
})

export const authenticateAccountSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

export const statusGetProfileSchema = {
	200: z.object({
		user: z.object({
			id: z.string().uuid(),
			name: z.string().nullable(),
			email: z.string().email(),
			avatarUrl: z.string().url().nullable(),
		}),
	}),
	404: z.object({
		message: z.string(),
	}),
}

export const statusAuthWithPasswordSchema = {
	401: z.object({
		message: z.string(),
	}),
	201: z.object({
		token: z.string(),
	}),
}
