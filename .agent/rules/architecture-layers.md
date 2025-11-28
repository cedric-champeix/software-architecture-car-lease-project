---
trigger: always_on
---

# Hexagonal Architecture (Ports & Adapters)

## Layer Separation

- **Domain layer** (`@lib/domain`): Core business logic, entities, use cases, and repository interfaces
  - NO dependencies on external frameworks or infrastructure
  - NO imports from `@lib/in-*` or `@lib/out-*` libraries
  - Only pure TypeScript and domain logic

- **Input Adapters** (`@lib/in-*`): Entry points to the application
  - `@lib/in-rest`: REST API controllers
  - `@lib/in-messages`: Message queue consumers
  - `@lib/in-cron`: Scheduled tasks
  - CAN import from `@lib/domain`
  - CANNOT import from `@lib/out-*`

- **Output Adapters** (`@lib/out-*`): External integrations and persistence
  - `@lib/out-mongoose`: Database repositories
  - `@lib/out-messages`: Message queue producers
  - CAN import from `@lib/domain`
  - CANNOT import from `@lib/in-*`

## Dependencies Flow

in-* → domain ← out-*

- Input adapters depend on domain
- Output adapters depend on domain
- Domain depends on nothing (domain-driven design)
- Input and output adapters NEVER depend on each other