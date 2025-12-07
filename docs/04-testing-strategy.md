# Testing Strategy

## Table of Contents
- [Overview](#overview)
- [Testing Pyramid](#testing-pyramid)
- [Unit Testing](#unit-testing)
- [E2E Testing](#e2e-testing)
- [Test Coverage](#test-coverage)
- [Best Practices](#best-practices)
- [Running Tests](#running-tests)

---

## Overview

Our Car Lease Management System follows a comprehensive testing strategy to ensure code quality, reliability, and maintainability. We employ two primary testing levels:

1. **Unit Tests**: Test individual components in isolation (focus on domain layer)
2. **E2E Tests**: Test complete application flows from end to end

### Testing Goals

- ✅ **90%+ coverage** of domain layer (business logic)
- ✅ **Complete lifecycle testing** via E2E tests
- ✅ **Fast feedback loop** for developers
- ✅ **Confidence in refactoring**
- ✅ **Documentation through tests**

---

## Testing Pyramid

Our testing strategy follows the testing pyramid principle:

```
        ┌─────────┐
        │   E2E   │  ← Few, slow, expensive
        │  Tests  │     Test complete flows
        ├─────────┤
        │  Unit   │  ← Many, fast, cheap
        │  Tests  │     Test business logic
        └─────────┘
```

### Distribution

- **Unit Tests**: ~80% of tests (focus on domain layer)
- **E2E Tests**: ~20% of tests (focus on critical user journeys)

### Rationale

1. **Unit tests** are fast and pinpoint failures
2. **E2E tests** ensure system integration works
3. **Balance** between speed and confidence

---

## Unit Testing

### Philosophy

> **Test business logic in isolation, without external dependencies**

Unit tests focus on the **domain layer** (`@lib/domain`), which contains:
- Use cases
- Entities
- Validators
- Business rules

### Coverage Goal: 90%+

We aim for **at least 90% code coverage** in the domain layer because:
- Domain layer contains critical business logic
- High coverage ensures business rules are tested
- Easier to achieve in domain (no infrastructure dependencies)
- Provides confidence when refactoring

### Test Structure

All unit tests follow the **Arrange-Act-Assert** (AAA) pattern:

```typescript
describe('CreateClientUseCase', () => {
  // Arrange: Setup
  let useCase: CreateClientUseCase;
  let mockRepository: jest.Mocked<ClientRepository>;

  beforeEach(() => {
    // Arrange: Create mocks
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      deleteById: jest.fn(),
    } as any;
    
    useCase = new CreateClientUseCase(mockRepository);
  });

  it('should create a client', async () => {
    // Arrange: Prepare test data
    const input = {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1990-01-01'),
      driverLicenseNumber: 'DL123456',
      address: '123 Main St',
      phoneNumber: '+1234567890',
    };

    const expectedClient = { id: '123', ...input };
    mockRepository.create.mockResolvedValue(expectedClient as any);

    // Act: Execute the use case
    const result = await useCase.execute(input);

    // Assert: Verify the results
    expect(mockRepository.create).toHaveBeenCalledWith({
      client: expect.objectContaining({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
      }),
    });
    expect(result).toEqual(expectedClient);
  });
});
```

### Example: Testing Use Cases

#### Create Client Use Case Test

```typescript
// libs/domain/src/use-cases/client/create-client/create-client.use-case.spec.ts
import type { ClientRepository } from 'src/repositories/client.repository';

import { CreateClientUseCase } from './create-client.use-case';

describe('CreateClientUseCase', () => {
  let useCase: CreateClientUseCase;
  let mockRepository: jest.Mocked<ClientRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      deleteById: jest.fn(),
    } as any;

    useCase = new CreateClientUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should create a client with valid data', async () => {
      // Arrange
      const input = {
        address: '123 Main St',
        birthDate: new Date('1990-01-01'),
        driverLicenseNumber: 'DL123456',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
      };

      const expectedClient = {
        id: 'client-123',
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedClient as any);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith({
        client: expect.objectContaining({
          address: input.address,
          birthDate: input.birthDate,
          driverLicenseNumber: input.driverLicenseNumber,
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
        }),
      });
      expect(result).toEqual(expectedClient);
    });
  });
});
```

#### Handle Overdue Contracts Use Case Test

```typescript
// libs/domain/src/use-cases/contract/handle-overdue-contracts/handle-overdue-contracts.use-case.spec.ts
import { ContractStatus } from 'src/entities/contract/enum';
import type { ContractRepository } from 'src/repositories/contract.repository';

import { HandleOverdueContractsUseCase } from './handle-overdue-contracts.use-case';

describe('HandleOverdueContractsUseCase', () => {
  let useCase: HandleOverdueContractsUseCase;
  let mockRepository: jest.Mocked<ContractRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findByVehicleIdAndDateRange: jest.fn(),
      update: jest.fn(),
    } as any;

    useCase = new HandleOverdueContractsUseCase(mockRepository);
  });

  it('should mark active contracts as overdue when past end date', async () => {
    // Arrange
    const pastDate = new Date('2024-01-01');
    const futureDate = new Date('2024-12-31');

    const overdueContract = {
      id: 'contract-1',
      clientId: 'client-1',
      vehicleId: 'vehicle-1',
      startDate: new Date('2023-12-01'),
      endDate: pastDate,
      status: ContractStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const activeContract = {
      id: 'contract-2',
      clientId: 'client-2',
      vehicleId: 'vehicle-2',
      startDate: new Date('2024-12-01'),
      endDate: futureDate,
      status: ContractStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository.findAll.mockResolvedValue([overdueContract, activeContract]);
    mockRepository.findByVehicleIdAndDateRange.mockResolvedValue([]);

    // Act
    await useCase.execute();

    // Assert
    expect(mockRepository.update).toHaveBeenCalledWith({
      id: 'contract-1',
      contract: expect.objectContaining({
        status: ContractStatus.OVERDUE,
      }),
    });
    expect(mockRepository.update).not.toHaveBeenCalledWith({
      id: 'contract-2',
      contract: expect.anything(),
    });
  });

  it('should cancel affected contracts when a contract becomes overdue', async () => {
    // Arrange
    const overdueContract = {
      id: 'contract-1',
      clientId: 'client-1',
      vehicleId: 'vehicle-1',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-10'),
      status: ContractStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const affectedContract = {
      id: 'contract-2',
      clientId: 'client-2',
      vehicleId: 'vehicle-1', // Same vehicle
      startDate: new Date('2024-01-11'),
      endDate: new Date('2024-01-20'),
      status: ContractStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository.findAll.mockResolvedValue([overdueContract]);
    mockRepository.findByVehicleIdAndDateRange.mockResolvedValue([
      overdueContract,
      affectedContract,
    ]);

    // Act
    await useCase.execute();

    // Assert
    expect(mockRepository.update).toHaveBeenCalledWith({
      id: 'contract-1',
      contract: expect.objectContaining({
        status: ContractStatus.OVERDUE,
      }),
    });
    expect(mockRepository.update).toHaveBeenCalledWith({
      id: 'contract-2',
      contract: expect.objectContaining({
        status: ContractStatus.CANCELLED,
      }),
    });
  });
});
```

### Example: Testing Validators

#### Unique Client Validator Test

```typescript
// libs/domain/src/use-cases/client/validators/unique-client.validator.spec.ts
import { ConflictException } from '@nestjs/common';

import type { ClientRepository } from 'src/repositories/client.repository';

import { UniqueClientValidator } from './unique-client.validator';

describe('UniqueClientValidator', () => {
  let validator: UniqueClientValidator;
  let mockRepository: jest.Mocked<ClientRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
    } as any;

    validator = new UniqueClientValidator(mockRepository);
  });

  it('should pass validation when client does not exist', async () => {
    // Arrange
    const input = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1990-01-01'),
      email: 'john@example.com',
      phoneNumber: '+1234567890',
      driverLicenseNumber: 'DL123456',
      address: '123 Main St',
    };

    mockRepository.findAll.mockResolvedValue([]);

    // Act & Assert
    await expect(validator.validate(input)).resolves.not.toThrow();
  });

  it('should throw ConflictException when client already exists', async () => {
    // Arrange
    const input = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1990-01-01'),
      email: 'john@example.com',
      phoneNumber: '+1234567890',
      driverLicenseNumber: 'DL123456',
      address: '123 Main St',
    };

    const existingClient = {
      id: 'client-123',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1990-01-01'),
      email: 'different@example.com',
      phoneNumber: '+9876543210',
      driverLicenseNumber: 'DL999999',
      address: '456 Other St',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository.findAll.mockResolvedValue([existingClient]);

    // Act & Assert
    await expect(validator.validate(input)).rejects.toThrow(ConflictException);
    await expect(validator.validate(input)).rejects.toThrow(
      'A client with this name and birth date already exists'
    );
  });
});
```

### Test Organization

```
libs/domain/src/
├── use-cases/
│   ├── client/
│   │   ├── create-client/
│   │   │   ├── create-client.use-case.ts
│   │   │   ├── create-client.use-case.spec.ts          ← Unit test
│   │   │   ├── create-client.use-case.validator.ts
│   │   │   └── create-client.use-case.validator.spec.ts ← Unit test
│   │   └── validators/
│   │       ├── unique-client.validator.ts
│   │       └── unique-client.validator.spec.ts          ← Unit test
│   ├── contract/
│   │   ├── handle-overdue-contracts/
│   │   │   ├── handle-overdue-contracts.use-case.ts
│   │   │   └── handle-overdue-contracts.use-case.spec.ts ← Unit test
│   └── vehicle/
```

**Key Points**:
- Test files are **co-located** with source files
- Naming convention: `*.spec.ts`
- Easy to find and maintain

### Mocking Strategy

#### Repository Mocks

```typescript
// Create a typed mock repository
const mockRepository: jest.Mocked<ClientRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
} as any;
```

#### Use Case Mocks

```typescript
// Mock a use case for testing validators
const mockUseCase: jest.Mocked<CreateClientUseCase> = {
  execute: jest.fn(),
} as any;
```

### Benefits of Unit Testing

1. **Fast**: Run in milliseconds
2. **Isolated**: Test one component at a time
3. **Pinpoint Failures**: Easy to identify what broke
4. **Refactoring Confidence**: Safe to change implementation
5. **Documentation**: Tests show how to use the code

---

## E2E Testing

### Philosophy

> **Test complete user journeys from HTTP request to database and back**

E2E tests verify that all layers work together correctly:
- REST controllers
- Use cases
- Repositories
- Database
- Message queues (if applicable)

### Test Complete Lifecycles

We test **entire entity lifecycles** to ensure the system works end-to-end:

#### Client Lifecycle
1. Create client
2. Retrieve client
3. Update client
4. Delete client
5. Verify deletion

#### Vehicle Lifecycle
1. Create vehicle
2. Retrieve vehicle
3. Update vehicle status
4. Delete vehicle
5. Verify deletion

#### Contract Lifecycle
1. Create client
2. Create vehicle
3. Create contract
4. Retrieve contract
5. Update contract status
6. Delete contract
7. Cleanup (delete client and vehicle)

### Test Structure

E2E tests are located in `apps/car-leasing-project/test/`:

```
apps/car-leasing-project/test/
├── jest-e2e.json                                    ← E2E Jest config
├── app.e2e-spec.ts                                  ← Basic health check
└── application/
    ├── api/
    │   ├── client/
    │   │   └── client.e2e-spec.ts                   ← Client E2E tests
    │   ├── contract/
    │   │   └── contract.e2e-spec.ts                 ← Contract E2E tests
    │   └── vehicle/
    │       └── vehicle.e2e-spec.ts                  ← Vehicle E2E tests
    └── messages/
        └── vehicle-maintenance.consumer.e2e-spec.ts ← Message queue E2E tests
```

### Example: Client E2E Tests

```typescript
// apps/car-leasing-project/test/application/api/client/client.e2e-spec.ts
import type { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../../src/app.module';

describe('ClientController (e2e)', () => {
  let app: INestApplication;
  let createdClientId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Client Lifecycle', () => {
    it('POST /clients - should create a new client', async () => {
      const createClientDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        birthDate: '1990-01-01',
        driverLicenseNumber: 'DL123456',
        address: '123 Main St',
      };

      const response = await request(app.getHttpServer())
        .post('/clients')
        .send(createClientDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe(createClientDto.firstName);
      expect(response.body.lastName).toBe(createClientDto.lastName);
      expect(response.body.email).toBe(createClientDto.email);

      createdClientId = response.body.id;
    });

    it('GET /clients/:id - should retrieve the created client', async () => {
      const response = await request(app.getHttpServer())
        .get(`/clients/${createdClientId}`)
        .expect(200);

      expect(response.body.id).toBe(createdClientId);
      expect(response.body.firstName).toBe('John');
      expect(response.body.lastName).toBe('Doe');
    });

    it('GET /clients - should list all clients', async () => {
      const response = await request(app.getHttpServer())
        .get('/clients')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.some((c: any) => c.id === createdClientId)).toBe(true);
    });

    it('PATCH /clients/:id - should update the client', async () => {
      const updateClientDto = {
        phoneNumber: '+9876543210',
        address: '456 New Address',
      };

      const response = await request(app.getHttpServer())
        .patch(`/clients/${createdClientId}`)
        .send(updateClientDto)
        .expect(200);

      expect(response.body.phoneNumber).toBe(updateClientDto.phoneNumber);
      expect(response.body.address).toBe(updateClientDto.address);
    });

    it('DELETE /clients/:id - should delete the client', async () => {
      await request(app.getHttpServer())
        .delete(`/clients/${createdClientId}`)
        .expect(200);
    });

    it('GET /clients/:id - should return 404 after deletion', async () => {
      await request(app.getHttpServer())
        .get(`/clients/${createdClientId}`)
        .expect(404);
    });
  });

  describe('Validation', () => {
    it('POST /clients - should return 400 for invalid email', async () => {
      const invalidDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'invalid-email',
        phoneNumber: '+1234567890',
        birthDate: '1990-01-01',
        driverLicenseNumber: 'DL654321',
        address: '789 Test St',
      };

      await request(app.getHttpServer())
        .post('/clients')
        .send(invalidDto)
        .expect(400);
    });

    it('POST /clients - should return 409 for duplicate driver license', async () => {
      const firstClient = {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        phoneNumber: '+1111111111',
        birthDate: '1985-05-15',
        driverLicenseNumber: 'DL999999',
        address: '111 First St',
      };

      // Create first client
      await request(app.getHttpServer())
        .post('/clients')
        .send(firstClient)
        .expect(201);

      // Try to create duplicate
      const duplicateClient = {
        ...firstClient,
        firstName: 'Bob',
        email: 'bob@example.com',
      };

      await request(app.getHttpServer())
        .post('/clients')
        .send(duplicateClient)
        .expect(409);
    });
  });
});
```

### Example: Contract E2E Tests

```typescript
// apps/car-leasing-project/test/application/api/contract/contract.e2e-spec.ts
describe('ContractController (e2e)', () => {
  let app: INestApplication;
  let clientId: string;
  let vehicleId: string;
  let contractId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Setup: Create client and vehicle
    const clientResponse = await request(app.getHttpServer())
      .post('/clients')
      .send({
        firstName: 'Contract',
        lastName: 'Test',
        email: 'contract.test@example.com',
        phoneNumber: '+1234567890',
        birthDate: '1990-01-01',
        driverLicenseNumber: 'DL-CONTRACT-TEST',
        address: '123 Contract St',
      });
    clientId = clientResponse.body.id;

    const vehicleResponse = await request(app.getHttpServer())
      .post('/vehicles')
      .send({
        brand: 'Toyota',
        model: 'Camry',
        engineType: 'Hybrid',
        color: 'Blue',
        licensePlate: 'ABC-123-CONTRACT',
        acquisitionDate: '2024-01-01',
        status: 'AVAILABLE',
      });
    vehicleId = vehicleResponse.body.id;
  });

  afterAll(async () => {
    // Cleanup
    await request(app.getHttpServer()).delete(`/clients/${clientId}`);
    await request(app.getHttpServer()).delete(`/vehicles/${vehicleId}`);
    await app.close();
  });

  describe('Contract Lifecycle', () => {
    it('POST /contracts - should create a new contract', async () => {
      const createContractDto = {
        clientId,
        vehicleId,
        startDate: '2024-12-01',
        endDate: '2024-12-31',
      };

      const response = await request(app.getHttpServer())
        .post('/contracts')
        .send(createContractDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.clientId).toBe(clientId);
      expect(response.body.vehicleId).toBe(vehicleId);
      expect(response.body.status).toBe('PENDING');

      contractId = response.body.id;
    });

    it('GET /contracts/:id - should retrieve the contract', async () => {
      const response = await request(app.getHttpServer())
        .get(`/contracts/${contractId}`)
        .expect(200);

      expect(response.body.id).toBe(contractId);
      expect(response.body.clientId).toBe(clientId);
      expect(response.body.vehicleId).toBe(vehicleId);
    });

    it('PATCH /contracts/:id - should update contract status', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/contracts/${contractId}`)
        .send({ status: 'ACTIVE' })
        .expect(200);

      expect(response.body.status).toBe('ACTIVE');
    });

    it('DELETE /contracts/:id - should delete the contract', async () => {
      await request(app.getHttpServer())
        .delete(`/contracts/${contractId}`)
        .expect(200);
    });
  });

  describe('Business Rules', () => {
    it('POST /contracts - should prevent overlapping contracts', async () => {
      // Create first contract
      const firstContract = await request(app.getHttpServer())
        .post('/contracts')
        .send({
          clientId,
          vehicleId,
          startDate: '2025-01-01',
          endDate: '2025-01-31',
        })
        .expect(201);

      // Try to create overlapping contract
      await request(app.getHttpServer())
        .post('/contracts')
        .send({
          clientId,
          vehicleId,
          startDate: '2025-01-15',
          endDate: '2025-02-15',
        })
        .expect(409);

      // Cleanup
      await request(app.getHttpServer())
        .delete(`/contracts/${firstContract.body.id}`);
    });

    it('POST /contracts - should prevent contract for vehicle in maintenance', async () => {
      // Update vehicle to maintenance
      await request(app.getHttpServer())
        .patch(`/vehicles/${vehicleId}`)
        .send({ status: 'MAINTENANCE' });

      // Try to create contract
      await request(app.getHttpServer())
        .post('/contracts')
        .send({
          clientId,
          vehicleId,
          startDate: '2025-02-01',
          endDate: '2025-02-28',
        })
        .expect(400);

      // Restore vehicle status
      await request(app.getHttpServer())
        .patch(`/vehicles/${vehicleId}`)
        .send({ status: 'AVAILABLE' });
    });
  });
});
```

### Example: Message Queue E2E Tests

```typescript
// apps/car-leasing-project/test/application/messages/vehicle-maintenance.consumer.e2e-spec.ts
describe('VehicleMaintenanceConsumer (e2e)', () => {
  let app: INestApplication;
  let vehicleId: string;
  let contractId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should cancel pending contracts when vehicle enters maintenance', async () => {
    // 1. Create client
    const clientResponse = await request(app.getHttpServer())
      .post('/clients')
      .send({
        firstName: 'Maintenance',
        lastName: 'Test',
        email: 'maintenance@example.com',
        phoneNumber: '+1234567890',
        birthDate: '1990-01-01',
        driverLicenseNumber: 'DL-MAINT-TEST',
        address: '123 Maintenance St',
      });
    const clientId = clientResponse.body.id;

    // 2. Create vehicle
    const vehicleResponse = await request(app.getHttpServer())
      .post('/vehicles')
      .send({
        brand: 'Honda',
        model: 'Civic',
        engineType: 'Gasoline',
        color: 'Red',
        licensePlate: 'XYZ-789-MAINT',
        acquisitionDate: '2024-01-01',
        status: 'AVAILABLE',
      });
    vehicleId = vehicleResponse.body.id;

    // 3. Create pending contract
    const contractResponse = await request(app.getHttpServer())
      .post('/contracts')
      .send({
        clientId,
        vehicleId,
        startDate: '2025-03-01',
        endDate: '2025-03-31',
      });
    contractId = contractResponse.body.id;

    // 4. Update vehicle to maintenance (triggers event)
    await request(app.getHttpServer())
      .patch(`/vehicles/${vehicleId}`)
      .send({ status: 'MAINTENANCE' });

    // 5. Wait for message queue processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 6. Verify contract was cancelled
    const updatedContract = await request(app.getHttpServer())
      .get(`/contracts/${contractId}`)
      .expect(200);

    expect(updatedContract.body.status).toBe('CANCELLED');

    // Cleanup
    await request(app.getHttpServer()).delete(`/contracts/${contractId}`);
    await request(app.getHttpServer()).delete(`/vehicles/${vehicleId}`);
    await request(app.getHttpServer()).delete(`/clients/${clientId}`);
  });
});
```

### E2E Test Configuration

```json
// apps/car-leasing-project/test/jest-e2e.json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "moduleNameMapper": {
    "^@lib/(.*)$": "<rootDir>/../../../libs/$1/src"
  }
}
```

### Benefits of E2E Testing

1. **Integration Verification**: Ensures all layers work together
2. **Realistic Testing**: Tests actual HTTP requests and database operations
3. **Regression Prevention**: Catches breaking changes across layers
4. **Business Validation**: Verifies business rules in real scenarios
5. **Confidence**: High confidence that the system works as expected

---

## Test Coverage

### Coverage Goals

| Layer | Coverage Goal | Rationale |
|-------|---------------|-----------|
| **Domain** | **90%+** | Critical business logic |
| **Adapters** | 70%+ | Integration points |
| **Overall** | 80%+ | Balanced coverage |

### Measuring Coverage

```bash
# Run unit tests with coverage
pnpm test:cov

