---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript Guidelines

## Core TypeScript Principles
Twenty enforces strict TypeScript usage to ensure type safety and maintainable code. This document outlines our TypeScript conventions and best practices.

## Type Safety

### Strict Typing
- **No 'any' type allowed**
- TypeScript strict mode enabled
- noImplicitAny enabled
  ```typescript
  // âœ… Correct
  function processUser(user: User) {
    return user.name;
  }

  // âŒ Incorrect
  function processUser(user: any) {
    return user.name;
  }
  ```

### Type Definitions

#### Types over Interfaces
- Use `type` for all type definitions
- Exception: When extending third-party interfaces
  ```typescript
  // âœ… Correct
  type User = {
    id: string;
    name: string;
    email: string;
  };

  // âŒ Incorrect
  interface User {
    id: string;
    name: string;
    email: string;
  }
  ```

### String Literals over Enums
- Use string literal unions instead of enums
- Exception: GraphQL enums
  ```typescript
  // âœ… Correct
  type UserRole = 'admin' | 'user' | 'guest';

  // âŒ Incorrect
  enum UserRole {
    Admin = 'admin',
    User = 'user',
    Guest = 'guest',
  }
  ```

## Naming Conventions

### Component Props
- Suffix component prop types with 'Props'
- Keep props focused and single-purpose
  ```typescript
  // âœ… Correct
  type ButtonProps = {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };

  // âŒ Incorrect
  type ButtonParameters = {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  ```

## Type Inference

### Leverage TypeScript Inference
- Use type inference when types are clear
- Explicitly type when inference is ambiguous
  ```typescript
  // âœ… Correct - Clear inference
  const users = ['John', 'Jane']; // inferred as string[]

  // âœ… Correct - Explicit typing needed
  const processUser = (user: User): UserResponse => {
    // Complex processing
    return response;
  };

  // âŒ Incorrect - Unnecessary explicit typing
  const users: string[] = ['John', 'Jane'];
  ```

## Best Practices

### Type Guards
- Use type guards for runtime type checking
- Prefer discriminated unions
  ```typescript
  // âœ… Correct
  type Success = {
    type: 'success';
    data: User;
  };

  type Error = {
    type: 'error';
    message: string;
  };

  type Result = Success | Error;

  function handleResult(result: Result) {
    if (result.type === 'success') {
      // TypeScript knows result.data exists
      console.log(result.data);
    }
  }
  ```

### Generics
- Use generics for reusable type patterns
- Keep generic names descriptive
  ```typescript
  // âœ… Correct
  type ApiResponse<TData> = {
    data: TData;
    status: number;
    message: string;
  };

  // âŒ Incorrect
  type ApiResponse<T> = {
    data: T;
    status: number;
    message: string;
  };
  ```

### Type Exports
- Export types when they're used across files
- Keep type definitions close to their usage
  ```typescript
  // types.ts
  export type User = {
    id: string;
    name: string;
  };

  // UserComponent.tsx
  import { type User } from './types';
  ```

### Utility Types
- Leverage TypeScript utility types
- Create custom utility types for repeated patterns
  ```typescript
  // Built-in utility types
  type UserPartial = Partial<User>;
  type UserReadonly = Readonly<User>;

  // Custom utility types
  type NonNullableProperties<T> = {
    [P in keyof T]: NonNullable<T[P]>;
  };
  ```

