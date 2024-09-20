import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { auth } from "../middlewares/auth"
import {
	createOrganizationSchema,
	statusCreateOrganizationSchema,
} from "@/schema/schema"
import type { TypeCreateOrganization } from "@/types/types"
import { prisma } from "prisma/dbconnect"
import { BadRequest } from "../_errors/route-errors"
import { generateSlug } from "@/utils/create-slug"

export async function createOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			"/organizations",
			{
				schema: {
					tags: ["Organization"],
					summary: "Create a new organization",
					security: [
						{
							bearerAuth: [],
						},
					],
					body: createOrganizationSchema,
					response: statusCreateOrganizationSchema,
				},
			},
			async (req, res) => {
				const userId = await req.getUserCurrentId()

				const { name, domain, shouldAttachUsersByDomain } =
					req.body as TypeCreateOrganization

				if (domain) {
					const organizationByDomain = await prisma.organization.findUnique({
						where: {
							domain,
						},
					})

					if (organizationByDomain) {
						throw new BadRequest(
							"Another organization with the same domain already exists."
						)
					}
				}

				const organization = await prisma.organization.create({
					data: {
						name,
						slug: generateSlug(name),
						domain,
						shouldAttachUsersByDomain,
						ownerId: userId,
						members: {
							create: {
								userId,
								role: "ADMIN",
							},
						},
					},
				})

				return res.status(201).send({
					organizationId: organization.id,
				})
			}
		)
}
