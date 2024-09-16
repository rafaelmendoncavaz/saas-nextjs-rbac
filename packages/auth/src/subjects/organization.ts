import { z } from "zod"
import { organizationSchema } from "../models/organization"

export const organizationSubject = z.tuple([
	z.union([
		z.literal("transfer_ownership"),
		z.literal("delete"),
		z.literal("update"),
		z.literal("manage"),
	]),
	z.union([z.literal("Organization"), organizationSchema]),
])

export type OrganizationSubject = z.infer<typeof organizationSubject>
