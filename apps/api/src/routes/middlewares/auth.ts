import type { FastifyInstance } from "fastify"
import { Unauthorized } from "../_errors/route-errors"
import { fastifyPlugin } from "fastify-plugin"
import { prisma } from "prisma/dbconnect"

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
	app.addHook("preHandler", async (request) => {
		request.getUserCurrentId = async () => {
			try {
				const { sub } = await request.jwtVerify<{ sub: string }>()

				return sub
			} catch {
				throw new Unauthorized("Invalid authorization token.")
			}
		}

		request.getUserMembership = async (slug: string) => {
			const userId = await request.getUserCurrentId()
			const member = await prisma.member.findFirst({
				where: {
					userId,
					organization: {
						slug,
					},
				},
				include: {
					organization: true,
				},
			})

			if (!member) {
				throw new Unauthorized("You are not a member of this organization.")
			}

			const { organization, ...membership } = member

			return {
				organization,
				membership,
			}
		}
	})
})
