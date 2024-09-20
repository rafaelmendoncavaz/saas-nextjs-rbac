import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { auth } from "../middlewares/auth"
import {
	getOrganizationSlugSchema,
	statusGetOrganizationSchema,
} from "@/schema/schema"
import type { TypeGetSlug } from "@/types/types"

export async function getOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/organizations/:slug",
			{
				schema: {
					tags: ["Organization"],
					summary: "Get organization details",
					security: [
						{
							bearerAuth: [],
						},
					],
					params: getOrganizationSlugSchema,
					response: statusGetOrganizationSchema,
				},
			},
			async (req, res) => {
				const { slug } = req.params as TypeGetSlug

				const { organization } = await req.getUserMembership(slug)

				return {
					organization,
				}
			}
		)
}
