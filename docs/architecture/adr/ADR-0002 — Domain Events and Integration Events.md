# ADR-0002 — Separation between Domain Events and Integration Events

- **Status:** Accepted
- **Date:** 2026-06-30

---

# Context

The platform is expected to integrate with mobile applications, Smart Cities, payment providers and navigation platforms.

Coupling the Domain Model directly to infrastructure events would reduce maintainability.

---

# Decision

The architecture distinguishes between:

- Domain Events
- Integration Events

Domain Events describe business facts.

Integration Events communicate those facts to external systems.

The Domain Layer never publishes Integration Events directly.

---

# Consequences

Positive:

- Infrastructure independence.
- Easier testing.
- Cleaner Domain Model.
- Future support for Kafka, RabbitMQ, Redis Streams and WebSockets.

Negative:

- Extra mapping layer.

---

# Alternatives Considered

Publishing Integration Events directly.

Rejected because it couples business rules to infrastructure.

---

# Future Considerations

Additional event buses may be introduced without modifying the Domain Layer.