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
import { errorHandler } from "@/routes/_errors/error-handler"
import { getPasswordRecovery } from "@/routes/auth/password-recovery"
import { passwordReset } from "@/routes/auth/password-reset"
import { authenticateWithGitHub } from "@/routes/auth/auth-with-github"
import { env } from "@saas-nextjs-rbac/env"
import { createOrganization } from "@/routes/org/create-organization"
import { getMembership } from "@/routes/org/get-membership"
import { getOrganizations } from "@/routes/org/get-organizations"
import { getOrganization } from "@/routes/org/get-organization"
import { updateOrganization } from "@/routes/org/update-organization"
import { shutdownOrganization } from "@/routes/org/shutdown-organization"
import { transferOrganization } from "@/routes/org/transfer-organization"

// Fastify Setup

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.setErrorHandler(errorHandler)

// FastifySwagger Setup

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "SaaS Nextjs RBAC Service",
			description: "Fullstack SaaS application with multi-tenant & RBAC",
			version: "1.0.0",
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
})
app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
})
app.register(fastifyCors)

// Authentication Routes
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(authenticateWithGitHub)
app.register(getPasswordRecovery)
app.register(passwordReset)
app.register(getProfile)

// Organization Routes
app.register(createOrganization)
app.register(getOrganizations)
app.register(getOrganization)
app.register(getMembership)
app.register(updateOrganization)
app.register(transferOrganization)
app.register(shutdownOrganization)

// Server Starter

app
	.listen({
		port: env.SERVER_PORT,
	})
	.then(() => {
		console.log(`Server is running at http://localhost:${env.SERVER_PORT}`)
	})
