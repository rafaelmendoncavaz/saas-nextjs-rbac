import { statusGetProfileSchema } from "@/schema/schema"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "prisma/dbconnect"
import { BadRequest } from "../_errors/route-errors"
import { auth } from "../middlewares/auth"

export async function getProfile(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/profile",
			{
				schema: {
					tags: ["Auth"],
					summary: "Get authenticated user profile",
					response: statusGetProfileSchema,
				},
			},
			async (req, res) => {
				const userId = await req.getUserCurrentId()

				const user = await prisma.user.findUnique({
					select: {
						id: true,
						name: true,
						email: true,
						avatarUrl: true,
					},
					where: {
						id: userId,
					},
				})

				if (!user) {
					throw new BadRequest("User not found.")
				}

				return res.status(200).send({
					user,
				})
			}
		)
}
