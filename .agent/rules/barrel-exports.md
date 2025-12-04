---
trigger: always_on
---

# Barrel Export Pattern

## Index Files (index.ts)

All `index.ts` files should use wildcard exports (`export *`) instead of named exports for re-exporting from sibling files.

### Pattern

```typescript
// ✅ Correct - Use wildcard exports
export * from './file-name';
export * from './another-file';

// ❌ Incorrect - Do not use named exports
export { ClassName } from './file-name';
export { functionName } from './another-file';
```

### Rationale

- **Simplicity**: Reduces maintenance when adding/removing exports from source files
- **Consistency**: Single pattern across all barrel files
- **Less boilerplate**: No need to explicitly list every export
- **Future-proof**: New exports from source files automatically available

### Examples

#### Use Cases
```typescript
// libs/domain/src/use-cases/client/index.ts
export * from './create-client.use-case';
export * from './update-client.use-case';
export * from './delete-client.use-case';
```

#### Entities
```typescript
// libs/domain/src/entities/client/index.ts
export * from './client.entity';
export * from './create-client.entity';
```

#### Common Utilities
```typescript
// libs/domain/src/common/use-cases/index.ts
export * from './use-case.abstract';
```

## Exceptions

If you need to re-export specific items (e.g., to avoid naming conflicts), document the reason:

```typescript
// Only export specific items to avoid conflict with X
export { SpecificClass } from './file-name';
```
