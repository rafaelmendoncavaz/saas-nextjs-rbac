import {
	passwordRecoverySchema,
	statusPasswordRecoverySchema,
} from "@/schema/schema"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "prisma/dbconnect"
import type { TypePasswordRecovery } from "@/types/types"

export async function getPasswordRecovery(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/password/recover",
		{
			schema: {
				tags: ["Auth"],
				summary: "Get Password Recovery",
				body: passwordRecoverySchema,
				response: statusPasswordRecoverySchema,
			},
		},
		async (req, res) => {
			const { email } = req.body as TypePasswordRecovery

			const userFromEmail = await prisma.user.findUnique({
				where: {
					email,
				},
			})

			if (!userFromEmail) {
				return res.status(201).send()
			}

			const { id: code } = await prisma.token.create({
				data: {
					token: "PASSWORD_RECOVER",
					userId: userFromEmail.id,
				},
			})

			return res.status(201).send()
		}
	)
}
