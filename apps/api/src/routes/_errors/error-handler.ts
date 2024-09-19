import type { FastifyErrorHandler } from "@/types/types"
import { ZodError } from "zod"
import { BadRequest, Unauthorized } from "./route-errors"

export const errorHandler: FastifyErrorHandler = (error, req, res) => {
	if (error instanceof ZodError) {
		return res.status(400).send({
			message: "Validation Error.",
			errors: error.flatten().fieldErrors,
		})
	}

	if (error instanceof BadRequest) {
		return res.status(400).send({
			message: error.message,
		})
	}

	if (error instanceof Unauthorized) {
		return res.status(401).send({
			message: error.message,
		})
	}

	console.error(error)

	return res.status(500).send({
		message: "Internal Server Error",
	})
}
