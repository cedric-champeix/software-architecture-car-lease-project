# Hexagonal Architecture (Ports & Adapters)

## Table of Contents
- [Introduction](#introduction)
- [Why Hexagonal Architecture?](#why-hexagonal-architecture)
- [Architecture Overview](#architecture-overview)
- [Implementation in Our Project](#implementation-in-our-project)
- [Benefits Realized](#benefits-realized)
- [Trade-offs and Considerations](#trade-offs-and-considerations)

---

## Introduction

The **Hexagonal Architecture**, also known as **Ports and Adapters**, is an architectural pattern that aims to create loosely coupled application components that can be easily connected to their software environment by means of ports and adapters. This architecture was introduced by Alistair Cockburn to address the problem of business logic being tightly coupled to external concerns like databases, UI, or external services.

In our Car Lease Management System, we've adopted this pattern to ensure our core business logic remains independent of external frameworks and infrastructure concerns.

---

## Why Hexagonal Architecture?

### Core Principles

1. **Separation of Concerns**: Business logic is isolated from technical implementation details
2. **Dependency Inversion**: Dependencies point inward toward the domain, never outward
3. **Testability**: Core business logic can be tested without external dependencies
4. **Flexibility**: Easy to swap implementations (e.g., change database from MongoDB to PostgreSQL)
5. **Maintainability**: Changes to infrastructure don't affect business rules

### Problems It Solves

- **Framework Lock-in**: Business logic is not tied to NestJS, Mongoose, or any specific framework
- **Testing Complexity**: Can test business rules without spinning up databases or HTTP servers
- **Evolution**: Can evolve different parts of the system independently
- **Team Collaboration**: Clear boundaries allow teams to work on different layers simultaneously

---

## Architecture Overview

### The Hexagon Model

```
┌─────────────────────────────────────────────────────────┐
│                    Input Adapters                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   REST   │  │ Messages │  │   Cron   │             │
│  │    API   │  │  Queue   │  │  Tasks   │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │             │             │                     │
│       └─────────────┼─────────────┘                     │
│                     │                                   │
│         ┌───────────▼───────────┐                       │
│         │                       │                       │
│         │   Domain Layer        │                       │
│         │   (Business Logic)    │                       │
│         │                       │                       │
│         │  • Entities           │                       │
│         │  • Use Cases          │                       │
│         │  • Repository Ports   │                       │
│         │  • Business Rules     │                       │
│         │                       │                       │
│         └───────────┬───────────┘                       │
│                     │                                   │
│       ┌─────────────┼─────────────┐                     │
│       │             │             │                     │
│  ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐             │
│  │ Mongoose │  │ Messages │  │  Other   │             │
│  │   ORM    │  │ Producer │  │ External │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                    Output Adapters                      │
└─────────────────────────────────────────────────────────┘
```

### Layer Definitions

#### 1. Domain Layer (`@lib/domain`)
The **core** of the application containing:
- **Entities**: Business objects (Client, Vehicle, Contract)
- **Use Cases**: Business operations (CreateClient, HandleOverdueContracts)
- **Repository Interfaces**: Abstract contracts for data access
- **Business Rules**: Validation logic and domain constraints

**Key Characteristic**: NO external dependencies - pure TypeScript and business logic only.

#### 2. Input Adapters (`@lib/in-*`)
Entry points into the application:
- **`@lib/in-rest`**: REST API controllers (HTTP endpoints)
- **`@lib/in-messages`**: Message queue consumers (Redis listeners)
- **`@lib/in-cron`**: Scheduled tasks (cron jobs)

**Dependency Flow**: Input adapters → Domain layer

#### 3. Output Adapters (`@lib/out-*`)
Connections to external systems:
- **`@lib/out-mongoose`**: Database persistence (MongoDB via Mongoose)
- **`@lib/out-messages`**: Message queue producers (RabbitMQ publishers)

**Dependency Flow**: Output adapters → Domain layer

---

## Implementation in Our Project

### Project Structure

```
libs/
├── domain/                          # Core business logic
│   ├── src/
│   │   ├── entities/               # Business entities
│   │   │   ├── client/
│   │   │   ├── vehicle/
│   │   │   └── contract/
│   │   ├── repositories/           # Repository interfaces (ports)
│   │   │   ├── client.repository.ts
│   │   │   ├── vehicle.repository.ts
│   │   │   └── contract.repository.ts
│   │   ├── use-cases/              # Business operations
│   │   │   ├── client/
│   │   │   ├── vehicle/
│   │   │   └── contract/
│   │   └── common/
│   │       └── use-cases/
│   │           └── use-case.abstract.ts
│   └── tsconfig.json
│
├── in-rest/                        # REST API adapter
│   ├── src/
│   │   ├── client/
│   │   │   └── client.controller.ts
│   │   ├── vehicle/
│   │   └── contract/
│   └── tsconfig.json
│
├── in-messages/                    # Message consumer adapter
│   ├── src/
│   │   └── vehicle/
│   │       └── vehicle-maintenance.consumer.ts
│   └── tsconfig.json
│
├── in-cron/                        # Scheduled tasks adapter
│   ├── src/
│   │   ├── tasks.service.ts
│   │   └── in-cron.module.ts
│   └── tsconfig.json
│
├── out-mongoose/                   # Database adapter
│   ├── src/
│   │   ├── repositories/          # Repository implementations
│   │   │   ├── client.repository.impl.ts
│   │   │   ├── vehicle.repository.impl.ts
│   │   │   └── contract.repository.impl.ts
│   │   └── schemas/               # Mongoose schemas
│   └── tsconfig.json
│
└── out-messages/                   # Message producer adapter
    ├── src/
    │   └── vehicle/
    │       └── vehicle-maintenance.producer.ts
    └── tsconfig.json
```

### Dependency Rules (Strictly Enforced)

```typescript
// ✅ ALLOWED
// Input adapter importing from domain
import { CreateClientUseCase } from '@lib/domain/use-cases/client';

// Output adapter importing from domain
import type { ClientRepository } from '@lib/domain/repositories/client.repository';

// ❌ FORBIDDEN
// Domain importing from adapters
import { ClientController } from '@lib/in-rest/client'; // NEVER!

// Input adapter importing from output adapter
import { MongooseClientRepository } from '@lib/out-mongoose'; // NEVER!

// Output adapter importing from input adapter
import { ClientController } from '@lib/in-rest/client'; // NEVER!
```

### Example: Repository Pattern (Port)

**Domain Layer - Interface (Port)**
```typescript
// libs/domain/src/repositories/client.repository.ts
export abstract class ClientRepository {
  abstract findById({ id }: FindClientByIdInput): Promise<Client | null>;
  abstract findAll(input: FindAllClientsInput): Promise<Client[]>;
  abstract create({ client }: CreateClientInput): Promise<Client>;
  abstract update({ id, clientData }: UpdateClientInput): Promise<Client | null>;
  abstract deleteById({ id }: DeleteClientInput): Promise<boolean>;
}
```

**Output Adapter - Implementation (Adapter)**
```typescript
// libs/out-mongoose/src/repositories/client.repository.impl.ts
@Injectable()
export class MongooseClientRepository extends ClientRepository {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>
  ) {
    super();
  }

  async create({ client }: CreateClientInput): Promise<Client> {
    const createdClient = new this.clientModel(client);
    return createdClient.save();
  }
  
  // ... other implementations
}
```

### Example: Use Case in Domain

```typescript
// libs/domain/src/use-cases/client/create-client/create-client.use-case.ts
export class CreateClientUseCase extends UseCase<CreateClientUseCaseInput, Client> {
  constructor(protected readonly repository: ClientRepository) {
    super();
  }

  async execute(input: CreateClientUseCaseInput): Promise<Client> {
    const client = new CreateClient({
      address: input.address,
      birthDate: input.birthDate,
      driverLicenseNumber: input.driverLicenseNumber,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phoneNumber: input.phoneNumber,
    });

    return this.repository.create({ client });
  }
}
```

**Key Points**:
- Use case depends on `ClientRepository` **interface**, not implementation
- No knowledge of Mongoose, MongoDB, or any infrastructure
- Can be tested with a mock repository

### Example: REST Controller (Input Adapter)

```typescript
// libs/in-rest/src/client/client.controller.ts
@Controller('clients')
export class ClientController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly findAllClientsUseCase: FindAllClientsUseCase,
  ) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.createClientUseCase.execute(createClientDto);
  }

  @Get()
  async findAll() {
    return this.findAllClientsUseCase.execute({});
  }
}
```

**Key Points**:
- Controller depends on use cases from domain
- Translates HTTP requests into use case inputs
- No business logic in the controller

### Example: Message Consumer (Input Adapter)

```typescript
// libs/in-messages/src/vehicle/vehicle-maintenance.consumer.ts
@Processor(QueueNames.VehicleMaintenance)
export class VehicleMaintenanceConsumer extends WorkerHost {
  constructor(
    private readonly cancelContractsForVehicleInMaintenanceUseCase: 
      CancelContractsForVehicleInMaintenanceUseCase,
  ) {
    super();
  }

  async process(job: Job<VehicleMaintenanceJobData>): Promise<any> {
    const { vehicleId } = job.data;
    await this.cancelContractsForVehicleInMaintenanceUseCase.execute(vehicleId);
  }
}
```

**Key Points**:
- Consumes messages from RabbitMQ
- Delegates to domain use case
- Infrastructure concern (message queue) separated from business logic

### Example: Cron Task (Input Adapter)

```typescript
// libs/in-cron/src/tasks.service.ts
@Injectable()
export class TasksService {
  constructor(
    private readonly handleOverdueContractsUseCase: HandleOverdueContractsUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.handleOverdueContractsUseCase.execute();
  }
}
```

**Key Points**:
- Scheduled task runs at midnight
- Triggers domain use case
- Scheduling mechanism separated from business logic

---

## Benefits Realized

### 1. **Independent Testability**

Domain layer can be tested without any infrastructure:

```typescript
// Unit test - no database, no HTTP, no external dependencies
describe('CreateClientUseCase', () => {
  let useCase: CreateClientUseCase;
  let mockRepository: jest.Mocked<ClientRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      // ... other methods
    } as any;
    
    useCase = new CreateClientUseCase(mockRepository);
  });

  it('should create a client', async () => {
    const input = { /* ... */ };
    mockRepository.create.mockResolvedValue({ id: '123', ...input } as any);
    
    const result = await useCase.execute(input);
    
    expect(mockRepository.create).toHaveBeenCalled();
    expect(result.email).toBe(input.email);
  });
});
```

### 2. **Technology Agnostic**

Could swap MongoDB for PostgreSQL by:
1. Creating `@lib/out-typeorm` library
2. Implementing repository interfaces with TypeORM
3. Updating dependency injection in modules
4. **Zero changes to domain layer**

### 3. **Multiple Entry Points**

Same business logic accessible via:
- REST API (`@lib/in-rest`)
- Message Queue (`@lib/in-messages`)
- Scheduled Tasks (`@lib/in-cron`)
- Future: GraphQL, gRPC, CLI, etc.

### 4. **Clear Boundaries**

Each library has a single responsibility:
- `@lib/domain`: Business rules
- `@lib/in-rest`: HTTP handling
- `@lib/out-mongoose`: Data persistence

### 5. **Parallel Development**

Teams can work independently:
- Backend team on domain logic
- API team on REST controllers
- Infrastructure team on database optimization

---

## Trade-offs and Considerations

### Advantages ✅

1. **Testability**: Easy to unit test business logic
2. **Maintainability**: Changes are localized
3. **Flexibility**: Easy to add new adapters
4. **Clarity**: Clear separation of concerns
5. **Longevity**: Business logic survives framework changes

### Challenges ⚠️

1. **Initial Complexity**: More files and abstractions upfront
2. **Learning Curve**: Team needs to understand the pattern
3. **Boilerplate**: Repository interfaces + implementations
4. **Over-engineering Risk**: May be overkill for simple CRUD apps

### When to Use

**Good Fit** ✅:
- Complex business logic
- Long-lived applications
- Multiple interfaces (API, CLI, events)
- Need for high test coverage
- Team wants clear boundaries

**Poor Fit** ❌:
- Simple CRUD applications
- Prototypes or MVPs
- Small team unfamiliar with the pattern
- Tight deadlines with simple requirements

---

## Conclusion

Hexagonal Architecture has proven valuable for our Car Lease Management System by:
- Keeping business logic clean and testable
- Allowing multiple entry points (REST, messages, cron)
- Enabling easy swapping of infrastructure components
- Providing clear boundaries for team collaboration

The investment in proper architecture pays dividends as the system grows and evolves. Our domain layer remains stable while we can freely experiment with different adapters and infrastructure choices.

---

## Further Reading

- [Alistair Cockburn - Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Netflix Tech Blog - Ready for changes with Hexagonal Architecture](https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
