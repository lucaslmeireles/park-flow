# API Guidelines

> Smart Parking Platform - REST API Design Standards

---

# 1. Purpose

This document defines the standards used when designing HTTP APIs for the Smart Parking Platform.

The objective is to ensure consistency across all modules while keeping the API predictable, discoverable and easy to consume.

These guidelines apply to every endpoint exposed by the platform.

---

# 2. REST Principles

The API follows REST conventions.

Resources are represented as nouns.

Good:

GET /parking-zones

POST /tickets

GET /vehicles

PATCH /payments/{id}

Bad:

POST /createTicket

GET /getVehicles

POST /finishParking

---

# 3. Resource Naming

Always use:

- plural nouns
- kebab-case

Examples

/users

/vehicles

/parking-zones

/parking-spots

/pricing-rules

/wallet-transactions

Avoid:

/user

/ParkingZones

/getVehicle

---

# 4. HTTP Methods

GET

Retrieve data.

Must never change state.

---

POST

Create a resource.

Example

POST /tickets

Returns

201 Created

---

PUT

Replace an entire resource.

Should be avoided unless full replacement is required.

---

PATCH

Partial update.

Preferred over PUT.

Example

PATCH /tickets/{id}/finish

PATCH /organizations/{id}

---

DELETE

Soft delete whenever possible.

Returns

204 No Content

---

# 5. HTTP Status Codes

200 OK

Successful request.

---

201 Created

Resource successfully created.

---

202 Accepted

Accepted for asynchronous processing.

(Not used in MVP.)

---

204 No Content

Successful deletion.

---

400 Bad Request

Malformed request.

---

401 Unauthorized

Missing or invalid authentication.

---

403 Forbidden

Authenticated but not allowed.

---

404 Not Found

Resource does not exist.

---

409 Conflict

Business conflict.

Examples:

- Vehicle already parked
- Parking spot occupied

---

422 Unprocessable Entity

Domain validation failed.

---

500 Internal Server Error

Unexpected server error.

---

# 6. Resource Identifiers

Every public identifier is a UUID.

Example

GET /tickets/4ab54d4d...

IDs are immutable.

---

# 7. Pagination

Collections should always support pagination.

Example

GET /vehicles?page=1&pageSize=20

Response

{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 156,
    "pages": 8
  }
}

---

# 8. Filtering

Filtering uses query parameters.

Example

GET /parking-zones?organizationId=...

GET /tickets?status=ACTIVE

GET /payments?method=PIX

---

# 9. Sorting

Sorting follows:

sort

order

Example

GET /tickets?sort=startedAt&order=desc

---

# 10. Searching

Text search uses:

search

Example

GET /organizations?search=shopping

---

# 11. Spatial Queries

Location-based endpoints receive latitude and longitude.

Example

GET /parking-zones/nearby

Query

lat=-22.503

lng=-44.102

radius=500

Radius is expressed in meters.

---

# 12. Versioning

Current version

/api/v1

Future versions

/api/v2

Never version individual endpoints.

---

# 13. Request Validation

Validation occurs before entering the Application Layer.

Implemented using Zod.

Examples

Required fields

Email

UUID

Coordinates

---

# 14. Error Format

All errors follow RFC 7807 (Problem Details).

Example

{
  "type": "https://smartparking.dev/errors/parking-spot-unavailable",
  "title": "Parking spot unavailable",
  "status": 409,
  "detail": "The selected parking spot is already occupied.",
  "instance": "/tickets"
}

---

# 15. Authentication

Bearer Token

Authorization: Bearer <jwt>

Public endpoints should be explicitly documented.

---

# 16. Idempotency

POST endpoints are not idempotent.

PATCH operations should be idempotent whenever possible.

Payment endpoints may require Idempotency-Key in future releases.

---

# 17. Date & Time

Use ISO-8601 UTC.

Example

2026-07-01T18:30:00Z

---

# 18. Money

Never use floating point values.

Amounts are represented as Decimal.

---

# 19. Documentation

Every endpoint must include:

- summary
- description
- request example
- response example
- error responses

Swagger documentation is mandatory.

---

# 20. Design Principles

The API should be:

- predictable
- resource-oriented
- consistent
- versioned
- documented
- easy to evolve