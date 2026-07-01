# ADR-0004 — Unified Public and Private Parking Model

- **Status:** Accepted
- **Date:** 2026-06-30

---

# Context

Public and private parking systems usually evolve as separate applications.

Maintaining two different domain models would increase maintenance costs and duplicate business logic.

---

# Decision

The platform will represent both public and private parking using the same domain model.

Behavioral differences will be expressed through configuration instead of separate entities.

Organizations may represent either government agencies or private companies.

---

# Consequences

Positive:

- Reduced duplication.
- Unified APIs.
- Simpler search.
- Easier integrations.
- Shared pricing engine.

Negative:

- Some configuration complexity.

---

# Alternatives Considered

Separate models for municipal and private parking.

Rejected because the operational workflow is fundamentally the same.

---

# Future Considerations

Additional parking types (airports, universities, hospitals) should reuse the same model.