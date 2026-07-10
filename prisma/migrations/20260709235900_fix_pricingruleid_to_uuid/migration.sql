BEGIN;
UPDATE "tickets"
SET "pricingRuleId" = NULL
WHERE "pricingRuleId" IS NOT NULL
    AND NOT (
        ("pricingRuleId"::text) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    );
ALTER TABLE "tickets"
ALTER COLUMN "pricingRuleId" TYPE uuid USING ("pricingRuleId"::uuid);
COMMIT;