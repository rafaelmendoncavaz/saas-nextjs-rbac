import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { auth } from "../middlewares/auth"
import {
	transferOrganizationSchema,
	getOrganizationSlugSchema,
	statusTransferOrganizationSchema,
} from "@/schema/schema"
import type { TypeGetSlug, TypeTransferOrganization } from "@/types/types"
import { organizationSchema } from "@saas-nextjs-rbac/auth"
import { prisma } from "prisma/dbconnect"
import { BadRequest, Unauthorized } from "../_errors/route-errors"
import { getPermissions } from "@/utils/get-permissions"

export async function transferOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.patch(
			"/organizations/:slug/owner",
			{
				schema: {
					tags: ["Organization"],
					summary: "Transfer organization ownership",
					security: [
						{
							bearerAuth: [],
						},
					],
					body: transferOrganizationSchema,
					params: getOrganizationSlugSchema,
					response: statusTransferOrganizationSchema,
				},
			},
			async (req, res) => {
				const { slug } = req.params as TypeGetSlug
				const userId = await req.getUserCurrentId()
				const { membership, organization } = await req.getUserMembership(slug)

				const { transferToUserId } = req.body as TypeTransferOrganization

				const authOrg = organizationSchema.parse(organization)

				const { cannot } = getPermissions(userId, membership.role)

				if (cannot("transfer_ownership", authOrg)) {
					throw new Unauthorized(
						"You're not allowed to transfer this organization ownership."
					)
				}

				const transferToMember = await prisma.member.findUnique({
					where: {
						organizationId_userId: {
							organizationId: organization.id,
							userId: transferToUserId,
						},
					},
				})

				if (!transferToMember) {
					throw new BadRequest(
						"Targeted user is not a member of this organization."
					)
				}

				await prisma.$transaction([
					prisma.member.update({
						where: {
							organizationId_userId: {
								organizationId: organization.id,
								userId: transferToUserId,
							},
						},
						data: {
							role: "ADMIN",
						},
					}),
					prisma.organization.update({
						where: {
							id: organization.id,
						},
						data: {
							ownerId: transferToUserId,
						},
					}),
				])

				return res.status(204).send()
			}
		)
}
