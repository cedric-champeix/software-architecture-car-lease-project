---
trigger: always_on
---

# Testing Standards

## Test File Organization

### Unit Tests

- **Location**: Same folder as the file being tested
- **Naming**: `{filename}.spec.ts`
- **Example**: 
  - Source: [libs/domain/src/use-cases/client/create-client/create-client.use-case.ts](cci:7://file:///Users/champeic/Cours/software-architecture/car-leasing-project/libs/domain/src/use-cases/client/create-client/create-client.use-case.ts:0:0-0:0)
  - Test: [libs/domain/src/use-cases/client/create-client/create-client.use-case.spec.ts](cci:7://file:///Users/champeic/Cours/software-architecture/car-leasing-project/libs/domain/src/use-cases/client/create-client/create-client.use-case.spec.ts:0:0-0:0)

### E2E Tests

- **Location**: `test/` folder at project root
- **Naming**: `{feature}.e2e-spec.ts`
- **Config**: [test/jest-e2e.json](cci:7://file:///Users/champeic/Cours/software-architecture/car-leasing-project/test/jest-e2e.json:0:0-0:0)
- **Examples**: 
  - `test/client.e2e-spec.ts`
  - `test/contract.e2e-spec.ts`
  - `test/vehicle.e2e-spec.ts`

## Test Structure

### Unit Tests

- Use Jest as testing framework
- Mock external dependencies (repositories, services)
- Test business logic in isolation
- Focus on use cases, entities, and validators

Example:
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
      // ... other methods
    } as any;
    
    useCase = new CreateClientUseCase(mockRepository);
  });

  it('should create a client', async () => {
    const input = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      // ... other fields
    };

    mockRepository.create.mockResolvedValue({ id: '123', ...input } as any);
    
    const result = await useCase.execute(input);
    
    expect(mockRepository.create).toHaveBeenCalled();
    expect(result.email).toBe(input.email);
  });
});

## E2E Tests
- Test complete request/response cycles
- Use real database (test container or in-memory)
- Test API endpoints and integration flows
- Verify business rules end-to-end

Example structure:

// test/client.e2e-spec.ts
import * as request from 'supertest';
import type { INestApplication } from '@nestjs/common';

describe('ClientController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Setup app and database
  });

  it('/clients (POST)', () => {
    return request(app.getHttpServer())
      .post('/clients')
      .send({ email: 'test@example.com', /* ... */ })
      .expect(201);
  });
});

## Jest Configuration
- Main config in package.json Jest section
- Use ts-jest for TypeScript support
- Path mappings must match tsconfig.json

## Running Tests

```
# All unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E tests
pnpm test:e2e
```

## Mocking Best Practices

- Use jest.spyOn() for function mocking
- Create mock repositories with jest functions
- Avoid testing framework internals
- Focus on business logic verification

