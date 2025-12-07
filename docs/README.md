# Car Lease Management System - Wiki

Welcome to the comprehensive documentation for the Car Lease Management System. This wiki provides in-depth information about the architectural decisions, design patterns, implementation strategies, and testing approaches used in this project.

---

## 📚 Table of Contents

1. [Hexagonal Architecture](./01-hexagonal-architecture.md)
2. [Design Patterns](./02-design-patterns.md)
3. [Batch Processing and Event-Driven Architecture](./03-batch-and-events.md)
4. [Testing Strategy](./04-testing-strategy.md)

---

## 🏗️ Architecture Overview

This project implements a **Car Lease Management Platform** using modern software architecture principles and patterns. The system is built with **NestJS** and follows the **Hexagonal Architecture** (Ports and Adapters) pattern to ensure modularity, testability, and long-term maintainability.

### Core Entities

- **Client**: Represents customers who can rent vehicles
- **Vehicle**: Represents rentable assets in the company's fleet
- **Contract**: Represents lease agreements linking clients and vehicles

### Tech Stack

- **Backend Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB
- **ORM**: Mongoose
- **Message Queue**: Redis (BullMQ)
- **Testing**: Jest
- **Containerization**: Docker

---

## 📖 Documentation Pages

### [1. Hexagonal Architecture](./01-hexagonal-architecture.md)

**Topics Covered**:
- Why we chose Hexagonal Architecture
- Layer separation and dependency rules
- Implementation details in our project
- Benefits and trade-offs
- Practical examples

**Key Takeaways**:
- Domain layer is completely independent of infrastructure
- Clear separation between business logic and technical concerns
- Easy to test, maintain, and evolve
- Multiple entry points (REST, messages, cron) to the same business logic

**Read this if you want to understand**:
- ✅ The overall architecture of the project
- ✅ Why we separated code into `@lib/domain`, `@lib/in-*`, and `@lib/out-*`
- ✅ How dependency injection works across layers
- ✅ How to add new adapters or change infrastructure

---

### [2. Design Patterns](./02-design-patterns.md)

**Topics Covered**:
- Command Pattern (Use Cases)
- Repository Pattern
- Adapter Pattern
- Chain of Responsibility Pattern (Validators)
- DTO Pattern

**Key Takeaways**:
- All use cases extend `UseCase<TInput, TOutput>` abstract class
- Repositories provide abstract interfaces for data access
- Adapters connect domain to external systems (HTTP, database, messages)
- Validators are chained using Chain of Responsibility
- DTOs ensure type-safe data transfer

**Read this if you want to understand**:
- ✅ How use cases are structured and why
- ✅ How validation works (e.g., unique client, no overlapping contracts)
- ✅ How repositories abstract database access
- ✅ How different patterns work together

---

### [3. Batch Processing and Event-Driven Architecture](./03-batch-and-events.md)

**Topics Covered**:
- Batch processing with cron for overdue contracts
- Event-driven architecture with Redis for vehicle maintenance
- Comparison: when to use batch vs events
- Implementation details and best practices

**Key Takeaways**:
- **Batch (Cron)**: Used for time-based, periodic tasks (e.g., daily overdue contract detection)
- **Events (Redis)**: Used for action-triggered, real-time operations (e.g., cancel contracts when vehicle enters maintenance)
- Each approach is chosen based on business requirements

**Read this if you want to understand**:
- ✅ Why we use cron for overdue contracts instead of events
- ✅ Why we use events for vehicle maintenance instead of batch
- ✅ How the cron job works (runs every day at midnight)
- ✅ How the message queue works (producer → queue → consumer)
- ✅ When to choose batch vs event-driven approaches

---

### [4. Testing Strategy](./04-testing-strategy.md)

**Topics Covered**:
- Unit testing with 90%+ domain coverage
- E2E testing for complete application lifecycle
- Test organization and structure
- Best practices and common pitfalls

**Key Takeaways**:
- **Unit tests**: Focus on domain layer, test business logic in isolation
- **E2E tests**: Test complete flows from HTTP request to database
- **Coverage goal**: 90%+ for domain layer
- Tests serve as living documentation

**Read this if you want to understand**:
- ✅ How to write unit tests for use cases and validators
- ✅ How to write E2E tests for complete user journeys
- ✅ How to achieve high test coverage
- ✅ Testing best practices and patterns
- ✅ How to run tests and check coverage

---

## 🎯 Quick Start Guide

### For New Developers

1. **Start with [Hexagonal Architecture](./01-hexagonal-architecture.md)**
   - Understand the overall structure
   - Learn the dependency rules
   - See how layers interact

