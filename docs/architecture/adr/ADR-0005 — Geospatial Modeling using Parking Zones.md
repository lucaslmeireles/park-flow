# ADR-0005 — Geospatial Modeling using Parking Zones

- **Status:** Accepted
- **Date:** 2026-06-30

---

# Context

The platform's primary goal is to answer:

> "Where can I park near my destination?"

Efficient geospatial queries are therefore a core requirement.

Individual Parking Spots may or may not have geographic coordinates.

---

# Decision

Parking Zones will always contain geospatial information.

Parking Spots may optionally contain precise coordinates.

Search operations will always be performed against Parking Zones.

Parking Spots are used for operational control rather than discovery.

PostGIS will be adopted as the geospatial engine.

---

# Consequences

Positive:

- Fast proximity searches.
- Flexible support for simple and complex parking areas.
- Optional sensor integration.
- Efficient indexing.

Negative:

- Additional database complexity.
- PostgreSQL dependency.

---

# Alternatives Considered

Geolocating every Parking Spot.

Rejected due to unnecessary complexity for small parking facilities.

Using only Parking Spots.

Rejected because Parking Zones are the actual searchable business concept.

---

# Future Considerations

Support for:

- Polygon occupancy heatmaps.
- AI parking recommendations.
- Route optimization.
- Navigation integrations.