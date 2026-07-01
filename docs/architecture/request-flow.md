# Request Flow

> Smart Parking Platform - Request Lifecycle

---

# 1. Introduction

This document describes how requests flow through the Smart Parking Platform.

One of the project's architectural goals is to keep business logic isolated from infrastructure concerns.

Every request follows the same pipeline regardless of the business module.

```
HTTP Request

↓

Controller

↓

Application Use Case

↓

Domain Services

↓

Repositories

↓

Database

↓

Response
```

Each layer has a single responsibility.

---

# 2. Request Lifecycle

```
                   HTTP Request
                         │
                         ▼
                  NestJS Controller
                         │
                         ▼
                DTO Validation (Zod)
                         │
                         ▼
                Application Use Case
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
     Domain Services          Repository Interfaces
            │                         │
            └────────────┬────────────┘
                         ▼
               Infrastructure Layer
                         ▼
               Prisma + PostgreSQL
                         ▼
                    HTTP Response
```

---

# 3. Layer Responsibilities

## Controller

The controller is responsible only for:

- Receiving HTTP requests
- Validating input
- Calling the appropriate Use Case
- Returning HTTP responses

Controllers must never contain business rules.

### Good

```typescript
@Post()
async create(@Body() dto: CreateTicketDto) {
    return this.createTicket.execute(dto);
}
```

### Bad

```typescript
@Post()
async create() {

    if (parkingSpot.status === "AVAILABLE") {

        // calculate price

        // update database

        // create payment

    }

}
```

---

## Application Layer

Application Services orchestrate business operations.

Responsibilities:

- Coordinate entities
- Coordinate domain services
- Open transactions
- Publish domain events
- Return DTOs

They should **not** implement business rules.

Example:

```
StartTicketUseCase

↓

ParkingAllocationService

↓

Ticket.start()

↓

Repository.save()
```

---

## Domain Layer

This is the heart of the system.

Contains:

- Entities
- Value Objects
- Domain Services
- Business Rules

Everything inside the Domain Layer should be independent of frameworks.

Example:

```
Ticket.finish()

↓

PricingService.calculate()

↓

PaymentRequiredEvent
```

---

## Infrastructure Layer

Responsible for technical implementation.

Contains:

- Prisma repositories
- Database access
- Redis
- External APIs
- Payment providers

Infrastructure implements interfaces defined by the Domain Layer.

---

# 4. Example Flow — Start Parking Session

```
POST /tickets
```

```
Client

↓

TicketController

↓

StartTicketUseCase

↓

ParkingAllocationService

↓

PricingService

↓

Ticket.start()

↓

TicketRepository.save()

↓

201 Created
```

Notice that no pricing calculation happens inside the controller.

---

# 5. Example Flow — Finish Parking Session

```
PATCH /tickets/{id}/finish
```

```
Client

↓

TicketController

↓

FinishTicketUseCase

↓

Ticket.finish()

↓

PricingService.calculate()

↓

Payment.create()

↓

PaymentRepository.save()

↓

200 OK
```

The Ticket module delegates pricing to the Pricing module.

---

# 6. Example Flow — Search Nearby Parking

```
GET /parking?lat=-22.50&lng=-44.10
```

```
ParkingController

↓

FindNearbyParkingUseCase

↓

ParkingRepository

↓

PostGIS Query

↓

Available Parking Zones
```

The search is executed directly by PostgreSQL using PostGIS spatial functions.

---

# 7. Transactions

Database transactions should be started only inside the Application Layer.

```
GOOD

Use Case

↓

Transaction

↓

Repositories

↓

Commit
```

Controllers should never open transactions.

---

# 8. Validation

Validation occurs at multiple levels.

## Request Validation

Performed using Zod.

Example:

- Required fields
- Invalid email
- Invalid UUID

---

## Domain Validation

Performed by Entities and Domain Services.

Examples:

- Vehicle already parked
- Parking spot unavailable
- Invalid pricing rule
- Finished ticket cannot be finished again

---

## Database Validation

Handled by PostgreSQL.

Examples:

- Unique constraints
- Foreign keys
- Not Null

Each layer validates different concerns.

---

# 9. Error Handling

Errors are translated according to the layer.

```
Database Error

↓

Repository Exception

↓

Domain Exception

↓

Application Exception

↓

HTTP Exception
```

Controllers only translate exceptions into HTTP responses.

---

# 10. Dependency Direction

Dependencies always point inward.

```
Controller

↓

Use Case

↓

Domain

↓

Infrastructure
```

Never:

```
Infrastructure

↓

Domain
```

---

# 11. Domain Events

Certain actions publish events.

Example:

```
TicketStarted

TicketFinished

PaymentCreated

PaymentSucceeded
```

Initially these events are processed synchronously.

Future versions may publish them asynchronously using a message broker.

---

# 12. Future Evolution

Because responsibilities are well defined, future integrations become simple.

Examples:

```
TicketFinished

↓

Publish Event

↓

Notification Service

↓

Send Push Notification
```

or

```
PaymentSucceeded

↓

Publish Event

↓

Loyalty Service
```

No modifications to the Ticket module are required.

---

# 13. Summary

The request flow is intentionally simple.

Every layer has one responsibility.

Business rules remain inside the Domain Layer.

Infrastructure remains replaceable.

Controllers remain thin.

This architecture improves testability, maintainability and long-term scalability while keeping the MVP straightforward to develop.

---

# Next Document

```
docs/architecture/events.md
```

The next document describes the domain events published by each module and how they enable future asynchronous communication.