2. **Read [Design Patterns](./02-design-patterns.md)**
   - Understand how use cases work
   - Learn about validators and repositories
   - See how patterns complement the architecture

3. **Explore [Batch and Events](./03-batch-and-events.md)**
   - Understand asynchronous processing
   - Learn when to use batch vs events
   - See real-world examples

4. **Study [Testing Strategy](./04-testing-strategy.md)**
   - Learn how to write tests
   - Understand coverage goals
   - Follow best practices

### For Specific Tasks

| Task | Read This |
|------|-----------|
| Add a new use case | [Design Patterns - Command Pattern](./02-design-patterns.md#command-pattern-use-cases) |
| Add validation | [Design Patterns - Chain of Responsibility](./02-design-patterns.md#chain-of-responsibility-pattern) |
| Add a new REST endpoint | [Hexagonal Architecture - Input Adapters](./01-hexagonal-architecture.md#input-adapters) |
| Change database | [Hexagonal Architecture - Output Adapters](./01-hexagonal-architecture.md#output-adapters) |
| Add a scheduled task | [Batch and Events - Batch Processing](./03-batch-and-events.md#batch-processing-with-cron) |
| Add event handling | [Batch and Events - Event-Driven](./03-batch-and-events.md#event-driven-architecture-with-redis) |
| Write tests | [Testing Strategy](./04-testing-strategy.md) |

---

## 🏛️ Architectural Principles

### Core Principles

1. **Separation of Concerns**
   - Business logic separated from infrastructure
   - Each layer has a single responsibility

2. **Dependency Inversion**
   - Dependencies point inward toward the domain
   - Domain never depends on infrastructure

3. **Testability**
   - Business logic can be tested without external dependencies
   - High test coverage (90%+ in domain)

4. **Flexibility**
   - Easy to swap implementations
   - Multiple entry points to the same logic

5. **Maintainability**
   - Clear boundaries and responsibilities
   - Self-documenting code structure

### Dependency Rules

```
┌─────────────────────────────────────┐
│         Input Adapters              │
│    (@lib/in-rest, @lib/in-cron,    │
│       @lib/in-messages)             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Domain Layer                │
│         (@lib/domain)               │
│                                     │
│  • Entities                         │
│  • Use Cases                        │
│  • Repository Interfaces            │
│  • Business Rules                   │
└──────────────┬──────────────────────┘
               ▲
               │
┌──────────────┴──────────────────────┐
│        Output Adapters              │
│   (@lib/out-mongoose,               │
│     @lib/out-messages)              │
└─────────────────────────────────────┘
```

**Rules**:
- ✅ Input adapters → Domain
- ✅ Output adapters → Domain
- ❌ Domain → Adapters (NEVER!)
- ❌ Input ↔ Output (NEVER!)

---

## 📊 Project Statistics

### Code Organization

- **Libraries**: 7 (`domain`, `in-rest`, `in-messages`, `in-cron`, `out-mongoose`, `out-messages`, `common`)
- **Use Cases**: 17 (client, vehicle, contract operations)
- **Validators**: 13 (business rule enforcement)
- **Repositories**: 3 (client, vehicle, contract)

### Testing

- **Unit Tests**: 21 test files in domain layer
- **E2E Tests**: 5 test suites covering complete lifecycles
- **Coverage**: 90%+ in domain layer
- **Test Framework**: Jest

### Infrastructure

- **Message Queue**: Redis (BullMQ)
- **Database**: MongoDB (Mongoose)
- **Scheduling**: NestJS Schedule (cron)
- **API**: REST (NestJS controllers)

---

## 🚀 Running the Project

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run unit tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run E2E tests
pnpm test:e2e

# Lint code
pnpm lint

# Type check
pnpm type
```

### Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🤝 Contributing

When contributing to this project, please:

1. **Follow the architecture**: Respect layer boundaries and dependency rules
2. **Write tests**: Maintain 90%+ coverage in domain layer
3. **Use patterns**: Follow established patterns (Command, Repository, etc.)
4. **Document**: Update wiki if adding new patterns or approaches
5. **Lint**: Run `pnpm lint --fix` before committing

---

## 📝 Additional Resources

### Internal Documentation

- [Main README](../README.md) - Project overview and setup
- [.agent/rules](../.agent/rules/) - Development rules and guidelines

### External Resources

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Design Patterns](https://refactoring.guru/design-patterns)

---

## 📧 Contact

**Authors**:
- Cédric Champeix
- Felix Delassus

**Course**: Software Architecture  
**Institution**: [Your Institution]

---

## 📄 License

This project is part of a software architecture course assignment.

---

**Last Updated**: December 2024

**Version**: 1.0.0
