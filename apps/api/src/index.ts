import { defineAbilityFor, projectSchema } from "@saas-nextjs-rbac/auth"

const ability = defineAbilityFor({ role: "ADMIN", id: "randomID" })
const project = projectSchema.parse({
	id: "project-id",
	ownerId: "randomID",
})

console.log(ability.can("get", "Billing"))
console.log(ability.can("delete", project))
