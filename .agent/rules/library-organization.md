---
trigger: always_on
---

# Library Structure and Organization

## Naming Conventions

- All libraries use `@lib/` prefix in imports
- Library names use kebab-case: `@lib/domain`, `@lib/in-rest`, `@lib/out-mongoose`
- Each library has a `src/` directory as entry point

## Layer Prefixes

- `@lib/domain` - Core domain logic (no prefix, single instance)
- `@lib/in-*` - Input adapters (REST, messages, cron, etc.)
- `@lib/out-*` - Output adapters (mongoose, messages, etc.)

## Import Paths

- Use TypeScript path aliases defined in [tsconfig.json](car-leasing-project/tsconfig.json:0:0-0:0)
- Internal library imports use `src/...` paths for module resolution
- Example within domain library:
  ```typescript
  import { CreateClient } from 'src/entities/client';
  import type { ClientRepository } from 'src/repositories/client.repository';

## Import Restrictions
- Domain library MUST NOT import from any @lib/in-* or @lib/out-*
- Input adapters MUST NOT import from @lib/out-*
- Output adapters MUST NOT import from @lib/in-*

## Module Structure

Each library follows NestJS module pattern:

- `{library-name}.module.ts` - Module definition
- `{library-name}.service.ts` - Service implementation (if applicable)
- index.ts - Public API exports

Example structure:

libs/
├── domain/
│   └── src/
│       ├── entities/
│       ├── repositories/
│       └── use-cases/
├── in-rest/
│   └── src/
│       ├── in-rest.module.ts
│       └── index.ts
└── out-mongoose/
    └── src/
        ├── out-mongoose.module.ts
        └── index.ts
