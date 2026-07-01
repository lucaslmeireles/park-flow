# ADR-0003 — Payment as an Independent Aggregate

- **Status:** Accepted
- **Date:** 2026-06-30

---

# Context

Initially, payment responsibilities were considered part of the Ticket lifecycle.

However, payment methods, statuses and external integrations evolve independently from parking sessions.

---

# Decision

Payment will be modeled as its own Aggregate Root.

Tickets represent parking sessions.

Payments represent financial settlement.

A Ticket may exist independently of payment completion.

---

# Consequences

Positive:

- Separation of concerns.
- Multiple payment methods.
- Retry support.
- Pending payments.
- Refund support.

Negative:

- Additional Aggregate.

---

# Alternatives Considered

Payment inside Ticket.

Rejected.

Payment inside Wallet.

Rejected.

Wallet represents stored value, not payment processing.

---

# Future Considerations

Support for:

- PIX
- Credit Card
- Wallet
- Apple Pay
- Google Pay
- External Gateways