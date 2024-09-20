import {
	getOrganizationSlugSchema,
	statusGetMembershipSchema,
} from "@/schema/schema"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { auth } from "../middlewares/auth"
import type { TypeGetSlug } from "@/types/types"

export async function getMembership(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/organization/:slug/membership",
			{
				schema: {
					tags: ["Organization"],
					summary: "Get organization membership status",
					security: [
						{
							bearerAuth: [],
						},
					],
					params: getOrganizationSlugSchema,
					response: statusGetMembershipSchema,
				},
			},
			async (req, res) => {
				const { slug } = req.params as TypeGetSlug

				const { membership } = await req.getUserMembership(slug)

				return {
					membership: {
						role: membership.role,
						id: membership.id,
						organizationId: membership.organizationId,
					},
				}
			}
		)
}
