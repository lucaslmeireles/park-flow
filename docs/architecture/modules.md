# Backend Modules

> Smart Parking Platform - Module Architecture

---

# 1. Introduction

The Smart Parking Platform follows a **modular monolith** architecture.

Instead of organizing the project around technical layers, the backend is divided into **business modules**.

Each module encapsulates:

- its own business rules
- application services
- repositories
- entities
- controllers
- DTOs
- infrastructure implementations

A module should expose only what is necessary for other modules to interact with it.

This prevents business logic from spreading throughout the application.

---

# 2. Module Overview

```
                Smart Parking Platform

                         │

 ┌──────────────────────────────────────────────────┐
 │                    Identity                      │
 └──────────────────────────────────────────────────┘

                         │

 ┌──────────────────────────────────────────────────┐
 │                 Organizations                    │
 └──────────────────────────────────────────────────┘

                         │

 ┌──────────────────────────────────────────────────┐
 │                    Vehicles                      │
 └──────────────────────────────────────────────────┘

                         │

 ┌──────────────────────────────────────────────────┐
 │                    Parking                       │
 └──────────────────────────────────────────────────┘

                         │

 ┌──────────────────────────────────────────────────┐
 │                    Pricing                       │
 └──────────────────────────────────────────────────┘

                         │

 ┌──────────────────────────────────────────────────┐
 │                     Ticket                       │
 └──────────────────────────────────────────────────┘

                         │

 ┌──────────────────────────────────────────────────┐
 │                    Payment                       │
 └──────────────────────────────────────────────────┘

                         │

 ┌──────────────────────────────────────────────────┐
 │                     Wallet                       │
 └──────────────────────────────────────────────────┘
```

---

# 3. Identity Module

## Responsibility

Responsible for user identity and authentication.

It does **not** manage parking operations.

### Owns

- User
- Authentication
- Password management
- JWT
- Login
- Refresh Token

### Exposes

```
AuthenticateUser

GetCurrentUser

FindUserById
```

---

# 4. Organization Module

## Responsibility

Represents organizations that manage parking zones.

Organizations can be:

- Government
- Private Companies

This module also manages employees and permissions.

### Owns

- Organization
- OrganizationMembership

### Exposes

```
CreateOrganization

InviteOperator

FindOrganization

ListOrganizationParkingZones
```

---

# 5. Vehicle Module

## Responsibility

Manages vehicles registered by drivers.

A vehicle belongs to a user.

### Owns

- Vehicle

### Exposes

```
RegisterVehicle

UpdateVehicle

DeleteVehicle

FindVehicle
```

Vehicle validation (plate uniqueness) belongs here.

---

# 6. Parking Module

## Responsibility

Represents the physical parking infrastructure.

This is one of the core modules.

### Owns

- ParkingZone
- ParkingSpot

### Responsibilities

- Create parking zones
- Register parking spots
- Allocate parking spots
- Search nearby parking
- Check availability

This module does **not** calculate prices.

Pricing belongs to the Pricing Module.

---

# 7. Pricing Module

## Responsibility

Responsible for every pricing decision.

No other module is allowed to calculate parking prices.

### Owns

- PricingRule
- PricingPeriod

### Responsibilities

- Hourly pricing
- Daily pricing
- Night pricing
- Weekend pricing
- Holiday pricing

Future:

- Dynamic pricing

---

# 8. Ticket Module

## Responsibility

Represents a parking session.

A Ticket starts when a vehicle occupies a parking spot.

It finishes when the driver leaves.

### Owns

- Ticket

### Responsibilities

- Start parking session
- Finish parking session
- Cancel scheduled session
- Validate parking state

The Ticket Module requests price calculations from the Pricing Module.

---

# 9. Payment Module

## Responsibility

Responsible for charging parking sessions.

### Owns

- Payment

### Responsibilities

- Create payment
- Confirm payment
- Refund payment
- Integrate payment providers

Future providers:

- PIX
- Credit Card
- Apple Pay
- Google Pay

---

# 10. Wallet Module

## Responsibility

Represents the driver's balance.

### Owns

- Wallet
- WalletTransaction

### Responsibilities

- Recharge balance
- Debit balance
- Transaction history

Although Wallet exists in the MVP, recharge functionality may be introduced in future releases.

---

# 11. Shared Module

The Shared module contains components that do not belong to a specific business context.

Examples:

- BaseEntity
- DomainEvent
- Result
- Guard Clauses
- Exceptions
- Value Objects
- Utilities

Business logic should never be placed here.

---

# 12. Module Communication

Modules communicate through **Application Services**.

```
Ticket Module

↓

Pricing Module

↓

Payment Module
```

A module should never access another module's repositories directly.

Instead:

```
GOOD

TicketService

↓

PricingService

↓

calculate()

```

```
BAD

TicketRepository

↓

PricingRepository
```

Repositories remain private to their owning module.

---

# 13. Dependency Rules

Allowed:

```
Ticket

↓

Pricing

↓

Payment
```

Allowed:

```
Payment

↓

Wallet
```

Not Allowed:

```
Parking

↓

Payment
```

Not Allowed:

```
Vehicle

↓

Pricing
```

Every dependency should follow business flow.

---

# 14. Future Module Extraction

Because modules are isolated, future migration to microservices becomes straightforward.

Potential extractions include:

- Payment Service
- Notification Service
- AI Recommendation Service
- IoT Service
- Maps Integration

The current architecture intentionally keeps these boundaries explicit.

---

# 15. Summary

The backend is divided by **business capabilities**, not by database tables.

Each module owns its own business rules and persistence.

This organization improves maintainability, testing, scalability and long-term evolution while keeping the MVP simple enough to be developed as a modular monolith.

---

# Next Document

```
docs/architecture/request-flow.md
```

The next document describes how a request travels through the system from the HTTP endpoint to the database and back.