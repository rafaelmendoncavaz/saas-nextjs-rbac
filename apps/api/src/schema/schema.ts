import { roleSchema } from "@saas-nextjs-rbac/auth"
import { z } from "zod"

export const createAccountSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(6),
})

export const authenticateAccountSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

export const authenticateWithGithubSchema = z.object({
	code: z.string(),
})

export const gitHubRequestDataSchema = z.object({
	access_token: z.string(),
	token_type: z.literal("bearer"),
	scope: z.string(),
})

export const gitHubUserDataSchema = z.object({
	id: z.number().int().transform(String),
	avatar_url: z.string().url(),
	name: z.string().nullable(),
	email: z.string().nullable(),
})

export const passwordRecoverySchema = z.object({
	email: z.string().email(),
})

export const passwordResetSchema = z.object({
	code: z.string(),
	password: z.string().min(6),
})

export const createOrganizationSchema = z.object({
	name: z.string(),
	domain: z.string().nullish(),
	shouldAttachUsersByDomain: z.boolean().optional(),
})

export const getOrganizationSlugSchema = z.object({
	slug: z.string(),
})

export const transferOrganizationSchema = z.object({
	transferToUserId: z.string().uuid(),
})

// Response Status Schemas

export const statusGetProfileSchema = {
	200: z.object({
		user: z.object({
			id: z.string().uuid(),
			name: z.string().nullable(),
			email: z.string().email(),
			avatarUrl: z.string().url().nullable(),
		}),
	}),
	404: z.object({
		message: z.string(),
	}),
}

export const statusAuthWithPasswordSchema = {
	201: z.object({
		token: z.string(),
	}),
}

export const statusPasswordRecoverySchema = {
	201: z.null(),
}

export const statusPasswordResetSchema = {
	204: z.null(),
}

export const statusCreateOrganizationSchema = {
	201: z.object({
		organizationId: z.string().uuid(),
	}),
}

export const statusGetMembershipSchema = {
	200: z.object({
		membership: z.object({
			role: roleSchema,
			id: z.string().uuid(),
			organizationId: z.string().uuid(),
		}),
	}),
}

export const statusGetOrganizationSchema = {
	200: z.object({
		id: z.string().uuid(),
		name: z.string(),
		slug: z.string(),
		domain: z.string().nullable(),
		shouldAttachUsersByDomain: z.boolean(),
		avatarUrl: z.string().url().nullable(),
		createdat: z.date(),
		updatedAt: z.date(),
		ownerId: z.string().uuid(),
	}),
}

export const statusGetOrganizationsSchema = {
	200: z.array(
		z.object({
			role: roleSchema,
			name: z.string(),
			id: z.string().uuid(),
			slug: z.string(),
			avatarUrl: z.string().url().nullable(),
		})
	),
}

export const statusUpdateOrganizationSchema = {
	204: z.null(),
}

export const statusDeleteOrganizationSchema = {
	204: z.null(),
}

export const statusTransferOrganizationSchema = {
	204: z.null(),
}
