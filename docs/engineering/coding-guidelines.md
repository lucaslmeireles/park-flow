# Coding Guidelines

> Smart Parking Platform - Backend Development Guidelines

---

# 1. Purpose

This document defines the coding conventions used throughout the Smart Parking Platform.

The goal is to keep the codebase consistent, readable and maintainable as the project evolves.

Whenever possible, prefer simplicity over clever solutions.

---

# 2. General Principles

The project follows these principles:

- SOLID
- Domain-Driven Design (DDD)
- Clean Architecture
- Composition over inheritance
- Explicit code over magic
- Small, focused classes

Code should be written for humans first.

---

# 3. Folder Organization

Every business module follows the same structure.

```
module/

application/
domain/
infrastructure/
presentation/
dto/

module.module.ts
```

Business logic must never leave the Domain Layer.

---

# 4. Naming Conventions

## Classes

Use PascalCase.

```
Ticket

ParkingZone

PricingService
```

---

## Interfaces

Do not prefix interfaces with "I".

Good

```
TicketRepository
```

Bad

```
ITicketRepository
```

---

## Variables

Use camelCase.

```
ticket

parkingSpot

calculatedAmount
```

---

## Constants

Use UPPER_SNAKE_CASE only for true constants.

```
MAX_FREE_MINUTES
```

---

## Files

Use kebab-case.

```
create-ticket.use-case.ts

pricing.service.ts

parking.repository.ts
```

---

# 5. Entities

Entities represent business concepts.

Entities:

- contain business rules
- validate their own state
- expose meaningful methods

Example

Good

```
ticket.finish()
```

Bad

```
ticket.status = FINISHED
```

---

# 6. Value Objects

Use Value Objects whenever a primitive gains business meaning.

Examples

```
Money

LicensePlate

GeoLocation
```

Avoid passing raw strings or numbers when they represent domain concepts.

---

# 7. Domain Services

Create a Domain Service when business logic:

- involves multiple entities
- doesn't naturally belong to one entity

Examples

```
PricingService

ParkingAllocationService
```

Avoid creating "Manager" or "Helper" classes.

---

# 8. Use Cases

Every business operation should be represented by one Use Case.

Examples

```
CreateTicketUseCase

FinishTicketUseCase

FindNearbyParkingUseCase
```

Use Cases coordinate the flow.

They do not contain business rules.

---

# 9. Repositories

Repositories abstract persistence.

Only Aggregates should have repositories.

Repositories should expose business-oriented methods.

Good

```
findActiveTicketByVehicle()
```

Avoid generic CRUD repositories.

---

# 10. Controllers

Controllers must remain thin.

Responsibilities:

- Receive requests
- Validate input
- Call Use Cases
- Return responses

Controllers should never:

- calculate prices
- allocate parking spots
- manipulate entities directly

---

# 11. Exceptions

Throw domain-specific exceptions.

Good

```
ParkingSpotUnavailableException
```

Bad

```
throw new Error(...)
```

Every exception should express a business rule.

---

# 12. Dependency Direction

Dependencies always point toward the Domain.

```
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

Never import Infrastructure inside the Domain.

---

# 13. Testing

Prioritize testing business rules.

Suggested order:

1. Domain
2. Use Cases
3. Controllers
4. Infrastructure

The Domain Layer should be the easiest to test.

---

# 14. Logging

Log business-relevant events.

Examples

- Ticket started
- Payment completed
- Parking search failed

Never log:

- passwords
- JWTs
- sensitive user data

---

# 15. Comments

Prefer expressive code over comments.

Good

```
ticket.finish()
```

Instead of

```
// finish ticket
```

Comments should explain **why**, not **what**.

---

# 16. TODOs

Use TODOs sparingly.

Every TODO should explain:

- why
- expected future solution

Example

```
// TODO: Replace in-memory event dispatcher with RabbitMQ publisher.
```

---

# 17. Keep It Simple

For the MVP:

Prefer:

- simple abstractions
- explicit code
- readable implementations

Avoid:

- premature optimization
- unnecessary patterns
- over-engineering

The architecture already provides enough flexibility for future evolution.

---

# 18. Final Principle

Before introducing a new abstraction, ask:

> Does this solve a real business problem today?

If the answer is no, prefer the simpler solution.

The project should evolve incrementally, guided by business needs rather than hypothetical future requirements.