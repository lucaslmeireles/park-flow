# Glossary

## Overview

This glossary defines the official ubiquitous language of the Smart Parking Platform.

Every document, source code file and discussion should use these terms consistently.

Whenever possible, avoid synonyms.

---

# A

## Aggregate

A consistency boundary responsible for enforcing business invariants.

Only Aggregate Roots are loaded directly from repositories.

---

# C

## City

A municipality served by the platform.

Cities organize Organizations but do not operate parking areas directly.

---

## Customer

A platform user capable of creating parking sessions and making payments.

Customers may own Vehicles and Wallets.

---

# D

## Domain Event

An immutable business fact that has already happened.

Examples:

- TicketStarted
- PaymentSucceeded
- ParkingSpotReleased

---

# G

## Geometry

A geospatial representation of a Parking Zone.

Supported by PostGIS.

Typical geometries:

- Point
- Polygon
- MultiPolygon

---

# O

## Operator

A user acting on behalf of an Organization.

Operators may create parking sessions for customers.

Operators do not require Wallets.

---

## Organization

The legal entity responsible for operating Parking Zones.

Organizations may represent:

- Government agencies
- Private companies

---

## Organization Membership

Represents the relationship between a User and an Organization.

Defines permissions within the organization.

---

# P

## Parking Session

The period during which a vehicle occupies a Parking Spot.

Represented by a Ticket.

---

## Parking Spot

A single parking position.

Parking Spots may optionally include:

- Geographic coordinates
- QR Codes
- IoT Sensors

---

## Parking Zone

A physical area where vehicles may park.

Examples:

- Street block
- Shopping mall parking
- Airport parking
- University campus

Parking Zones are the primary searchable units of the platform.

---

## Payment

Represents the financial settlement of a parking session.

Payments are independent from Tickets.

A Payment may be:

- Pending
- Paid
- Failed
- Refunded

---

## Pricing Rule

A configurable rule that determines which Pricing Strategy should be applied.

Pricing Rules never calculate prices.

---

## Pricing Strategy

An algorithm responsible for calculating parking costs.

Examples:

- Hourly Pricing
- Daily Pricing
- Night Pricing
- Weekend Pricing

---

# Q

## QR Code

An optional identifier associated with a Parking Spot.

Used to simplify parking session creation.

Scanning a QR Code allows customers to immediately identify the occupied Parking Spot.

---

# T

## Ticket

Represents a parking session.

A Ticket stores:

- Vehicle
- Parking Spot
- Entry time
- Exit time
- Duration
- Final calculated amount

Tickets never process payments.

---

## Transaction

A financial movement recorded inside a Wallet.

Transactions are immutable.

Examples:

- Credit
- Debit
- Refund

---

# U

## User

An authenticated identity within the platform.

Users may act as:

- Customer
- Operator
- Organization Administrator

Permissions are determined through Organization Memberships.

---

# V

## Vehicle

Represents a vehicle capable of using Parking Spots.

Vehicle ownership is optional.

---

# W

## Wallet

A customer's financial account.

Wallet balance is derived from Transactions.

Wallets do not store balances directly.

---

# Language Conventions

The following names are considered official.

| Preferred | Avoid |
|------------|-------|
| Parking Zone | Parking Lot |
| Parking Spot | Space |
| Ticket | Parking Session Record |
| Organization | Company |
| Customer | Client |
| Payment | Charge |
| Pricing Rule | Tariff Rule |
| Organization Membership | Employee |
| Vehicle | Car |

---

# Naming Principles

The Smart Parking Platform follows these naming principles:

- Business terms first.
- Avoid technical terminology.
- Avoid abbreviations.
- Prefer nouns over verbs.
- Keep names technology independent.

---

# Summary

This glossary defines the official language of the Smart Parking Platform.

Maintaining a consistent ubiquitous language ensures that developers, business stakeholders and documentation describe the domain using the same terminology.