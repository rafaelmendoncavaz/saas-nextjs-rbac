import { passwordResetSchema, statusPasswordResetSchema } from "@/schema/schema"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "prisma/dbconnect"
import type { TypePasswordReset } from "@/types/types"
import { Unauthorized } from "../_errors/route-errors"
import { hash } from "bcryptjs"

export async function passwordReset(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/password/reset",
		{
			schema: {
				tags: ["Auth"],
				summary: "Get Password Recovery",
				body: passwordResetSchema,
				response: statusPasswordResetSchema,
			},
		},
		async (req, res) => {
			const { code, password } = req.body as TypePasswordReset

			const tokenFromCode = await prisma.token.findUnique({
				where: {
					id: code,
				},
			})

			if (!tokenFromCode) {
				throw new Unauthorized()
			}

			const passwordHash = await hash(password, 6)

			await prisma.user.update({
				where: {
					id: tokenFromCode.userId,
				},
				data: {
					passwordHash,
				},
			})

			return res.status(204).send()
		}
	)
}
