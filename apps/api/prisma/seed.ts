import { faker } from "@faker-js/faker"
import { hash } from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seed() {
	await prisma.user.deleteMany()
	await prisma.organization.deleteMany()

	const passwordHash = await hash("123456", 6)

	const user1 = await prisma.user.create({
		data: {
			name: "John Doe",
			email: "johndoe@acme.com",
			avatarUrl: faker.image.avatarGitHub(),
			passwordHash,
		},
	})

	const user2 = await prisma.user.create({
		data: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			avatarUrl: faker.image.avatarGitHub(),
			passwordHash,
		},
	})

	const user3 = await prisma.user.create({
		data: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			avatarUrl: faker.image.avatarGitHub(),
			passwordHash,
		},
	})

	await prisma.organization.create({
		data: {
			name: "ACME Inc (Admin)",
			domain: "acme.com",
			slug: "acme-admin",
			avatarUrl: faker.image.avatarGitHub(),
			shouldAttachUsersByDomain: true,
			ownerId: user1.id,
			projects: {
				createMany: {
					data: [
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user1.id,
								user2.id,
								user3.id,
							]),
						},
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user1.id,
								user2.id,
								user3.id,
							]),
						},
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user1.id,
								user2.id,
								user3.id,
							]),
						},
					],
				},
			},
			members: {
				createMany: {
					data: [
						{
							userId: user1.id,
							role: "ADMIN",
						},
						{
							userId: user2.id,
							role: "MEMBER",
						},
						{
							userId: user3.id,
							role: "MEMBER",
						},
					],
				},
			},
		},
	})

	await prisma.organization.create({
		data: {
			name: "ACME Inc (Member)",
			slug: "acme-member",
			avatarUrl: faker.image.avatarGitHub(),
			ownerId: user1.id,
			projects: {
				createMany: {
					data: [
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user1.id,
								user2.id,
								user3.id,
							]),
						},
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user1.id,
								user2.id,
								user3.id,
							]),
						},
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user1.id,
								user2.id,
								user3.id,
							]),
						},
					],
				},
			},
			members: {
				createMany: {
					data: [
						{
							userId: user1.id,
							role: "MEMBER",
						},
						{
							userId: user2.id,
							role: "ADMIN",
						},
						{
							userId: user3.id,
							role: "MEMBER",
						},
					],
				},
			},
		},
	})

	await prisma.organization.create({
		data: {
			name: "ACME Inc (Billing)",
			slug: "acme-billing",
			avatarUrl: faker.image.avatarGitHub(),
			ownerId: user1.id,
			projects: {
				createMany: {
					data: [
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user1.id,
								user2.id,
								user3.id,
							]),
						},
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user1.id,
								user2.id,
								user3.id,
							]),
						},
						{
							name: faker.lorem.words(5),
							slug: faker.lorem.slug(5),
							description: faker.lorem.paragraph(),
							avatarUrl: faker.image.avatarGitHub(),
							ownerId: faker.helpers.arrayElement([
								user1.id,
								user2.id,
								user3.id,
							]),
						},
					],
				},
			},
			members: {
				createMany: {
					data: [
						{
							userId: user1.id,
							role: "BILLING",
						},
						{
							userId: user2.id,
							role: "MEMBER",
						},
						{
							userId: user3.id,
							role: "ADMIN",
						},
					],
				},
			},
		},
	})
}

seed()