# View coverage report
open coverage/lcov-report/index.html
```

### Coverage Report Example

```
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   92.15 |    88.23 |   94.44 |   92.56 |
 domain/use-cases/client  |   95.23 |    91.66 |   100   |   95.45 |
 domain/use-cases/vehicle |   93.75 |    87.50 |   100   |   94.11 |
 domain/use-cases/contract|   89.47 |    85.71 |   88.88 |   90.00 |
--------------------------|---------|----------|---------|---------|
```

### Current Coverage Status

Based on our implementation:

- ✅ **Domain layer**: 90%+ coverage achieved
- ✅ **Use cases**: All critical paths tested
- ✅ **Validators**: Comprehensive test coverage
- ✅ **E2E tests**: Complete lifecycle coverage

---

## Best Practices

### Unit Testing Best Practices

1. **Test Behavior, Not Implementation**
   ```typescript
   // ✅ Good - tests behavior
   expect(result.status).toBe(ContractStatus.CANCELLED);
   
   // ❌ Bad - tests implementation
   expect(mockRepository.update).toHaveBeenCalledTimes(1);
   ```

2. **Use Descriptive Test Names**
   ```typescript
   // ✅ Good
   it('should cancel pending contracts when vehicle enters maintenance', ...)
   
   // ❌ Bad
   it('test1', ...)
   ```

3. **Follow AAA Pattern**
   - **Arrange**: Set up test data and mocks
   - **Act**: Execute the code under test
   - **Assert**: Verify the results

4. **One Assertion Per Test** (when possible)
   ```typescript
   // ✅ Good
   it('should return client with correct email', async () => {
     const result = await useCase.execute(input);
     expect(result.email).toBe(input.email);
   });
   
   it('should return client with correct name', async () => {
     const result = await useCase.execute(input);
     expect(result.firstName).toBe(input.firstName);
   });
   ```

5. **Mock External Dependencies**
   ```typescript
   // ✅ Good - mock repository
   const mockRepository: jest.Mocked<ClientRepository> = {
     create: jest.fn(),
     // ...
   };
   
   // ❌ Bad - use real repository
   const repository = new MongooseClientRepository(model);
   ```

### E2E Testing Best Practices

1. **Test Complete Flows**
   - Create → Read → Update → Delete
   - Test the entire lifecycle

2. **Clean Up After Tests**
   ```typescript
   afterAll(async () => {
     // Delete test data
     await request(app.getHttpServer()).delete(`/clients/${clientId}`);
     await app.close();
   });
   ```

3. **Use Realistic Data**
   - Use valid email addresses
   - Use realistic dates
   - Use proper formatting

4. **Test Error Cases**
   - Invalid input (400)
   - Not found (404)
   - Conflicts (409)

5. **Isolate Tests**
   - Each test should be independent
   - Don't rely on test execution order

### Common Pitfalls to Avoid

❌ **Testing Implementation Details**
```typescript
// Bad - brittle test
expect(mockRepository.create).toHaveBeenCalledTimes(1);
```

❌ **Not Cleaning Up E2E Tests**
```typescript
// Bad - leaves test data in database
it('should create client', async () => {
  await request(app.getHttpServer()).post('/clients').send(dto);
  // Missing cleanup!
});
```

❌ **Mocking Too Much**
```typescript
// Bad - mocking everything defeats the purpose
jest.mock('@lib/domain/use-cases/client');
jest.mock('@lib/domain/repositories/client.repository');
```

❌ **Not Testing Edge Cases**
```typescript
// Bad - only tests happy path
it('should create client', async () => {
  const result = await useCase.execute(validInput);
  expect(result).toBeDefined();
});
// Missing: invalid input, duplicates, etc.
```

---

## Running Tests

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:cov

# Run specific test file
pnpm test create-client.use-case.spec.ts

# Run tests for specific pattern
pnpm test --testNamePattern="should create"
```

### E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific E2E test file
pnpm test:e2e client.e2e-spec.ts

# Run E2E tests with verbose output
pnpm test:e2e --verbose
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run unit tests
        run: pnpm test:cov
      
      - name: Run E2E tests
        run: pnpm test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Conclusion

Our comprehensive testing strategy ensures:

### Unit Testing
- ✅ **90%+ coverage** of domain layer
- ✅ **Fast feedback** for developers
- ✅ **Isolated testing** of business logic
- ✅ **Confidence in refactoring**

### E2E Testing
- ✅ **Complete lifecycle testing** of all entities
- ✅ **Integration verification** across layers
- ✅ **Business rule validation** in real scenarios
- ✅ **Regression prevention**

### Overall Benefits
- 🚀 **High code quality**
- 🛡️ **Reduced bugs in production**
- 📚 **Living documentation**
- 🔄 **Safe refactoring**
- 💪 **Developer confidence**

By maintaining this testing discipline, we ensure that our Car Lease Management System remains reliable, maintainable, and ready for evolution.

---

## Further Reading

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Testing Best Practices](https://testingjavascript.com/)
- [Test-Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
