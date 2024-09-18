import fastify from "fastify"
import fastifyCors from "@fastify/cors"
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod"
import { createAccount } from "../routes/auth/create-account"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)
app.register(createAccount)

const port = 3333

app
	.listen({
		port: port,
	})
	.then(() => {
		console.log(`Server is running at http://localhost:${port}`)
	})
