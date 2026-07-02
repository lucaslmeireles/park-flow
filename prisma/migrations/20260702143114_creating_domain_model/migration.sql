CREATE EXTENSION IF NOT EXISTS postgis;
-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('GOVERNMENT', 'PRIVATE');
-- CreateEnum
CREATE TYPE "OperationMode" AS ENUM ('SELF_SERVICE', 'OPERATOR', 'HYBRID');
-- CreateEnum
CREATE TYPE "ParkingSpotType" AS ENUM (
    'STANDARD',
    'DISABLED',
    'ELECTRIC',
    'MOTORCYCLE',
    'VIP'
);
-- CreateEnum
CREATE TYPE "ParkingSpotStatus" AS ENUM (
    'AVAILABLE',
    'OCCUPIED',
    'RESERVED',
    'OUT_OF_SERVICE',
    'DISABLED'
);
-- CreateEnum
CREATE TYPE "Weekday" AS ENUM (
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
);
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('ACTIVE', 'FINISHED', 'SCHEDULED', 'CANCELLED');
-- CreateEnum
CREATE TYPE "TicketCreatorType" AS ENUM ('DRIVER', 'OPERATOR', 'SENSOR', 'LPR');
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('WALLET', 'CREDIT_CARD', 'PIX', 'CASH');
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT', 'REFUND');
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OPERATOR', 'ADMIN');
-- CreateEnum
CREATE TYPE "VehicleCategory" AS ENUM ('PRIVATE', 'VAN', 'BUS');
-- CreateEnum
CREATE TYPE "PricingStrategy" AS ENUM (
    'HOURLY',
    'DAILY',
    'WEEKEND',
    'NIGHT',
    'HOLIDAY',
    'CUSTOM'
);
-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "organization_memberships" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "UserRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "organization_memberships_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "owner_id" UUID,
    "nickname" TEXT,
    "plate" TEXT NOT NULL,
    "category" "VehicleCategory" NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "parking_zones" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "display_name" TEXT NOT NULL,
    "display_address" TEXT NOT NULL,
    "geometry" geometry NOT NULL,
    "operation_mode" "OperationMode" NOT NULL,
    "active" BOOLEAN NOT NULL,
    "capacity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "parking_zones_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "parking_spots" (
    "id" UUID NOT NULL,
    "parking_zone_id" UUID NOT NULL,
    "identifier" TEXT NOT NULL,
    "spot_type" "ParkingSpotType" NOT NULL,
    "status" "ParkingSpotStatus" NOT NULL,
    "geometry" geometry,
    "sensor_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "parking_spots_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "pricing_rules" (
    "id" UUID NOT NULL,
    "parking_zone_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "vehicle_category" "VehicleCategory",
    "priority" INTEGER NOT NULL,
    "strategy" "PricingStrategy" NOT NULL,
    "active" BOOLEAN NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveUntil" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "pricing_rules_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "pricing_periods" (
    "id" UUID NOT NULL,
    "pricing_rule_id" UUID NOT NULL,
    "weekday" "Weekday" NOT NULL,
    "start_time" TIME(0) NOT NULL,
    "end_time" TIME(0) NOT NULL,
    "price_per_hour" DECIMAL(10, 2) NOT NULL,
    "price_per_day" DECIMAL(10, 2) NOT NULL,
    "max_daily_price" DECIMAL(10, 2),
    "free_minutes" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "pricing_periods_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "tickets" (
    "id" UUID NOT NULL,
    "parking_spot_id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "creator_type" "TicketCreatorType" NOT NULL,
    "status" "TicketStatus" NOT NULL,
    "scheduled_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "calculated_amount" DECIMAL(10, 2),
    "pricingRuleId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "amount" DECIMAL(10, 2) NOT NULL,
    "provider_reference" TEXT,
    "failure_reason" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "wallets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL,
    "balance" DECIMAL(10, 2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "payment_id" UUID,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(10, 2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
-- CreateIndex
CREATE INDEX "organizations_city_id_idx" ON "organizations"("city_id");
-- CreateIndex
CREATE UNIQUE INDEX "organization_memberships_organization_id_user_id_key" ON "organization_memberships"("organization_id", "user_id");
-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plate_key" ON "vehicles"("plate");
-- CreateIndex
CREATE INDEX "vehicles_owner_id_idx" ON "vehicles"("owner_id");
-- CreateIndex
CREATE INDEX "parking_zones_organization_id_idx" ON "parking_zones"("organization_id");
-- CreateIndex
CREATE INDEX "parking_spots_parking_zone_id_status_idx" ON "parking_spots"("parking_zone_id", "status");
-- CreateIndex
CREATE INDEX "parking_spots_parking_zone_id_idx" ON "parking_spots"("parking_zone_id");
-- CreateIndex
CREATE INDEX "parking_spots_status_idx" ON "parking_spots"("status");
-- CreateIndex
CREATE UNIQUE INDEX "parking_spots_parking_zone_id_identifier_key" ON "parking_spots"("parking_zone_id", "identifier");
-- CreateIndex
CREATE INDEX "pricing_rules_parking_zone_id_idx" ON "pricing_rules"("parking_zone_id");
-- CreateIndex
CREATE INDEX "pricing_periods_pricing_rule_id_idx" ON "pricing_periods"("pricing_rule_id");
-- CreateIndex
CREATE INDEX "tickets_parking_spot_id_idx" ON "tickets"("parking_spot_id");
-- CreateIndex
CREATE INDEX "tickets_vehicle_id_idx" ON "tickets"("vehicle_id");
-- CreateIndex
CREATE INDEX "tickets_status_idx" ON "tickets"("status");
-- CreateIndex
CREATE UNIQUE INDEX "payments_ticket_id_key" ON "payments"("ticket_id");
-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");
-- CreateIndex
CREATE INDEX "wallet_transactions_wallet_id_idx" ON "wallet_transactions"("wallet_id");
-- AddForeignKey
ALTER TABLE "organizations"
ADD CONSTRAINT "organizations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "organization_memberships"
ADD CONSTRAINT "organization_memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "organization_memberships"
ADD CONSTRAINT "organization_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "vehicles"
ADD CONSTRAINT "vehicles_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "parking_zones"
ADD CONSTRAINT "parking_zones_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "parking_spots"
ADD CONSTRAINT "parking_spots_parking_zone_id_fkey" FOREIGN KEY ("parking_zone_id") REFERENCES "parking_zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "pricing_rules"
ADD CONSTRAINT "pricing_rules_parking_zone_id_fkey" FOREIGN KEY ("parking_zone_id") REFERENCES "parking_zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "pricing_periods"
ADD CONSTRAINT "pricing_periods_pricing_rule_id_fkey" FOREIGN KEY ("pricing_rule_id") REFERENCES "pricing_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "tickets"
ADD CONSTRAINT "tickets_parking_spot_id_fkey" FOREIGN KEY ("parking_spot_id") REFERENCES "parking_spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "tickets"
ADD CONSTRAINT "tickets_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "tickets"
ADD CONSTRAINT "tickets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "tickets"
ADD CONSTRAINT "tickets_pricingRuleId_fkey" FOREIGN KEY ("pricingRuleId") REFERENCES "pricing_rules"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "payments"
ADD CONSTRAINT "payments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "wallets"
ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "wallet_transactions"
ADD CONSTRAINT "wallet_transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "wallet_transactions"
ADD CONSTRAINT "wallet_transactions_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE
SET NULL ON UPDATE CASCADE;