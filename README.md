# 🚗 Park Flow

> A modern platform for managing public and private parking lots with real-time availability, geospatial search, and digital payments.

![License](https://img.shields.io/badge/license-MIT-blue)
![NestJS](https://img.shields.io/badge/NestJS-11-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![PostGIS](https://img.shields.io/badge/PostGIS-enabled-success)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

---

## Overview

Smart Parking Platform is an open-source backend focused on solving one simple question:

> **"Where can I park near my destination?"**

Instead of treating public and private parking as separate systems, Smart Parking provides a unified platform where municipalities and private companies manage parking availability through a single ecosystem.

The platform supports:

- Public parking
- Private parking
- Geospatial search
- Parking availability
- Digital wallet
- QR Code parking
- Operator mode
- Self-service mode
- Future IoT integration

---

## Vision

Create an extensible platform capable of managing parking operations for cities and private companies using a single architecture.

---

## Features

### Parking

- Parking Zones
- Parking Spots
- Capacity Management
- Availability
- Reservations (future)

### Maps

- PostGIS
- Radius Search
- Polygon Search
- GeoJSON APIs

### Tickets

- Self Check-in
- Operator Check-in
- QR Code
- Parking Sessions

### Payments

- Wallet
- Transactions
- Pricing Strategies

### Administration

- Organizations
- Cities
- Tariffs
- Pricing Rules

---

## Architecture

This project follows:

- Domain Driven Design
- Clean Architecture
- SOLID
- Repository Pattern
- Strategy Pattern
- Modular Monolith

---

## Tech Stack

| Layer | Technology |
|--------|------------|
| Backend | NestJS |
| Database | PostgreSQL |
| GIS | PostGIS |
| ORM | Prisma |
| Authentication | JWT |
| Validation | Zod |
| Documentation | Swagger |
| Testing | Jest |
| Containers | Docker |

---

## Domain

```
City
    │
Organization
    │
ParkingZone
    ├── ParkingSpot
    ├── PricingRule
    │        └── Tariff
    └── Ticket

Vehicle
    │
Ticket

User
    ├── Wallet
    └── Vehicle
```

---

## Roadmap

- [x] Domain Modeling
- [x] Database Modeling
- [ ] Authentication
- [ ] Organizations
- [ ] Parking Zones
- [ ] Parking Spots
- [ ] Vehicles
- [ ] Tickets
- [ ] Wallet
- [ ] Pricing Engine
- [ ] Geo Search
- [ ] WebSocket
- [ ] Dashboard
- [ ] Mobile App

---

## Project Structure

```
src/

modules/

    auth/

    users/

    organizations/

    parking/

    vehicles/

    tickets/

    wallet/

    pricing/

shared/

docs/

tests/
```

---

## Future Ideas

- AI demand prediction
- Dynamic pricing
- IoT sensors
- Automatic ticket closing
- Smart city integrations
- License Plate Recognition (LPR)

---

## Contributing

Contributions are welcome.

Please open an Issue before implementing new features.

---

## License

MIT
