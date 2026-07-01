# Deployment Architecture

> Smart Parking Platform - Infrastructure & Deployment

---

# 1. Introduction

The Smart Parking Platform is initially deployed as a **Modular Monolith**.

The objective of the MVP is to validate the business model while keeping operational complexity low.

Although the application runs as a single deployable unit, its architecture has been designed to evolve incrementally into a distributed system without requiring significant changes to the domain model.

---

# 2. Current Architecture (MVP)

```
                 Internet
                      │
               Reverse Proxy
                      │
              NestJS Application
                      │
        ┌─────────────┴─────────────┐
        │                           │
 PostgreSQL + PostGIS           Redis (Future)
```

The MVP consists of:

- One NestJS application
- One PostgreSQL database
- PostGIS extension
- Docker containers

This architecture minimizes infrastructure cost while providing enough scalability for thousands of parking sessions.

---

# 3. Technology Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | NestJS |
| ORM | Prisma |
| Database | PostgreSQL |
| Spatial Engine | PostGIS |
| Authentication | JWT |
| Validation | Zod |
| Documentation | OpenAPI |
| Containerization | Docker |

---

# 4. Container Strategy

During development, every service runs inside Docker containers.

```
docker-compose

├── api

├── postgres

└── pgadmin (optional)
```

Benefits:

- Consistent environments
- Easy onboarding
- Database isolation
- Reproducible builds

---

# 5. Database

The platform uses PostgreSQL as the primary relational database.

PostGIS extends PostgreSQL with spatial capabilities.

Examples:

- Nearby parking search
- Polygon intersection
- Distance calculation
- Spatial indexing

The application should never perform geographic calculations in memory.

All spatial operations belong to the database.

---

# 6. Caching Strategy

Caching is intentionally excluded from the MVP.

If needed, Redis will be introduced to cache:

- Parking availability
- Nearby parking searches
- Frequently accessed pricing rules

Caching must never become the source of truth.

PostgreSQL remains the authoritative data source.

---

# 7. File Storage

The MVP stores no files.

Future versions may integrate object storage for:

- Parking photos
- Organization logos
- Operator documents

Possible providers:

- AWS S3
- Cloudflare R2
- MinIO

Storage remains an infrastructure concern.

---

# 8. External Integrations

The architecture anticipates future integrations.

Examples:

### Maps

- Google Maps
- Mapbox
- OpenStreetMap

### Payments

- PIX
- Stripe
- Mercado Pago

### Notifications

- Firebase
- OneSignal
- Email providers

These integrations remain isolated behind infrastructure adapters.

---

# 9. AI Integrations

The architecture reserves extension points for AI-powered features.

Examples:

- Parking recommendation
- Route optimization
- Occupancy prediction
- Natural language assistant

Future providers may include:

- Gemini
- OpenAI
- Claude

The Domain Layer must remain independent of AI providers.

---

# 10. Security

Authentication:

- JWT Access Token

Authorization:

- Organization Memberships
- Role-based permissions

Passwords:

- Hashed using Argon2

Communication:

- HTTPS only

Sensitive configuration:

- Environment variables

---

# 11. Monitoring

Initially:

- Structured logging
- Request logging
- Error logging

Future:

- OpenTelemetry
- Prometheus
- Grafana

Monitoring must not affect business logic.

---

# 12. Scaling Strategy

Current deployment:

```
          API

           │

      PostgreSQL
```

Future:

```
              Load Balancer

             /            \

         API 1          API 2

              │

          PostgreSQL

              │

            Redis
```

The application is stateless.

Horizontal scaling only requires additional application instances.

---

# 13. Event-Driven Evolution

Current:

```
Application

↓

In-memory Domain Events
```

Future:

```
Application

↓

RabbitMQ

↓

Workers

↓

Notifications

↓

Analytics

↓

Recommendation Engine
```

The transition should not require modifications to business rules.

---

# 14. Possible Future Microservices

The Modular Monolith may eventually be split into independent services.

Potential candidates include:

- Payment Service
- Notification Service
- Recommendation Service
- IoT Gateway
- Analytics Service

These extractions should only occur when justified by business or operational requirements.

---

# 15. CI/CD

Recommended pipeline:

```
GitHub

↓

GitHub Actions

↓

Tests

↓

Lint

↓

Build Docker Image

↓

Container Registry

↓

Production
```

Every merge into the main branch should produce a deployable artifact.

---

# 16. Environment Strategy

Development

- Docker Compose
- Local PostgreSQL

Staging

- Cloud database
- Production-like configuration

Production

- Managed PostgreSQL
- Container orchestration
- Automated backups

---

# 17. Disaster Recovery

Database backups should be performed automatically.

Recommendations:

- Daily full backup
- WAL archiving
- Point-in-Time Recovery (PITR)

Application instances are disposable.

Persistent state exists only in PostgreSQL.

---

# 18. Design Philosophy

Infrastructure exists to support the business.

Frameworks, databases, queues and cloud providers are replaceable.

The Domain Layer remains the center of the architecture.

By isolating infrastructure behind interfaces, the Smart Parking Platform preserves long-term maintainability while allowing incremental adoption of new technologies.

---

# Architecture Documentation Completed

The Smart Parking Platform architecture is now documented through the following documents:

```
docs/
├── architecture/
│   ├── architecture.md
│   ├── modules.md
│   ├── request-flow.md
│   ├── folder-structure.md
│   ├── events.md
│   └── deployment.md
│
├── domain/
│   ├── domain-model.md
│   ├── aggregates.md
│   ├── pricing.md
│   ├── parking-allocation.md
│   └── ...
│
├── adr/
│   ├── ADR-001-...
│   ├── ADR-002-...
│   └── ...
│
└── database/
    └── smart-parking.dbml
```