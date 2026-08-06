# Park Flow Roadmap

This roadmap is organized in 1-week sprints of 35 hours each.

## Current implementation status

Implemented:
- [x] authentication (`identity`)
- [x] vehicle registration (`vehicle`)
- [x] organization creation (`organization`)
- [x] parking zone / parking spot creation (`parking`)
- [x] ticket lifecycle create + finish (`ticket`)
- [x] pricing rule / pricing period creation (`pricing`)

Partially implemented:
- [ ] parking geometry support exists in interfaces but is not complete
- [ ] organization membership repository exists, but no membership API or invite flow
- [ ] pricing is defined, but ticket pricing/payment integration is not finished

Missing:
- [ ] payment module / wallet module
- [ ] wallet and payment capture on ticket finish
- [ ] geo search / PostGIS discovery APIs
- [ ] operator/admin membership and management workflows
- [ ] dashboards, real-time updates, and deployment polish

---

## Phase 1 — MVP core driver flow

### Sprint 1: Project foundation
- Add roadmap documentation
- Confirm module wiring in `src/app.module.ts`
- Verify Prisma schema and migrations
- Add shared validation and exception patterns
- Deliverable: stable repository structure and working app skeleton

### Sprint 2: Identity and authentication
- Complete `identity` module
- Implement JWT login and auth guards
- Add `current-user` support for protected routes
- Deliverable: secure auth flow for drivers and operators

### Sprint 3: Vehicle management
- Expand `vehicle` module
- Add register/update/delete/list vehicles
- Add license plate validation and uniqueness checks
- Deliverable: driver vehicle management endpoints

### Sprint 4: Parking infrastructure
- Expand `parking` module
- Add parking zone CRUD and spot CRUD
- Add parking spot status and availability model
- Deliverable: parking inventory and zone setup APIs

### Sprint 5: Ticket lifecycle
- Expand `ticket` module
- Implement start/finish ticket flows
- Add ticket history and business validation
- Deliverable: working parking session lifecycle

## Phase 2 — Pricing and payment

### Sprint 6: Pricing engine
- Implement pricing calculation service
- Connect pricing rules to ticket closing
- Support hourly, daily, and time-window pricing
- Deliverable: ticket pricing engine integrated with domain

### Sprint 7: Payments and wallet
- Implement `payment` module
- Implement `wallet` module
- Add wallet balance, top-up, and transaction history
- Capture payment when ticket ends
- Deliverable: wallet-backed parking payments

### Sprint 8: Operator and admin workflows
- Add organization membership APIs
- Add operator/invite/permission management
- Add admin APIs for parking and pricing management
- Deliverable: operator control plane for organizations

## Phase 3 — Search, polish, release

### Sprint 9: Geo search and availability
- Add PostGIS or geo search support
- Implement nearby parking discovery APIs
- Add location-based availability filtering
- Deliverable: driver parking search experience

### Sprint 10: Testing, docs, deployment
- Add Swagger/OpenAPI documentation
- Add automated tests for user flows
- Harden validation and error handling
- Add Docker deployment support
- Deliverable: production-ready backend release

---

## Testing the current use cases

### Run existing test commands
- `npm test` — run all Jest tests
- `npm run test:e2e` — run the end-to-end test suite
- `npm run test:watch` — run Jest in watch mode while developing

### If you want to verify current implemented use cases manually
- `POST /auth/register` to create a user
- `POST /auth/login` to get a JWT
- `POST /vehicles` to register a vehicle
- `POST /organizations` to create an organization
- `POST /parking-zones` to create a parking zone
- `POST /parking-spots` to create parking spots
- `POST /tickets` to start a ticket
- `POST /tickets/:id/finish` to finish a ticket

### Recommended way to test the implemented use cases in code
- Add unit tests for each use case class in `src/modules/*/application`
- Mock repository dependencies with Jest
- Test happy paths and business rule cases
- Example targets:
  - `CreateTicketUseCase`
  - `FinishTicketUseCase`
  - `RegisterVehicleUseCase`
  - `CreateOrganizationUseCase`
  - `CreatePricingRuleUseCase`

### Example Jest workflow for a use case
- create `src/modules/ticket/application/commands/create-ticket-use-case.spec.ts`
- mock `TicketRepository` and `OrganizationMembershipRepository`
- assert that `execute()` saves the ticket and throws on duplicate active ticket

---

## Notes
- Reserve ~25% of each sprint for tests, validation, and bug fixes.
- Focus Phase 1 on driver-facing flows first, then operator/admin support.
- Phase 2 should connect pricing and payments into a coherent end-to-end flow.
