# Business Rules

## Overview

This document defines the official business rules of the Smart Parking Platform.

Business Rules describe constraints and invariants that must always be respected, regardless of the implementation or technology stack.

Any modification to these rules requires a Domain ADR.

---

# Parking Rules

## BR-001

Every Parking Zone belongs to exactly one Organization.

---

## BR-002

Every Parking Spot belongs to exactly one Parking Zone.

---

## BR-003

Parking Spots cannot be moved between Parking Zones.

If a Parking Spot must belong to another Parking Zone, a new Parking Spot must be created.

---

## BR-004

Parking Zone capacity is derived from the number of Parking Spots.


---

## BR-005

Parking Zone availability is always calculated.

Availability is never persisted.

---

## BR-006

Parking Spots may optionally contain:

- QR Code
- Sensor
- Geographic Point

These features are independent.

---

## BR-007

A Parking Spot must always have an identifier.

Examples:

- A-12
- 001
- B-18

---

## BR-008

Parking Zones must always define a valid geometry.

Supported geometry types include:

- Point
- Polygon
- MultiPolygon

---

# Vehicle Rules

## BR-009

Vehicle plate is mandatory.

---

## BR-010

Vehicle plate must be unique.

---

## BR-011

Vehicle ownership is optional.

Vehicles may exist without a registered owner.

---

## BR-012

A User may own multiple Vehicles.

---

# Ticket Rules

## BR-013

A Ticket always references exactly one Vehicle.

---

## BR-014

A Ticket always references exactly one Parking Spot.

---

## BR-015

A Vehicle may have only one ACTIVE Ticket.

---

## BR-016

A Parking Spot may have only one ACTIVE Ticket.

---

## BR-017

Finished Tickets are immutable.

---

## BR-018

Cancelled Tickets are immutable.

---

## BR-019

Scheduled Tickets may be cancelled before activation.

---

## BR-020

Tickets never calculate parking prices.

---

## BR-021

Tickets never process payments.

---

## BR-022

Tickets record only:

- Entry time
- Exit time
- Duration
- Final calculated amount

---

## BR-023

Every Ticket must record how it was created.

Possible creators:

- Customer
- Operator
- System

---

# Pricing Rules

## BR-024

Pricing is always calculated by PricingService.

---

## BR-025

PricingService delegates calculations to Pricing Strategies.

---

## BR-026

Pricing Rules determine which Pricing Strategy should be executed.

---

## BR-027

Pricing Strategies must be replaceable without modifying Ticket.

---

## BR-028

Pricing calculations must be deterministic.

Given the same inputs, the same result must always be produced.

---

# Reservation Rules

## BR-029

Reservations are supported only for private Parking Zones.

---

## BR-030

Reservations create Scheduled Tickets.

Reservation is not a separate domain entity.

---

## BR-031

Reserved Parking Spots cannot receive ACTIVE Tickets.

---

# Wallet Rules

## BR-032

Wallet is optional.

Only Customers require a Wallet.

---

## BR-033

Wallet balance is derived from Transactions.

---

## BR-034

Transactions are immutable.

---

## BR-035

Wallet never stores its own balance.

---

# Payment Rules

## BR-036

Payments are independent from Tickets.

---

## BR-037

A Ticket may exist without a successful payment.

---

## BR-038

Payments may use different payment methods.

Examples:

- Wallet
- Credit Card
- PIX

---

## BR-039

Payment status does not affect Ticket history.

---

# Organization Rules

## BR-040

Organizations belong to one City.

---

## BR-041

Organizations manage one or more Parking Zones.

---

## BR-042

Users become organization members through OrganizationMembership.

---

## BR-043

A User may belong to multiple Organizations.

---

## BR-044

Organization permissions are role-based.

---

# Security Rules

## BR-045

Only authenticated Users may create Tickets.

---

## BR-046

Only Operators may create Tickets on behalf of other users.

---

## BR-047

Only Organization Administrators may modify Parking Zones.

---

## BR-048

Pricing configuration requires administrative permissions.

---

# General Rules

## BR-049

Business rules belong to the Domain.

Infrastructure must never contain business decisions.

---

## BR-050

Aggregates communicate only through Use Cases or Domain Events.

---

# Rule Evolution

New business rules should:

- Preserve existing invariants.
- Avoid breaking Aggregate boundaries.
- Prefer configuration over code.
- Be documented before implementation.

---

# Summary

Business Rules represent the contractual behavior of the Smart Parking Platform.

All implementations must comply with these rules, regardless of programming language, framework or infrastructure.