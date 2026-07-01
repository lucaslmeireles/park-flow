# Domain Overview

## Purpose

The Smart Parking Platform is a backend platform that unifies the management of public and private parking areas within the same business model.

Instead of treating municipal parking and private parking as completely different systems, the platform provides a common domain capable of representing both through configuration and business rules.

The system exposes a unified API that can be consumed by web applications, mobile applications, operator dashboards and future third-party integrations.

---

# Mission

Provide accurate, real-time parking availability while simplifying parking management for cities, private organizations and drivers.

The platform aims to answer one simple question:

> **"Where can I park near my destination?"**

Everything inside the platform exists to support this objective.

---

# Vision

Become an extensible parking infrastructure capable of serving:

- Municipal governments
- Shopping malls
- Universities
- Airports
- Hospitals
- Residential condominiums
- Commercial parking operators
- Smart City initiatives

The platform should act as a shared parking ecosystem instead of multiple disconnected systems.

---

# Business Problem

Parking is usually fragmented.

Drivers often need different applications depending on where they intend to park.

For example:

- Municipal parking uses one application.
- Shopping malls use another.
- Airports have their own system.
- Some private parking lots still operate entirely manually.

This fragmentation creates several problems:

- Drivers don't know where parking is available.
- Different payment methods.
- Different pricing rules.
- Poor parking visibility.
- Low integration between public and private sectors.

---

# Proposed Solution

Smart Parking provides a unified domain where every parking area belongs to an Organization.

Organizations may represent:

- Government agencies
- Private companies

Regardless of the organization type, parking operations follow the same business model.

This allows clients to search, pay and manage parking sessions through a single application.

---

# Domain Scope

The platform is responsible for:

## Parking Management

Managing parking zones and parking spots.

---

## Availability

Providing real-time parking availability.

---

## Parking Sessions

Managing the complete lifecycle of parking tickets.

---

## Pricing

Calculating parking prices using configurable pricing strategies.

---

## Wallet

Managing customer balances and financial transactions.

---

## Organizations

Managing municipalities and private companies.

---

## Geospatial Search

Finding nearby parking using PostGIS.

---

# Out of Scope

The following responsibilities are intentionally outside the domain.

## Navigation

The platform does not provide navigation.

Navigation platforms may consume Smart Parking APIs.

Examples:

- Google Maps
- Apple Maps
- Waze

---

## Payment Gateway

The platform manages financial transactions but does not process credit cards.

Payment providers are external integrations.

Examples:

- Stripe
- Mercado Pago
- Adyen

---

## Vehicle Ownership Validation

The platform does not verify whether a user legally owns a vehicle.

Vehicle registration is based on user-provided information.

---

## Traffic Enforcement

The platform does not issue parking fines.

Municipal enforcement systems are external integrations.

---

# Core Concepts

The entire domain revolves around a few central concepts.

## Parking Zone

A physical area where vehicles may park.

Examples:

- Street block
- Shopping parking
- Airport parking
- University parking

Every Parking Zone belongs to exactly one Organization.

---

## Parking Spot

Represents a single parking position.

Parking Spots may be:

- Identified only by a number.
- Georeferenced.
- Equipped with QR Codes.
- Equipped with IoT sensors.

The domain supports all scenarios without changing the business model.

---

## Ticket

A Ticket represents a parking session.

A Ticket starts when a Parking Spot becomes occupied.

A Ticket ends when the vehicle leaves the Parking Spot.

Tickets never calculate prices.

---

## Pricing

Pricing is handled by dedicated Domain Services.

Business entities never calculate parking prices.

This allows pricing strategies to evolve without modifying the domain entities.

---

## Wallet

Customers may own a Wallet used to pay parking sessions.

Operators and administrators are not required to own wallets.

Wallet balances are derived from transactions instead of being stored directly.

---

# Guiding Principles

The Smart Parking Platform follows several domain principles.

## Parking First

Parking operations are the center of the domain.

Every other capability exists to support parking.

---

## Unified Domain

Public and private parking share the same entities whenever possible.

Behavior changes through configuration instead of different models.

---

## Rich Domain

Business rules belong to the domain.

Infrastructure should never contain business decisions.

---

## Configuration over Code

Pricing, operation modes and parking policies should be configurable.

Adding new pricing models should not require changing existing entities.

---

## Extensibility

The domain should support future features without structural redesign.

Examples include:

- Reservations
- Dynamic pricing
- AI recommendations
- IoT sensors
- License Plate Recognition (LPR)
- Smart City integrations

---

# Future Vision

The current platform manages parking operations.

Future versions aim to become a Parking Infrastructure Platform.

Instead of only serving end users, the platform should expose APIs capable of supporting:

- Navigation applications
- AI assistants
- Fleet management systems
- Smart city platforms
- Vehicle manufacturers
- Public transportation systems

The backend should become the single source of truth for parking availability within a city.

---

# Summary

The Smart Parking Platform is designed around one core business capability:

**Managing parking availability through a unified, extensible and technology-independent domain model.**

Every entity, service and business rule described in this handbook exists to support this capability.