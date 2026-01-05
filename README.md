# Car Lease Management System

## Overview

This project implements a **car lease management platform** designed to handle clients, vehicles, and rental contracts within an automotive leasing company. It is built using **NestJS** and structured according to the **Hexagonal Architecture (Ports and Adapters pattern)** to ensure modularity, testability, and long-term maintainability.

The project was developed as part of a **software architecture course** assignment focused on designing robust, domain-driven backend systems.

---

## Functional Specifications

### Core Entities

#### 1. Client

Represents a physical person who can rent vehicles.
Attributes include:

* First name
* Last name
* Date of birth
* Driver’s license number
* Address

**Business Rules:**

* A client is unique based on full name and date of birth.
* No two clients can share the same driver’s license number.

#### 2. Vehicle

Represents a rentable asset within the company’s fleet.
Attributes include:

* Brand
* Model
* Engine type
* Color
* License plate number
* Acquisition date
* Status (available, rented, broken)

**Business Rules:**

* A vehicle must be unique based on its license plate.
* Vehicles marked as *broken* cannot be rented.

#### 3. Contract

Represents a lease agreement linking a client and a vehicle.
Attributes include:

* Unique identifier
* Start date
* End date
* Status (pending, active, completed, late, cancelled)

**Business Rules:**

* A vehicle can only be rented by one client at a time.
* A client can rent multiple vehicles simultaneously.
* If a vehicle becomes broken, all pending contracts related to it must be automatically cancelled.
* If a client does not return the vehicle on time, the contract becomes *late*.
* If a late return prevents a subsequent rental, the next contract must be automatically *cancelled*.

---

## Technical Architecture

### Design Pattern

The system follows the **Hexagonal Architecture** (also known as Ports and Adapters).
This approach separates:

* **Domain layer** – core business logic and rules.
* **Application layer** – use cases and service orchestration.
* **Infrastructure layer** – persistence, API, and external adapters.

This ensures that the domain logic remains independent from technical frameworks and infrastructure details.

### Tech Stack

* **Backend Framework:** NestJS
* **Language:** TypeScript
* **Database:** MongoDB
* **ORM:** Mongoose
* **Messaging:** RabbitMQ
* **Testing:** Jest
* **Containerization:** Docker

---

## Repository Structure

```
software-architecture-car-lease-project/
├── src/
│   ├── domain/           # Entities, value objects, use cases, domain services
│   ├── application/      # Input/output
│   ├── infrastructure/   # Repositories, database, controllers
│   └── main.ts           # Application entry point
├── test/                 # Unit and integration tests
├── package.json
├── README.md
└── tsconfig.json
```

---

## Business Scenarios

1. **Register a client**
   Validate uniqueness by name, birth date, and license number.

2. **Add a vehicle**
   Ensure uniqueness by license plate.

3. **Create a rental contract**
   Ensure vehicle availability and client eligibility.

4. **Update vehicle status to “broken”**
   Automatically cancel pending contracts for that vehicle.

5. **Detect late returns**
   Mark ongoing contracts as *late* when the end date is exceeded.
   Cancel any blocked pending contracts.

---

## Setup Instructions

```bash
# Clone repository
git clone https://github.com/cedric-champeix/software-architecture-car-lease-project.git

# Navigate into project directory
cd software-architecture-car-lease-project

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
# Run tests
pnpm test

# Run SonarQube Analysis
# 1. Start SonarQube server
docker-compose -f docker-compose.sonar.yaml up -d

# 2. Run tests with coverage
pnpm test:cov

# 3. Run analysis
# Default (admin/admin)
pnpm sonar

# With specific token
pnpm sonar -Dsonar.login=YOUR_TOKEN
```

---

## Documentation

For comprehensive documentation about the architecture, design patterns, and implementation details, see the **[Wiki Documentation](./docs/README.md)**.

### Quick Links

- 📐 [Hexagonal Architecture](./docs/01-hexagonal-architecture.md) - Learn about our architectural choices
- 🎨 [Design Patterns](./docs/02-design-patterns.md) - Understand the patterns we use
- ⚡ [Batch & Events](./docs/03-batch-and-events.md) - Async processing strategies
- 🧪 [Testing Strategy](./docs/04-testing-strategy.md) - Our approach to testing

---

## Author

Cédric Champeix  
Felix Delassus