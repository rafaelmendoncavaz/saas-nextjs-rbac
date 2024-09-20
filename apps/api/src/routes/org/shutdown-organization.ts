import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { auth } from "../middlewares/auth"
import {
	getOrganizationSlugSchema,
	statusDeleteOrganizationSchema,
} from "@/schema/schema"
import type { TypeGetSlug } from "@/types/types"
import { organizationSchema } from "@saas-nextjs-rbac/auth"
import { prisma } from "prisma/dbconnect"
import { Unauthorized } from "../_errors/route-errors"
import { getPermissions } from "@/utils/get-permissions"

export async function shutdownOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete(
			"/organizations/:slug",
			{
				schema: {
					tags: ["Organization"],
					summary: "Shutdown organization",
					security: [
						{
							bearerAuth: [],
						},
					],
					params: getOrganizationSlugSchema,
					response: statusDeleteOrganizationSchema,
				},
			},
			async (req, res) => {
				const { slug } = req.params as TypeGetSlug
				const userId = await req.getUserCurrentId()
				const { membership, organization } = await req.getUserMembership(slug)

				const authOrg = organizationSchema.parse(organization)

				const { cannot } = getPermissions(userId, membership.role)

				if (cannot("delete", authOrg)) {
					throw new Unauthorized(
						"You're not allowed to shutdown this organization."
					)
				}

				await prisma.organization.delete({
					where: {
						id: organization.id,
					},
				})

				return res.status(204).send()
			}
		)
}
