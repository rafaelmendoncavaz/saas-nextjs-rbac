import type {
	authenticateAccountSchema,
	authenticateWithGithubSchema,
	createAccountSchema,
	createOrganizationSchema,
	getOrganizationSlugSchema,
	passwordRecoverySchema,
	passwordResetSchema,
	transferOrganizationSchema,
} from "@/schema/schema"
import type { FastifyInstance } from "fastify"
import type { z } from "zod"
import type { Organization, Member } from "@prisma/client"
import "fastify"

declare module "fastify" {
	export interface FastifyRequest {
		getUserCurrentId(): Promise<string>
		getUserMembership(
			slug: string
		): Promise<{ organization: Organization; membership: Member }>
	}
}

export type FastifyErrorHandler = FastifyInstance["errorHandler"]
export type TypeCreateAccount = z.infer<typeof createAccountSchema>
export type TypeAuthenticateAccount = z.infer<typeof authenticateAccountSchema>
export type TypeAuthenticateWithGithub = z.infer<
	typeof authenticateWithGithubSchema
>
export type TypePasswordRecovery = z.infer<typeof passwordRecoverySchema>
export type TypePasswordReset = z.infer<typeof passwordResetSchema>
export type TypeCreateOrganization = z.infer<typeof createOrganizationSchema>
export type TypeGetSlug = z.infer<typeof getOrganizationSlugSchema>
export type TypeTransferOrganization = z.infer<
	typeof transferOrganizationSchema
>
