import type {
	authenticateAccountSchema,
	createAccountSchema,
} from "@/schema/schema"
import type { z } from "zod"

export type TypeCreateAccount = z.infer<typeof createAccountSchema>
export type TypeAuthenticateAccount = z.infer<typeof authenticateAccountSchema>
