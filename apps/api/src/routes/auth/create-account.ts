import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import type { TypeCreateAccount } from "@/types/types"
import { createAccountSchema } from "../../schema/schema"
import { prisma } from "../../../prisma/dbconnect"
import { hash } from "bcryptjs"

export async function createAccount(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/users",
		{
			schema: {
				tags: ["Auth"],
				summary: "Create a new account",
				body: createAccountSchema,
			},
		},
		async (req, res) => {
			const { name, email, password } = req.body as TypeCreateAccount

			const userWithSameEmail = await prisma.user.findUnique({
				where: {
					email,
				},
			})

			if (userWithSameEmail) {
				return res.status(400).send({
					message: "User with same email already exists",
				})
			}

			const [, domain] = email.split("@")

			const autoJoinOrganization = await prisma.organization.findFirst({
				where: {
					domain,
					shouldAttachUsersByDomain: true,
				},
			})

			const passwordHash = await hash(password, 6)

			await prisma.user.create({
				data: {
					name,
					email,
					passwordHash,
					member_at: autoJoinOrganization
						? {
								create: {
									organizationId: autoJoinOrganization.id,
								},
							}
						: undefined,
				},
			})

			return res.status(201).send()
		}
	)
}
