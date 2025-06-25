# TypeScript Type Organization

This document outlines the organization of TypeScript types in the codebase to ensure consistency and maintainability.

## Overview

Types are now organized by feature, with each feature having its own `types.ts` file or a `types` directory for more complex type definitions. This makes it easier to find and maintain types related to specific features.

## Directory Structure

```
src/
  features/
    admin/
      components/      # Admin components
      store/          # Redux store and API slices
      types/          # Admin-specific types
        index.ts       # Re-exports all admin types
        activity.ts    # Activity log types
        application.ts # Application-related types
        pendingApplications.ts # Pending applications types
    auth/
      store/         # Auth store and API
      types/         # Auth-related types
    users/
      types.ts       # User-related types
    accounts/
      types.ts      # Account-related types
    transactions/
      types.ts      # Transaction-related types
    staff/
      types.ts      # Staff-related types
    profile/
      types.ts      # Profile-related types
```

## Type Naming Conventions

- Interface names should be in `PascalCase`
- Type names should be in `PascalCase`
- Enum names should be in `PascalCase`
- Use descriptive names that clearly indicate the purpose of the type
- Suffix request/response types with `Request` and `Response` respectively
- Use `I` prefix for interfaces (optional, but be consistent)

## Adding New Types

1. **For a new feature**: Create a new `types.ts` file in the feature directory
2. **For complex features**: Create a `types` directory with multiple files
3. **For shared types**: Add them to the most relevant feature or create a shared types directory
4. **For API types**: Keep them close to the API slice that uses them

## Importing Types

Always import types from their respective feature modules:

```typescript
// Good
import type { User } from '@/features/users/types';
import type { Account } from '@/features/accounts/types';

// Avoid
import { User } from '@/features/admin/store/adminApi';
```

## Type Documentation

Document complex types with JSDoc comments:

```typescript
/**
 * Represents a user in the system
 * @property {string} id - The unique identifier for the user
 * @property {string} name - The user's full name
 * @property {string} email - The user's email address
 * @property {UserRole} role - The user's role in the system
 */
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
```

## Best Practices

1. **Keep types close to where they're used**: Types should be defined in the same feature/module where they're primarily used
2. **Avoid circular dependencies**: Be careful with type dependencies between features
3. **Use `type` imports for types**: This helps with tree-shaking and makes it clear what's a type import
4. **Re-export types**: Use `index.ts` files to re-export types for easier imports
5. **Keep types up to date**: Update types when the API or data structure changes

## Type Safety Tips

- Use TypeScript's strict mode
- Enable `strictNullChecks` and `noImplicitAny`
- Use type guards and type predicates
- Leverage TypeScript's utility types (Partial, Pick, Omit, etc.)
- Use discriminated unions for better type narrowing

## Example: Adding a New Type

1. Define the type in the appropriate feature's types file:

```typescript
// features/notifications/types.ts

/** Notification type enum */
export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

/** Notification interface */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
}

/** Notification creation request */
export interface CreateNotificationRequest {
  type: NotificationType;
  message: string;
  userId: string;
}
```

2. Export it from the feature's index.ts (if it exists):

```typescript
// features/notifications/index.ts
export * from './types';
```

3. Import and use it in your components/API:

```typescript
import type { Notification, CreateNotificationRequest } from '@/features/notifications/types';

function NotificationBadge({ notification }: { notification: Notification }) {
  // Component implementation
}
```
