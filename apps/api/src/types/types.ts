import type { createAccountSchema } from "@/schema/schema"
import type { z } from "zod"

export type TypeCreateAccount = z.infer<typeof createAccountSchema>
