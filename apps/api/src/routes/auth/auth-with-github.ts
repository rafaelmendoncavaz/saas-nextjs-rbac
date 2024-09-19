import {
	authenticateAccountSchema,
	authenticateWithGithubSchema,
	gitHubRequestDataSchema,
	gitHubUserDataSchema,
	statusAuthWithPasswordSchema,
} from "@/schema/schema"
import type {
	TypeAuthenticateAccount,
	TypeAuthenticateWithGithub,
} from "@/types/types"
import { compare } from "bcryptjs"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "prisma/dbconnect"
import { BadRequest } from "../_errors/route-errors"

export async function authenticateWithGitHub(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/sessions/github",
		{
			schema: {
				tags: ["Auth"],
				summary: "Authenticate with Github",
				body: authenticateWithGithubSchema,
				response: statusAuthWithPasswordSchema,
			},
		},
		async (req, res) => {
			const { code } = req.body as TypeAuthenticateWithGithub

			const gitHubOAuthURL = new URL(
				"https://github.com/login/oauth/access_token"
			)
			gitHubOAuthURL.searchParams.set("client_id", "Ov23liGqNk6dL3BTUykJ")
			gitHubOAuthURL.searchParams.set(
				"client_secret",
				"c6ecfb0531d41ff2e6f5efb1903481482a3f606e"
			)
			gitHubOAuthURL.searchParams.set(
				"redirect_uri",
				"http://localhost:3333/api/auth/callback"
			)
			gitHubOAuthURL.searchParams.set("code", code)

			const gitHubAccessTokenResponse = await fetch(gitHubOAuthURL, {
				method: "POST",
				headers: {
					Accept: "application/json",
				},
			})

			const gitHubAccessTokenData = await gitHubAccessTokenResponse.json()

			const { access_token } = gitHubRequestDataSchema.parse(
				gitHubAccessTokenData
			)

			const gitHubUserResponse = await fetch("https://api.github.com/user", {
				headers: {
					Authorization: `bearer ${access_token}`,
				},
			})

			const gitHubUserData = await gitHubUserResponse.json()

			const {
				avatar_url: avatarUrl,
				email,
				id,
				name,
			} = gitHubUserDataSchema.parse(gitHubUserData)

			if (!email) {
				throw new BadRequest(
					"Your GitHub Account must have an email to authenticate."
				)
			}

			let user = await prisma.user.findUnique({
				where: {
					email,
				},
			})

			if (!user) {
				user = await prisma.user.create({
					data: {
						name,
						email,
						avatarUrl,
					},
				})
			}

			let account = await prisma.account.findUnique({
				where: {
					provider_userId: {
						provider: "GITHUB",
						userId: user.id,
					},
				},
			})

			if (!account) {
				account = await prisma.account.create({
					data: {
						provider: "GITHUB",
						providerAccountId: id,
						userId: user.id,
					},
				})
			}

			const token = await res.jwtSign(
				{
					subject: user.id,
				},
				{
					sign: {
						expiresIn: "7d",
					},
				}
			)

			return res.status(201).send({
				token,
			})
		}
	)
}
