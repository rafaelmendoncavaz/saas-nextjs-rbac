import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { auth } from "../middlewares/auth"
import { statusGetOrganizationsSchema } from "@/schema/schema"
import { prisma } from "prisma/dbconnect"

export async function getOrganizations(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/organizations",
			{
				schema: {
					tags: ["Organization"],
					summary: "Get organizations where user is a member",
					security: [
						{
							bearerAuth: [],
						},
					],
					response: statusGetOrganizationsSchema,
				},
			},
			async (req, res) => {
				const userId = await req.getUserCurrentId()
				const organizations = await prisma.organization.findMany({
					select: {
						id: true,
						name: true,
						slug: true,
						avatarUrl: true,
						members: {
							select: {
								role: true,
							},
							where: {
								userId,
							},
						},
					},
					where: {
						members: {
							some: {
								userId,
							},
						},
					},
				})

				const orgWithUserRole = organizations.map(({ members, ...org }) => {
					return {
						...org,
						role: members[0].role,
					}
				})

				return {
					organizations: orgWithUserRole,
				}
			}
		)
}
