/*
  Warnings:

  - You are about to drop the column `user_id` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `domain` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `should_attach_users_by_domain` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `projects` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_user_id_fkey";

-- DropIndex
DROP INDEX "projects_domain_key";

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "user_id",
ADD COLUMN     "owner_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "domain",
DROP COLUMN "should_attach_users_by_domain",
DROP COLUMN "user_id",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "owner_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
