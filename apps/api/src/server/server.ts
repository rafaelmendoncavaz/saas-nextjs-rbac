import fastify from "fastify"
import fastifyCors from "@fastify/cors"
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import fastifyJwt from "@fastify/jwt"
import { createAccount } from "../routes/auth/create-account"
import { authenticateWithPassword } from "@/routes/auth/auth-with-password"
import { getProfile } from "@/routes/auth/get-profile"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "SaaS Nextjs RBAC Service",
			description: "Fullstack SaaS application with multi-tenant & RBAC",
			version: "1.0.0",
		},
		servers: [],
	},
	transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
})
app.register(fastifyJwt, {
	secret: "my-jwt-secret",
})
app.register(fastifyCors)
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)

const port = 3333

app
	.listen({
		port: port,
	})
	.then(() => {
		console.log(`Server is running at http://localhost:${port}`)
	})
