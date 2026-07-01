# Folder Structure

> Smart Parking Platform - Project Structure

---

# 1. Introduction

The Smart Parking Platform follows a **Domain-Driven Design** approach combined with a **Modular Monolith** architecture.

Instead of organizing the project around technical layers (controllers, services, repositories), the source code is organized around **business capabilities**.

Every business module owns everything related to its domain:

- HTTP Controllers
- Application Use Cases
- Domain Models
- Infrastructure
- Persistence
- DTOs

This organization minimizes coupling while maximizing cohesion.

---

# 2. Project Structure

```

src/
│
├── main.ts
├── app.module.ts
│
├── modules/
│
├── platform/
│
├── shared/
│
└── config/

```

Each top-level directory has a specific responsibility.

---

# 3. modules/

The **modules** directory contains every business capability.

Each module represents a bounded context inside the application.

```

modules/

├── identity/

├── organization/

├── vehicle/

├── parking/

├── pricing/

├── ticket/

├── payment/

└── wallet/

```

A module owns:

- Controllers
- Use Cases
- Entities
- Repositories
- Infrastructure

No other module should manipulate its persistence directly.

---

# 4. Module Structure

Every business module follows the same internal organization.

```

parking/

│

├── application/

├── domain/

├── infrastructure/

├── presentation/

├── dto/

└── parking.module.ts

```

Maintaining a consistent structure reduces cognitive load across the project.

---

# 5. application/

Contains application services (Use Cases).

Responsibilities:

- Orchestrate business operations
- Open database transactions
- Coordinate repositories
- Publish domain events

Example:

```

application/

├── commands/

├── queries/

├── handlers/

└── services/

```

Typical classes:

```

CreateParkingZoneUseCase

FindNearbyParkingUseCase

FinishTicketUseCase

```

Business rules should **not** live here.

---

# 6. domain/

The Domain Layer contains the business model.

This directory is the most important part of the project.

```

domain/

├── entities/

├── value-objects/

├── services/

├── repositories/

├── events/

├── exceptions/

└── policies/

```

Nothing inside this directory depends on NestJS, Prisma or PostgreSQL.

---

## entities/

Business entities.

Examples:

```

ParkingZone

ParkingSpot

Ticket

Payment

Vehicle

```

---

## value-objects/

Immutable concepts.

Examples:

```

LicensePlate

Money

GeoLocation

ParkingDuration

```

---

## services/

Domain Services encapsulate business logic that does not naturally belong to a single entity.

Examples:

```

PricingService

ParkingAllocationService

PaymentCalculator

```

---

## repositories/

Repository interfaces.

Example:

```

TicketRepository

ParkingRepository

PaymentRepository

```

Infrastructure provides their implementation.

---

## events/

Domain events.

Examples:

```

TicketStarted

TicketFinished

PaymentCreated

PaymentSucceeded

```

---

## exceptions/

Business exceptions.

Example:

```

ParkingSpotUnavailableException

InvalidTicketStateException

PricingRuleNotFoundException

```

---

## policies/

Business policies and specifications.

Examples:

```

CanReserveSpotPolicy

CanFinishTicketPolicy

HolidayPricingPolicy

```

Policies allow business rules to evolve independently.

---

# 7. infrastructure/

Infrastructure contains every technical implementation.

```

infrastructure/

├── prisma/

├── repositories/

├── persistence/

├── integrations/

└── providers/

```

Examples:

```

PrismaTicketRepository

PixPaymentProvider

PostGISParkingRepository

```

Infrastructure implements interfaces defined by the Domain Layer.

---

# 8. presentation/

Contains everything related to HTTP.

```

presentation/

├── controllers/

├── presenters/

├── filters/

├── guards/

└── interceptors/

```

Responsibilities:

- Receive requests
- Validate authentication
- Convert HTTP ↔ DTO

No business logic belongs here.

---

# 9. dto/

Request and response contracts.

```

dto/

├── request/

└── response/

```

Examples:

```

CreateTicketRequest

FinishTicketRequest

ParkingResponse

```

DTOs should never be reused as domain entities.

---

# 10. platform/

The platform directory contains infrastructure shared by the entire application.

```

platform/

├── database/

├── auth/

├── logger/

├── cache/

├── queue/

├── storage/

└── monitoring/

```

These components are implementation details and should not contain business logic.

Examples:

- Prisma configuration
- JWT strategy
- Redis configuration
- Queue adapters
- File storage providers

---

# 11. shared/

Contains generic components reused by multiple modules.

```

shared/

├── domain/

├── utils/

├── constants/

├── decorators/

├── pipes/

└── types/

```

Examples:

```

BaseEntity

Result

DomainEvent

Guard

DateProvider

```

Business-specific classes should never be placed here.

---

# 12. config/

Application configuration.

```

config/

├── database.ts

├── auth.ts

├── app.ts

└── env.ts

```

Configuration is isolated from business code.

---

# 13. Testing Structure

Tests follow the same organization as production code.

```

parking/

├── application/

│ └── __tests__/

├── domain/

│ └── __tests__/

└── infrastructure/

└── __tests__/

```

Keeping tests close to implementation improves maintainability.

---

# 14. Dependency Rules

Allowed:

```

Presentation

↓

Application

↓

Domain

↓

Infrastructure

```

Not Allowed:

```

Presentation

↓

Infrastructure

```

Not Allowed:

```

Domain

↓

NestJS

```

Not Allowed:

```

Infrastructure

↓

Controllers

```

Dependencies always point toward the domain.

---

# 15. Naming Conventions

Use singular names for entities.

Examples:

```

Ticket

Vehicle

Payment

ParkingSpot

```

Use verbs for Use Cases.

```

CreateTicketUseCase

FinishTicketUseCase

FindNearbyParkingUseCase

```

Use nouns for services.

```

PricingService

PaymentService

ParkingAllocationService

```

Repositories should always end with **Repository**.

---

# 16. Summary

The project structure reflects the business domain instead of technical concerns.

Each module owns its own application logic, domain model, persistence and presentation layer.

This organization improves readability, maintainability and future scalability while keeping the MVP simple enough to evolve without major refactoring.

---

# Next Document

```

docs/architecture/events.md

```

The next document defines the Domain Events used by the platform and how they enable future asynchronous communication.
