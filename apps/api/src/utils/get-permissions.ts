import {
	defineAbilityFor,
	userSchema,
	type AppAbility,
	type Role,
} from "@saas-nextjs-rbac/auth"

export function getPermissions(userId: string, role: Role): AppAbility {
	const authUser = userSchema.parse({
		id: userId,
		role: role,
	})

	const ability = defineAbilityFor(authUser)

	return ability
}
