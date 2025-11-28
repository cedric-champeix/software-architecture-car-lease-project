---
trigger: always_on
---

# Code Quality Standards

## Linting

### ESLint Configuration

- ESLint config in [eslint.config.mjs](car-leasing-project/eslint.config.mjs:0:0-0:0)
- TypeScript ESLint with strict type checking
- Prettier integration for formatting

### Before Manual Fixes

**ALWAYS run auto-fix first:**

```bash
pnpm lint --fix
```

- This command automatically fixes most ESLint errors
- Solves import sorting, formatting, and common issues
- Only manually fix errors that cannot be auto-resolved
- Saves time and ensures consistency

```
# Auto-fix all issues
pnpm lint --fix

# Check without fixing
pnpm lint
```


## Import Standards

### Use Type Imports

ALWAYS use `import type` for type-only imports:

```
// ✅ Good - Type import
import type { Client } from 'src/entities/client/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';

// ❌ Bad - Regular import for types
import { Client } from 'src/entities/client/client.entity';
```

### When to use import type:

- Type annotations
- Interface/type definitions
- Generic type parameters
- Return types
- Parameter types

### When NOT to use import type:

- Classes used with new keyword
- Enums used as values
- Decorators
- Any value used at runtime

### Import Sorting

- Auto-sorted by eslint-plugin-simple-import-sort
- Run pnpm lint --fix to auto-sort
- Order:
1. Side effects
2. npm packages
3. Absolute imports
4. Type imports (import type)

Example:

```
// Correct import order (auto-sorted by lint --fix)
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { CreateClient } from 'src/entities/client';

import type { Client } from 'src/entities/client/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';
```

## Key Sorting

- Object keys sorted alphabetically (enforced by sort-keys-fix)
- Interface/type keys sorted alphabetically (enforced by typescript-sort-keys)
- Required first in interfaces
- Run `pnpm lint --fix` to auto-sort

Example:

```
// ✅ Keys automatically sorted
export type CreateClientUseCaseInput = {
  address: string;
  birthDate: Date;
  driverLicenseNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};
```

##Type Checking

### Run Type Check

```
pnpm type
```

- Runs `tsc --noEmit`
- Checks for type errors without compilation
- Should pass before committing code
- No type errors allowed in domain layer

