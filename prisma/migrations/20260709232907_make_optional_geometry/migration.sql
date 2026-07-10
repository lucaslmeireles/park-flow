-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_pricingRuleId_fkey";
-- AlterTable
ALTER TABLE "parking_zones"
ALTER COLUMN "geometry" DROP NOT NULL;
-- AlterTable
-- Make pricingRuleId nullable (keep UUID type) so FK can be re-added
ALTER TABLE "tickets"
ALTER COLUMN "pricingRuleId" DROP NOT NULL;
-- AddForeignKey
ALTER TABLE "tickets"
ADD CONSTRAINT "tickets_pricingRuleId_fkey" FOREIGN KEY ("pricingRuleId") REFERENCES "pricing_rules"("id") ON DELETE
SET NULL ON UPDATE CASCADE;