# Architecture Overview

> Smart Parking Platform - Backend Architecture

---

# 1. Introduction

The Smart Parking Platform is a backend application designed to unify public and private parking management into a single platform.

Instead of treating municipal parking and private parking as separate systems, the platform models both as the same business concept: **Parking Zones** managed by different organizations.

The primary business objective is simple:

> Allow drivers to discover available parking spaces near their destination, regardless of whether they belong to the city government or a private company.

Although the MVP focuses on parking discovery, ticket management and payments, the architecture has been designed to support future features such as IoT sensors, AI-assisted parking recommendations, external map providers and dynamic pricing without requiring major structural changes.

---

# 2. Architectural Goals

The project follows a set of architectural principles intended to keep the codebase maintainable as the system grows.

## Primary Goals

- Domain-first design
- High cohesion
- Low coupling
- Business logic independent from frameworks
- Simple deployment
- Easy testing
- Incremental scalability

---

# 3. Architectural Style

The Smart Parking Platform adopts a **Modular Monolith** architecture.

At the current stage, splitting the application into microservices would introduce unnecessary operational complexity while providing little business value.

Instead, the system is divided into independent modules that communicate internally while sharing the same deployment unit.

This approach offers several advantages:

- simple deployment
- transactional consistency
- easier debugging
- lower infrastructure cost
- possibility of future extraction into microservices

The domain model remains independent from deployment decisions.

---

# 4. Architectural Principles

## Domain First

Business rules are the most important part of the system.

Frameworks, databases and external services are implementation details.

```
Business Rules

↓

Application

↓

Infrastructure
```

The domain must never depend on NestJS, Prisma or PostgreSQL.

---

## Dependency Rule

Dependencies always point toward the domain.

```
Controllers

↓

Application Services

↓

Domain

↓

Repositories (Interfaces)

↓

Infrastructure
```

Infrastructure depends on the domain.

The domain never depends on infrastructure.

---

## Explicit Boundaries

Every module owns its own business rules.

No module is allowed to manipulate another module's persistence directly.

Communication happens through:

- Application Services
- Domain Events
- Repository Interfaces

---

## Rich Domain Model

Entities encapsulate business rules.

Business decisions should never be scattered across controllers.

Example:

Instead of:

```
Controller

↓

calculate price

↓

Repository
```

The calculation belongs to:

```
PricingService
```

---

## Framework Independence

NestJS is used as the web framework, but the business model should remain portable.

If NestJS is replaced in the future, the Domain Layer should remain unchanged.

---

# 5. High Level Architecture

```
                    Client
                       │
                 HTTP / REST API
                       │
                NestJS Controllers
                       │
             Application Layer (Use Cases)
                       │
                 Domain Layer
                       │
      Repository Interfaces & Services
                       │
         Infrastructure Implementations
                       │
      PostgreSQL + PostGIS + Prisma ORM
```

Each layer has a single responsibility.

---

# 6. Technology Stack

| Layer | Technology |
|--------|------------|
| Runtime | Node.js |
| Framework | NestJS |
| ORM | Prisma |
| Database | PostgreSQL |
| Spatial Queries | PostGIS |
| Authentication | JWT |
| Validation | Zod |
| API Documentation | OpenAPI / Swagger |
| Testing | Vitest |
| Containers | Docker |

The chosen technologies are implementation details and may evolve independently from the domain.

---

# 7. Domain Driven Design

The project is heavily inspired by Domain-Driven Design (DDD).

The domain is organized around business capabilities instead of technical layers.

Core concepts include:

- Entities
- Value Objects
- Aggregates
- Domain Services
- Repository Interfaces
- Domain Events

The database model mirrors the domain rather than the opposite.

---

# 8. Evolution Strategy

The system is intentionally designed for incremental evolution.

The MVP includes:

- Parking discovery
- Parking sessions
- Pricing engine
- Payments
- Wallet infrastructure
- Public and private parking

Future versions may introduce:

- Reservations
- IoT sensors
- License Plate Recognition
- AI recommendations
- Google Maps integration
- Dynamic pricing
- Event-driven architecture
- Distributed services

The current architecture keeps extension points for each of these features while avoiding unnecessary complexity in the MVP.

---

# 9. Design Philosophy

The Smart Parking Platform is not intended to be a CRUD application.

Its architecture reflects business processes instead of database tables.

Parking sessions, pricing rules, payments and parking allocation are modeled as business concepts with explicit responsibilities.

This allows new features to be introduced without modifying existing core components.

The project favors simplicity in implementation while preserving long-term maintainability.

Following the SOLID principles, Domain-Driven Design and Clean Architecture, every architectural decision aims to maximize readability, extensibility and correctness before optimization.

---

# Next Document

The next document describes how the backend is divided into business modules.

```
docs/architecture/modules.md
```