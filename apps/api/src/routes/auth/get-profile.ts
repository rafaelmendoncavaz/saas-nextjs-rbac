import { statusGetProfileSchema } from "@/schema/schema"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "prisma/dbconnect"

export async function getProfile(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/profile",
		{
			schema: {
				tags: ["Auth"],
				summary: "Get authenticated user profile",
				response: statusGetProfileSchema,
			},
		},
		async (req, res) => {
			const { sub } = await req.jwtVerify<{ sub: string }>()

			const user = await prisma.user.findUnique({
				select: {
					id: true,
					name: true,
					email: true,
					avatarUrl: true,
				},
				where: {
					id: sub,
				},
			})

			if (!user) {
				return res.status(404).send({
					message: "User not found",
				})
			}

			return res.status(200).send({
				user,
			})
		}
	)
}
