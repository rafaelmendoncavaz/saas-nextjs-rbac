import type {
	authenticateAccountSchema,
	createAccountSchema,
	passwordRecoverySchema,
	passwordResetSchema,
} from "@/schema/schema"
import type { FastifyInstance } from "fastify"
import type { z } from "zod"
import "fastify"

export type TypeCreateAccount = z.infer<typeof createAccountSchema>
export type TypeAuthenticateAccount = z.infer<typeof authenticateAccountSchema>
export type TypePasswordRecovery = z.infer<typeof passwordRecoverySchema>
export type TypePasswordReset = z.infer<typeof passwordResetSchema>
export type FastifyErrorHandler = FastifyInstance["errorHandler"]

declare module "fastify" {
	export interface FastifyRequest {
		getUserCurrentId(): Promise<string>
	}
}
