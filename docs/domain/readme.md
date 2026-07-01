# Domain Handbook

Welcome to the Smart Parking Platform Domain documentation.

This directory contains the official business documentation for the project.

The goal of this handbook is to describe **what the system does**, independent of technologies such as NestJS, Prisma or PostgreSQL.

---

# Domain Philosophy

The Smart Parking Platform models **parking operations**, not infrastructure.

The business model should remain stable even if the implementation changes.

Every architectural decision must preserve the ubiquitous language described in this handbook.

---

# Documentation Structure

| Document | Purpose |
|----------|---------|
| overview.md | Business vision and domain scope |
| aggregates.md | Aggregate Roots and relationships |
| entities.md | Domain entities |
| domain-services.md | Domain Services |
| domain-events.md | Business events |
| business-rules.md | Official business rules |
| glossary.md | Business glossary |

---

# Core Principles

The domain follows a few non-negotiable principles.

## Parking First

Everything in the platform exists to support parking operations.

---

## Unified Parking

Public and private parking share the same domain model whenever possible.

Differences should be represented through configuration instead of different entities.

---

## Configuration over Code

Business rules should be configurable.

Pricing strategies, operation modes and parking policies must not require code changes.

---

## Extensibility

The domain should support future integrations with:

- Smart Cities
- IoT Sensors
- AI Assistants
- Navigation Applications
- Payment Providers

without requiring major structural changes.

---

# Architecture Principles

This project follows:

- Domain Driven Design
- Clean Architecture
- SOLID
- Modular Monolith
- Event-Driven Domain
- Rich Domain Model

---

# Frozen Domain

The documents inside this directory represent the **official version of the domain model**.

Any change affecting business behavior must be documented through an ADR before implementation.

Current Version:

**Domain v1.0**