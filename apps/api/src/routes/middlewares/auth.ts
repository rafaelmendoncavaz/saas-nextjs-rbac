import type { FastifyInstance } from "fastify"
import { Unauthorized } from "../_errors/route-errors"
import { fastifyPlugin } from "fastify-plugin"

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
	})
})
