# Domain Events

> Smart Parking Platform - Domain Events

---

# 1. Introduction

The Smart Parking Platform adopts **Domain Events** to represent important business occurrences.

A Domain Event describes **something that has already happened** within the business domain.

Examples include:

- A parking session started.
- A payment was completed.
- A parking space became available.

These events allow different modules to react without becoming tightly coupled.

Initially, all events are processed synchronously within the same application.

Future versions may publish them asynchronously using message brokers such as RabbitMQ or Kafka without changing the domain model.

---

# 2. Why Domain Events?

Instead of directly invoking other modules, a module announces that something happened.

Example:

```
Ticket Finished

↓

Payment Module reacts

↓

Wallet Module reacts

↓

Notification Module reacts
```

The Ticket module does not know who is listening.

This greatly reduces coupling.

---

# 3. Event Lifecycle

```
Business Action

↓

Entity changes state

↓

Domain Event created

↓

Application Layer publishes event

↓

Interested modules react

↓

Request completes
```

Events are always generated inside the Domain Layer and published by the Application Layer.

---

# 4. Ticket Events

## TicketStarted

Occurs when a parking session begins.

### Trigger

```
Ticket.start()
```

### Payload

```
ticketId

parkingSpotId

vehicleId

startedAt
```

Possible consumers:

- Parking Module
- Analytics
- Notifications

---

## TicketFinished

Occurs when a parking session ends.

### Trigger

```
Ticket.finish()
```

### Payload

```
ticketId

vehicleId

parkingSpotId

startedAt

endedAt

duration
```

Possible consumers:

- Pricing Module
- Payment Module
- Analytics

---

## TicketCancelled

Occurs when a scheduled ticket is cancelled.

Consumers:

- Parking Module
- Notifications

---

# 5. Payment Events

## PaymentCreated

Raised after a payment request is generated.

Payload

```
paymentId

ticketId

amount

method
```

Consumers:

- Payment Provider
- Analytics

---

## PaymentSucceeded

Raised after successful payment confirmation.

Consumers:

- Wallet
- Ticket
- Notifications
- Loyalty Program

---

## PaymentFailed

Raised when payment cannot be completed.

Consumers:

- Notifications
- Support
- Analytics

---

## PaymentRefunded

Raised after a refund.

Consumers:

- Wallet
- Analytics

---

# 6. Parking Events

## ParkingSpotAllocated

Occurs when a parking spot is assigned.

Payload

```
parkingSpotId

ticketId
```

Consumers:

- Parking Module
- Analytics

---

## ParkingSpotReleased

Occurs after a parking session finishes.

Consumers:

- Parking Availability
- Notifications

---

## ParkingZoneAvailabilityChanged

Represents a meaningful availability change within a parking zone.

Example:

```
Available Spots

15

↓

14
```

Future consumers:

- Maps
- Recommendation Engine
- Mobile App

---

# 7. Wallet Events

## WalletCredited

Raised after balance increases.

Consumers:

- Notifications
- Analytics

---

## WalletDebited

Raised after balance decreases.

Consumers:

- Analytics

---

# 8. Future Events

The architecture intentionally keeps room for future integrations.

Possible future events:

```
ReservationCreated

ReservationExpired

VehicleRecognized

VehicleEnteredParking

VehicleExitedParking

ParkingSensorOffline

ParkingSensorOnline

ParkingRecommendationGenerated
```

These events are not part of the MVP but fit naturally into the architecture.

---

# 9. Event Publishing

Only the Application Layer publishes events.

Example:

```
FinishTicketUseCase

↓

Ticket.finish()

↓

Collect Domain Events

↓

Commit Transaction

↓

Publish Events
```

Entities never communicate directly with infrastructure.

---

# 10. Event Handling

Each module decides whether it is interested in an event.

Example:

```
TicketFinished

↓

Pricing Module

↓

Calculate Amount

↓

PaymentCreated

↓

Payment Module
```

Modules remain independent.

---

# 11. Event Ordering

Some events have natural ordering.

Example:

```
TicketStarted

↓

TicketFinished

↓

PaymentCreated

↓

PaymentSucceeded

↓

WalletDebited
```

Ordering should always respect business chronology.

---

# 12. Synchronous vs Asynchronous

### MVP

```
In Memory

↓

Synchronous
```

Benefits:

- Simpler debugging
- Single transaction
- Lower infrastructure cost

---

### Future

```
RabbitMQ

or

Kafka
```

Events become asynchronous without modifying the domain.

---

# 13. Design Principles

Domain Events must:

- represent past facts
- use business language
- be immutable
- avoid technical details
- remain independent from messaging infrastructure

Good examples:

```
PaymentSucceeded

TicketFinished

ParkingSpotReleased
```

Bad examples:

```
PublishRabbitMessage

SavePaymentJob

RedisUpdated
```

Those describe implementation details, not business events.

---

# 14. Summary

Domain Events provide a clean communication mechanism between modules while preserving loose coupling.

The MVP processes events synchronously, but the domain is prepared for future event-driven architectures.

By modeling business events instead of technical integrations, the Smart Parking Platform remains maintainable, extensible and aligned with Domain-Driven Design principles.

---

# Next Document

```
docs/architecture/deployment.md
```

The next document describes deployment, infrastructure, containers and the evolution path from a local modular monolith to a distributed architecture.