# ADR-0001 — Pricing Engine using Strategy Pattern

- **Status:** Accepted
- **Date:** 2026-06-30

---

# Context

Parking pricing is expected to evolve over time.

Different parking operators require different pricing policies, such as:

- Hourly pricing
- Daily pricing
- Night pricing
- Weekend pricing
- Holiday pricing
- Dynamic pricing (future)

Embedding pricing logic inside the Ticket entity or a single PricingService would violate the Open/Closed Principle and make the system harder to maintain.

---

# Decision

Pricing calculations will be implemented using the Strategy Pattern.

Each pricing algorithm will implement the `PricingStrategy` interface.

The `PricingService` will act only as an orchestrator, selecting the appropriate strategy according to the active `PricingRule`.

---

# Consequences

Positive:

- Open for extension.
- Easier testing.
- Small and focused pricing algorithms.
- No changes required to Ticket.

Negative:

- Slightly more classes.
- Additional orchestration layer.

---

# Alternatives Considered

## Pricing inside Ticket

Rejected.

Would make Ticket responsible for business logic unrelated to its lifecycle.

---

## Single PricingService with conditionals

Rejected.

Would grow indefinitely as pricing policies evolve.

---

# Future Considerations

Future strategies may include:

- Dynamic Pricing
- AI Pricing
- Occupancy-based Pricing
- Seasonal Pricing