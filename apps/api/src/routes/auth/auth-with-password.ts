import {
	authenticateAccountSchema,
	statusAuthWithPasswordSchema,
} from "@/schema/schema"
import type { TypeAuthenticateAccount } from "@/types/types"
import { compare } from "bcryptjs"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "prisma/dbconnect"
import { BadRequest } from "../_errors/route-errors"

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
				throw new BadRequest("Invalid Credentials.")
			}

			if (userFromEmail.passwordHash === null) {
				throw new BadRequest("User does not have a password. Use social login.")
			}

			const isPasswordValid = await compare(
				password,
				userFromEmail.passwordHash
			)

			if (!isPasswordValid) {
				throw new BadRequest("Invalid Credentials.")
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
