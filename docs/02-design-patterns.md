# Design Patterns

## Table of Contents
- [Overview](#overview)
- [Command Pattern (Use Cases)](#command-pattern-use-cases)
- [Repository Pattern](#repository-pattern)
- [Adapter Pattern](#adapter-pattern)
- [Chain of Responsibility Pattern](#chain-of-responsibility-pattern)
- [DTO Pattern](#dto-pattern)
- [Pattern Interactions](#pattern-interactions)

---

## Overview

Our Car Lease Management System leverages several well-established design patterns to create a maintainable, testable, and extensible codebase. Each pattern serves a specific purpose and works in harmony with the hexagonal architecture.

### Patterns Used

| Pattern | Purpose | Location |
|---------|---------|----------|
| **Command** | Encapsulate business operations | `@lib/domain/use-cases` |
| **Repository** | Abstract data access | `@lib/domain/repositories` |
| **Chain of Responsibility** | Validation pipeline | `@lib/domain/use-cases/*/validators` |
| **DTO** | Data transfer objects | `@lib/domain/entities` |

---

## Command Pattern (Use Cases)

### Intent

Encapsulate a request as an object, allowing you to parameterize clients with different requests, queue or log requests, and support undoable operations.

### Implementation

All use cases extend an abstract `UseCase` class that enforces the command pattern:

```typescript
// libs/domain/src/common/use-cases/use-case.abstract.ts
/**
 * Abstract base class for all use cases in the domain layer.
 * Enforces the Command Design Pattern by requiring all use cases 
 * to implement an execute method.
 */
export abstract class UseCase<TInput, TOutput> {
  /**
   * Executes the use case with the provided input.
   * This method must be implemented by all concrete use cases.
   */
  abstract execute(input: TInput): Promise<TOutput>;
}
```

### Example: Create Client Use Case

```typescript
// libs/domain/src/use-cases/client/create-client/create-client.use-case.ts
export type CreateClientUseCaseInput = {
  address: string;
  birthDate: Date;
  driverLicenseNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export class CreateClientUseCase extends UseCase<
  CreateClientUseCaseInput,
  Client
> {
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

### Example: Handle Overdue Contracts Use Case

```typescript
// libs/domain/src/use-cases/contract/handle-overdue-contracts/handle-overdue-contracts.use-case.ts
export class HandleOverdueContractsUseCase extends UseCase<void, void> {
  constructor(private readonly contractRepository: ContractRepository) {
    super();
  }

  async execute(): Promise<void> {
    const contracts = await this.contractRepository.findAll({});

    const overdueContracts = contracts.filter(
      (contract) =>
        contract.status === ContractStatus.ACTIVE &&
        contract.endDate < new Date(),
    );

    for (const { id, startDate, endDate, vehicleId } of overdueContracts) {
      const updateContract = new UpdateContract({
        status: ContractStatus.OVERDUE,
      });

      await this.contractRepository.update({ contract: updateContract, id });

      // Find and cancel affected contracts
      const affectedContracts =
        await this.contractRepository.findByVehicleIdAndDateRange({
          endDate: new Date(endDate.getTime() + AFFECTED_CONTRACTS_DATE_RANGE),
          startDate,
          vehicleId,
        });

      for (const affectedContract of affectedContracts) {
        if (affectedContract.id !== id) {
          const updateContract = new UpdateContract({
            status: ContractStatus.CANCELLED,
          });

          await this.contractRepository.update({
            contract: updateContract,
            id: affectedContract.id,
          });
        }
      }
    }
  }
}
```

### Benefits

1. **Uniform Interface**: All business operations follow the same pattern
2. **Testability**: Easy to mock and test in isolation
3. **Composability**: Use cases can be composed and chained
4. **Single Responsibility**: Each use case does one thing
5. **Type Safety**: TypeScript generics ensure type correctness

### Usage in Adapters

```typescript
// REST Controller
@Controller('clients')
export class ClientController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateClientDto) {
    return this.createClientUseCase.execute(dto);
  }
}

// Message Consumer
@Processor(QueueNames.VehicleMaintenance)
export class VehicleMaintenanceConsumer extends WorkerHost {
  constructor(
    private readonly cancelContractsUseCase: CancelContractsForVehicleInMaintenanceUseCase,
  ) {
    super();
  }

  async process(job: Job<VehicleMaintenanceJobData>): Promise<any> {
    const { vehicleId } = job.data;
    await this.cancelContractsUseCase.execute(vehicleId);
  }
}

// Cron Task
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

---

## Repository Pattern

### Intent

Mediate between the domain and data mapping layers using a collection-like interface for accessing domain objects.

### Implementation

Repositories are defined as **abstract classes** in the domain layer and implemented in the output adapter layer.

#### Domain Layer - Interface (Port)

```typescript
// libs/domain/src/repositories/client.repository.ts
export type CreateClientInput = { client: CreateClient };
export type FindClientByIdInput = { id: Client['id'] };
export type FindAllClientsInput = Record<string, never>;
export type UpdateClientInput = {
  clientData: UpdateClient;
  id: Client['id'];
};
export type DeleteClientInput = { id: Client['id'] };

export abstract class ClientRepository {
  abstract findById({ id }: FindClientByIdInput): Promise<Client | null>;
  abstract findAll(input: FindAllClientsInput): Promise<Client[]>;
  abstract create({ client }: CreateClientInput): Promise<Client>;
  abstract update({ id, clientData }: UpdateClientInput): Promise<Client | null>;
  abstract deleteById({ id }: DeleteClientInput): Promise<boolean>;
}
```

#### Output Adapter - Implementation

```typescript
// libs/out-mongoose/src/repositories/client.repository.impl.ts
@Injectable()
export class MongooseClientRepository extends ClientRepository {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>
  ) {
    super();
  }

  async findById({ id }: FindClientByIdInput): Promise<Client | null> {
    return this.clientModel.findById(id).exec();
  }

  async findAll(input: FindAllClientsInput): Promise<Client[]> {
    return this.clientModel.find().exec();
  }

  async create({ client }: CreateClientInput): Promise<Client> {
    const createdClient = new this.clientModel(client);
    return createdClient.save();
  }

  async update({ id, clientData }: UpdateClientInput): Promise<Client | null> {
    return this.clientModel
      .findByIdAndUpdate(id, clientData, { new: true })
      .exec();
  }

  async deleteById({ id }: DeleteClientInput): Promise<boolean> {
    const result = await this.clientModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
```

### Benefits

1. **Abstraction**: Domain doesn't know about Mongoose, MongoDB, or any database
2. **Testability**: Easy to create mock repositories for testing
3. **Flexibility**: Can swap database implementations without changing domain
4. **Centralization**: All data access logic in one place
5. **Type Safety**: Strongly typed inputs and outputs

### Repository Hierarchy

```
ClientRepository (abstract)
├── MongooseClientRepository (Mongoose implementation)
└── InMemoryClientRepository (for testing)

VehicleRepository (abstract)
├── MongooseVehicleRepository (Mongoose implementation)
└── InMemoryVehicleRepository (for testing)

ContractRepository (abstract)
├── MongooseContractRepository (Mongoose implementation)
└── InMemoryContractRepository (for testing)
```

---

## Chain of Responsibility Pattern

### Intent

Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain until an object handles it.

### Implementation

Used for validation pipelines before executing use cases.

#### Base Validator

```typescript
// libs/domain/src/common/validators/validator.abstract.ts
export abstract class Validator<T> {
  private nextValidator?: Validator<T>;

  setNext(validator: Validator<T>): Validator<T> {
    this.nextValidator = validator;
    return validator;
  }

  async validate(input: T): Promise<void> {
    await this.check(input);
    
    if (this.nextValidator) {
      await this.nextValidator.validate(input);
    }
  }

  protected abstract check(input: T): Promise<void>;
}
```

#### Example: Client Creation Validators

```typescript
// libs/domain/src/use-cases/client/validators/unique-client.validator.ts
export class UniqueClientValidator extends Validator<CreateClientUseCaseInput> {
  constructor(private readonly repository: ClientRepository) {
    super();
  }

  protected async check(input: CreateClientUseCaseInput): Promise<void> {
    const clients = await this.repository.findAll({});
    
    const exists = clients.some(
      (client) =>
        client.firstName === input.firstName &&
        client.lastName === input.lastName &&
        client.birthDate.getTime() === input.birthDate.getTime()
    );

    if (exists) {
      throw new ConflictException(
        'A client with this name and birth date already exists'
      );
    }
  }
}

// libs/domain/src/use-cases/client/validators/unique-driver-license.validator.ts
export class UniqueDriverLicenseValidator extends Validator<CreateClientUseCaseInput> {
  constructor(private readonly repository: ClientRepository) {
    super();
  }

  protected async check(input: CreateClientUseCaseInput): Promise<void> {
    const clients = await this.repository.findAll({});
    
    const exists = clients.some(
      (client) => client.driverLicenseNumber === input.driverLicenseNumber
    );

    if (exists) {
      throw new ConflictException(
        'A client with this driver license number already exists'
      );
    }
  }
}
```

#### Chaining Validators in Use Case

```typescript
// libs/domain/src/use-cases/client/create-client/create-client.use-case.validator.ts
export class CreateClientUseCaseValidator extends CreateClientUseCase {
  constructor(repository: ClientRepository) {
    super(repository);
  }

  async execute(input: CreateClientUseCaseInput): Promise<Client> {
    // Build the validation chain
    const validator = new UniqueClientValidator(this.repository);
    validator.setNext(new UniqueDriverLicenseValidator(this.repository));
    
    // Execute the chain
    await validator.validate(input);

    // If all validations pass, execute the use case
    return super.execute(input);
  }
}
```

#### Example: Contract Creation Validators

```typescript
// libs/domain/src/use-cases/contract/create-contract/create-contract.use-case.validator.ts
export class CreateContractUseCaseValidator extends CreateContractUseCase {
  constructor(
    contractRepository: ContractRepository,
    private clientRepository: ClientRepository,
    private vehicleRepository: VehicleRepository,
  ) {
    super(contractRepository);
  }

  async execute(input: CreateContractUseCaseInput): Promise<Contract> {
    // Build a complex validation chain
    const validator = new ClientExistsValidator(this.clientRepository);
    validator
      .setNext(new VehicleExistsValidator(this.vehicleRepository))
      .setNext(new VehicleNotMaintenanceValidator(this.vehicleRepository))
      .setNext(new NoOverlappingContractValidator(this.contractRepository));

    // Execute the chain
    await validator.validate(input);

    // If all validations pass, execute the use case
    return super.execute(input);
  }
}
```

### Validator Examples

**Client Exists Validator**
```typescript
export class ClientExistsValidator extends Validator<CreateContractUseCaseInput> {
  constructor(private readonly repository: ClientRepository) {
    super();
  }

  protected async check(input: CreateContractUseCaseInput): Promise<void> {
    const client = await this.repository.findById({ id: input.clientId });
    
    if (!client) {
      throw new NotFoundException(`Client with id ${input.clientId} not found`);
    }
  }
}
```

**Vehicle Not in Maintenance Validator**
```typescript
export class VehicleNotMaintenanceValidator extends Validator<CreateContractUseCaseInput> {
  constructor(private readonly repository: VehicleRepository) {
    super();
  }

  protected async check(input: CreateContractUseCaseInput): Promise<void> {
    const vehicle = await this.repository.findById({ id: input.vehicleId });
    
    if (vehicle?.status === VehicleStatus.MAINTENANCE) {
      throw new BadRequestException(
        'Cannot create contract for vehicle in maintenance'
      );
    }
  }
}
```

**No Overlapping Contract Validator**
```typescript
export class NoOverlappingContractValidator extends Validator<CreateContractUseCaseInput> {
  constructor(private readonly repository: ContractRepository) {
    super();
  }

  protected async check(input: CreateContractUseCaseInput): Promise<void> {
    const overlappingContracts = 
      await this.repository.findByVehicleIdAndDateRange({
        vehicleId: input.vehicleId,
        startDate: input.startDate,
        endDate: input.endDate,
      });

    if (overlappingContracts.length > 0) {
      throw new ConflictException(
        'Vehicle already has a contract in this date range'
      );
    }
  }
}
```

### Benefits

1. **Separation of Concerns**: Each validator has a single responsibility
2. **Reusability**: Validators can be reused in different chains
3. **Flexibility**: Easy to add, remove, or reorder validators
4. **Testability**: Each validator can be tested independently
5. **Readability**: Clear validation flow

### Validation Flow Diagram

```
Input
  │
  ▼
┌─────────────────────┐
│ UniqueClient        │ ──✓──▶ Next
│ Validator           │ ──✗──▶ Throw ConflictException
└─────────────────────┘
  │
  ▼
┌─────────────────────┐
│ UniqueDriverLicense │ ──✓──▶ Next
│ Validator           │ ──✗──▶ Throw ConflictException
└─────────────────────┘
  │
  ▼
Execute Use Case
```

---

## DTO Pattern

### Intent

Transfer data between processes or layers while encapsulating the data structure.

### Implementation

DTOs are used to represent entities in different states (creation, update, read).

#### Entity DTOs

```typescript
// libs/domain/src/entities/client/client.entity.ts
export class Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  driverLicenseNumber: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

// libs/domain/src/entities/client/create-client.entity.ts
export class CreateClient {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  driverLicenseNumber: string;
  address: string;

  constructor(data: CreateClient) {
    Object.assign(this, data);
  }
}

// libs/domain/src/entities/client/update-client.entity.ts
export class UpdateClient {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;

  constructor(data: UpdateClient) {
    Object.assign(this, data);
  }
}
```

#### Contract DTOs

```typescript
// libs/domain/src/entities/contract/contract.entity.ts
export class Contract {
  id: string;
  clientId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
}

// libs/domain/src/entities/contract/create-contract.entity.ts
export class CreateContract {
  clientId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  status: ContractStatus;

  constructor(data: CreateContract) {
    Object.assign(this, data);
  }
}

// libs/domain/src/entities/contract/update-contract.entity.ts
export class UpdateContract {
  status?: ContractStatus;
  endDate?: Date;

  constructor(data: UpdateContract) {
    Object.assign(this, data);
  }
}
```

### Benefits

1. **Type Safety**: Compile-time checking of data structures
2. **Clarity**: Clear distinction between create, update, and read operations
3. **Validation**: Can add validation logic in constructors
4. **Immutability**: Can enforce immutability rules
5. **Documentation**: Self-documenting data structures

---

## Pattern Interactions

### How Patterns Work Together

```
┌─────────────────────────────────────────────────────────────┐
│                     REST Controller                         │
│                   (Adapter Pattern)                         │
│  Converts HTTP request to use case input                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Use Case Validator                             │
│          (Chain of Responsibility)                          │
│  Validator 1 → Validator 2 → Validator 3                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Use Case                                  │
│              (Command Pattern)                              │
│  Executes business logic                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Repository                                 │
│             (Repository Pattern)                            │
│  Abstract interface for data access                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            Mongoose Repository                              │
│              (Adapter Pattern)                              │
│  Converts domain calls to Mongoose operations              │
└─────────────────────────────────────────────────────────────┘
```

### Example Flow: Creating a Contract

1. **HTTP Request** arrives at `ContractController` (Adapter)
2. **Controller** calls `CreateContractUseCaseValidator` (Command)
3. **Validator** builds chain (Chain of Responsibility):
   - `ClientExistsValidator` → checks if client exists
   - `VehicleExistsValidator` → checks if vehicle exists
   - `VehicleNotMaintenanceValidator` → checks vehicle status
   - `NoOverlappingContractValidator` → checks for conflicts
4. **Use Case** creates `CreateContract` DTO
5. **Use Case** calls `ContractRepository.create()` (Repository)
6. **MongooseContractRepository** saves to database (Adapter)
7. **Response** flows back through the layers

---

## Conclusion

The combination of these design patterns creates a robust, maintainable architecture:

- **Command Pattern**: Uniform interface for all business operations
- **Repository Pattern**: Abstract data access layer
- **Adapter Pattern**: Connect domain to external systems
- **Chain of Responsibility**: Flexible validation pipelines
- **DTO Pattern**: Type-safe data transfer

Each pattern serves a specific purpose and complements the hexagonal architecture, resulting in a codebase that is:
- ✅ Easy to test
- ✅ Easy to maintain
- ✅ Easy to extend
- ✅ Technology-agnostic
- ✅ Well-organized

---

## Further Reading

- [Design Patterns: Elements of Reusable Object-Oriented Software (Gang of Four)](https://en.wikipedia.org/wiki/Design_Patterns)
- [Martin Fowler - Patterns of Enterprise Application Architecture](https://martinfowler.com/books/eaa.html)
- [Command Pattern](https://refactoring.guru/design-patterns/command)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Chain of Responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility)
