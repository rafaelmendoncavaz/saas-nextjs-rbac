import {
	authenticateAccountSchema,
	statusAuthWithPasswordSchema,
} from "@/schema/schema"
import type { TypeAuthenticateAccount } from "@/types/types"
import { compare } from "bcryptjs"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "prisma/dbconnect"

export async function authenticateWithPassword(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/sessions/password",
		{
			schema: {
				tags: ["Auth"],
				summary: "Authenticate with e-mail and password",
				body: authenticateAccountSchema,
				response: statusAuthWithPasswordSchema,
			},
		},
		async (req, res) => {
			const { email, password } = req.body as TypeAuthenticateAccount

			const userFromEmail = await prisma.user.findUnique({
				where: {
					email,
				},
			})

			if (!userFromEmail) {
				return res.status(401).send({
					message: "Invalid credentials.",
				})
			}

			if (userFromEmail.passwordHash === null) {
				return res.status(401).send({
					message: "User does not have a password. Use social login.",
				})
			}

			const isPasswordValid = await compare(
				password,
				userFromEmail.passwordHash
			)

			if (!isPasswordValid) {
				return res.status(401).send({
					message: "Invalid credentials.",
				})
			}

			const token = await res.jwtSign(
				{
					subject: userFromEmail.id,
				},
				{
					sign: {
						expiresIn: "7d",
					},
				}
			)

			return res.status(201).send({
				token,
			})
		}
	)
}
