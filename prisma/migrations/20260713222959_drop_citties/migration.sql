/*
  Warnings:

  - You are about to drop the column `city_id` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the `cities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_city_id_fkey";

-- DropIndex
DROP INDEX "organizations_city_id_idx";

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "city_id";

-- DropTable
DROP TABLE "cities";
