import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { auth } from "../middlewares/auth"
import {
	createOrganizationSchema,
	getOrganizationSlugSchema,
	statusUpdateOrganizationSchema,
} from "@/schema/schema"
import type { TypeCreateOrganization, TypeGetSlug } from "@/types/types"
import { organizationSchema } from "@saas-nextjs-rbac/auth"
import { prisma } from "prisma/dbconnect"
import { BadRequest, Unauthorized } from "../_errors/route-errors"
import { getPermissions } from "@/utils/get-permissions"

export async function updateOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.put(
			"/organizations/:slug",
			{
				schema: {
					tags: ["Organization"],
					summary: "Update organization details",
					security: [
						{
							bearerAuth: [],
						},
					],
					body: createOrganizationSchema,
					params: getOrganizationSlugSchema,
					response: statusUpdateOrganizationSchema,
				},
			},
			async (req, res) => {
				const { slug } = req.params as TypeGetSlug
				const userId = await req.getUserCurrentId()
				const { membership, organization } = await req.getUserMembership(slug)

				const { name, domain, shouldAttachUsersByDomain } =
					req.body as TypeCreateOrganization

				const authOrg = organizationSchema.parse(organization)

				const { cannot } = getPermissions(userId, membership.role)

				if (cannot("update", authOrg)) {
					throw new Unauthorized(
						"You're not allowed to update this organization."
					)
				}

				if (domain) {
					const organizationByDomain = await prisma.organization.findFirst({
						where: {
							domain,
							id: {
								not: organization.id,
							},
						},
					})

					if (organizationByDomain) {
						throw new BadRequest(
							"Another organization with the same domain already exists."
						)
					}
				}

				await prisma.organization.update({
					where: {
						id: organization.id,
					},
					data: {
						name,
						domain,
						shouldAttachUsersByDomain,
					},
				})

				return res.status(204).send()
			}
		)
}
