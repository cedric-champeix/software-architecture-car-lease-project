---
trigger: model_decision
description: Apply when working within `libs/domain`
---

# Domain Layer Patterns

## Entities

### Construction Pattern

- Use class-based entities with typed properties
- Constructor accepts full entity object with proper typing
- Use `Object.assign(this, init)` for initialization
- Separate creation entities for validation: [CreateClient](car-leasing-project/libs/domain/src/use-cases/client/create-client/create-client.use-case.ts:14:0-38:1), `UpdateClient`

### Example

```typescript
// libs/domain/src/entities/client/client.entity.ts
export class Client {
  public id: string;
  public email: string;
  public phoneNumber: string;
  public firstName: string;
  public lastName: string;
  public birthDate: Date;
  public driverLicenseNumber: string;
  public address: string;

  constructor(init: Client) {
    Object.assign(this, init);
  }
}

## Use Cases

### File Structure

- Location: libs/domain/src/use-cases/{entity}/{action}/

- Files:
- `{action}-{entity}.use-case.ts` - Use case implementation
- `{action}-{entity}.use-case.spec.ts` - Unit tests
- `{action}-{entity}.use-case.validator.ts` - Business rule validators (if needed)
- `index.ts` - Exports

Example:

libs/domain/src/use-cases/
└── client/
    ├── create-client/
    │   ├── create-client.use-case.ts
    │   ├── create-client.use-case.spec.ts
    │   ├── create-client.use-case.validator.ts
    │   └── index.ts
    └── update-client/
        ├── update-client.use-case.ts
        ├── update-client.use-case.spec.ts
        └── index.ts

## Use Case Pattern

- Each use case is a class with constructor injection
- Define input type: {Action}{Entity}UseCaseInput
- Implement execute() method that returns Promise<Result>
- Constructor receives repository interfaces (dependency injection)

example:

// libs/domain/src/use-cases/client/create-client/create-client.use-case.ts
import { CreateClient } from 'src/entities/client';
import type { Client } from 'src/entities/client/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';

export type CreateClientUseCaseInput = {
  address: string;
  birthDate: Date;
  driverLicenseNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export class CreateClientUseCase {
  constructor(protected readonly repository: ClientRepository) {}

  async execute(input: CreateClientUseCaseInput): Promise<Client> {
    const client = new CreateClient(input);
    return this.repository.create({ client });
  }
}

## Validators (Business Rules)

### Purpose

- Validators encapsulate business rule validation logic
- Used for complex validations that go beyond simple type checking
- Examples: uniqueness checks, cross-entity validations, domain constraints

### Validator Pattern
- Use class-validator package for validation decorators
- Create custom validators for business-specific rules
- Validators extend base validation handler pattern
- Each validator handles ONE specific business rule

### File Naming
- Location: Same folder as use case
- Naming: {action}-{entity}.use-case.validator.ts

### Example Structure

// libs/domain/src/use-cases/client/create-client/create-client.use-case.validator.ts
import type { ClientRepository } from 'src/repositories/client.repository';
import { ValidationHandler } from 'src/common/validators';

import type { CreateClientUseCaseInput } from './create-client.use-case';

export class UniqueDriverLicenseValidator extends ValidationHandler<CreateClientUseCaseInput> {
  constructor(private repository: ClientRepository) {
    super();
  }

  async validate(input: CreateClientUseCaseInput): Promise<void> {
    const existing = await this.repository.findByDriverLicense(
      input.driverLicenseNumber
    );
    
    if (existing) {
      throw new Error('Driver license already exists');
    }
  }
}

## Common Business Rules to Validate

- Uniqueness constraints: driver license, license plate, etc.
- Availability checks: vehicle not already rented, client eligible
- State transitions: contract status changes, vehicle status
- Time-based rules: late returns, overlapping contracts
- Cross-entity rules: client can rent multiple vehicles, vehicle only one client

## Repositories

### Interface Pattern
- Define repository interfaces in libs/domain/src/repositories/
- Use abstract classes or TypeScript interfaces
- Implementations live in @lib/out-* adapters (e.g., @lib/out-mongoose)

### Example

// libs/domain/src/repositories/client.repository.ts
import type { Client } from 'src/entities/client/client.entity';
import type { CreateClient } from 'src/entities/client/create-client.entity';

export abstract class ClientRepository {
  abstract create(params: { client: CreateClient }): Promise<Client>;
  abstract findById(id: string): Promise<Client | null>;
  abstract findByDriverLicense(license: string): Promise<Client | null>;
  abstract findAll(): Promise<Client[]>;
  abstract update(id: string, client: Partial<Client>): Promise<Client>;
  abstract delete(id: string): Promise<void>;
}