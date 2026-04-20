# Engineering Bible (MyBank Admin Portal)

Purpose: Single source of truth for coding patterns in this repo.

## Non-Negotiables

- Read existing implementation pattern before coding.
- Keep modules self-contained and maintainable.
- Prefer existing utilities/hooks/services over creating new ones.
- Avoid broad rewrites for small feature/fix requests.

## Architecture Rules

- Pages: Composition focused, avoid heavy business logic.
- Components: Own UI behavior/state where appropriate.
- Services/Helpers: Centralize side effects and integrations.
- Redux/State Flow: Follow existing slice/action/selectors style used in adjacent files.

## Project Structure

```
src/
  app/
    store/           # Redux store configuration
  components/
    admin/           # Admin-specific components
    layout/          # Layout components
    shared/          # Shared components across features
  features/
    [feature]/       # Feature-based organization
      components/    # Feature components
      pages/         # Feature pages
      store/         # Feature Redux state
        *Api.ts      # RTK Query API slices
        *Slice.ts    # Redux slices
      types/         # TypeScript types
  utils/             # Utility functions
```

## Component Patterns

**React Component Structure:**

```typescript
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { Box, Typography, Button } from '@mui/material';

// Types
interface ComponentProps {
  // Define props here
}

// Validation schema
const validationSchema = yup.object().shape({
  // Define validation rules
});

type FormData = yup.InferType<typeof validationSchema>;

const Component: React.FC<ComponentProps> = ({ ... }) => {
  // State management
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  // Event handlers
  const onSubmit = async (data: FormData) => {
    // Handle form submission
  };

  return (
    <Box sx={{ ... }}>
      {/* Material-UI components */}
    </Box>
  );
};

export default Component;
```

## Form Patterns

**Form with react-hook-form + yup:**

- Use `Controller` for Material-UI components
- Implement `yup` validation schema
- Use `yup.InferType` for form data types
- Handle loading states and disabled submit
- Show validation errors properly

**Form Validation:**

```typescript
const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup.string().min(8, "Min 8 chars").required("Password required"),
});
```

## Redux/RTK Query Patterns

**API Slice Structure:**

```typescript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const featureApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getData: builder.query<ResponseType, ParamType>({
      query: (params) => ({ url: "/endpoint", params }),
      providesTags: (result) => (result ? [{ type: "Tag", id: "LIST" }] : []),
    }),
    createData: builder.mutation<ResponseType, RequestType>({
      query: (data) => ({
        url: "/endpoint",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Tag", id: "LIST" }],
    }),
  }),
});

export const { useGetDataQuery, useCreateDataMutation } = featureApi;
```

**Base Query with Auth:**

- Use `credentials: 'include'` for cookie-based auth
- Handle 401 errors with base query wrapper
- Set proper headers in `prepareHeaders`

## Material-UI Patterns

**Styling Approach:**

- Use `sx` prop for component-specific styles
- Use shared styles from `TableStyles` for tables
- Implement responsive design with Material-UI breakpoints
- Use consistent spacing and typography

**Component Styling:**

```typescript
<Box sx={{
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  p: 3,
}}>
```

**Table Patterns:**

- Use shared `TableStyles` from components
- Implement proper pagination with MUI `TablePagination`
- Handle loading and error states
- Use `StatusChip` for status display

## State Management Rules

**Redux Store Usage:**

- Use `useAppDispatch` and `useAppSelector` hooks
- Follow existing slice patterns in feature stores
- Use RTK Query for API calls
- Implement proper cache tags for data invalidation

**Local State:**

- Use `useState` for UI-only state
- Use `useEffect` for side effects
- Keep component state minimal

## Error Handling Patterns

**API Error Handling:**

```typescript
try {
  const result = await mutation().unwrap();
  // Handle success
} catch (err: any) {
  if (err.status === "FETCH_ERROR") {
    // Handle network error
  } else {
    // Handle API error
    const errorMessage = err?.data?.message || "An error occurred";
  }
}
```

**Form Error Handling:**

- Display validation errors with `errors` from form state
- Show API errors in `Alert` components
- Handle loading states properly

## TypeScript Patterns

**Type Definitions:**

- Define interfaces for props and data
- Use `yup.InferType` for form data types
- Export types from feature `types/` directories
- Use proper typing for API responses

**Import Patterns:**

```typescript
import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { FeatureComponent } from "@/features/[feature]/components/FeatureComponent";
```

## Routing Patterns

**Protected Routes:**

- Use `ProtectedRoute` component for authenticated pages
- Handle redirect logic in route components
- Use React Router for navigation

## Styling Rules

**CSS Modules:**

- Use CSS modules for component-specific styles
- Follow existing naming conventions
- Keep styles scoped to components

**Material-UI Theming:**

- Use Material-UI default theme
- Customize with `sx` prop when needed
- Maintain consistent color scheme

## Refactor Rules

- Preserve external behavior by default.
- Improve readability first, then abstraction.
- Break large refactors into safe, reviewable steps.

## Validation Rules

- Run relevant lint/tests for touched code before completion.
- Mention any unrun checks explicitly in final notes.

## PR/Change Quality

- Keep diffs focused.
- Add brief comments only where logic is not obvious.
- Include risks/assumptions when uncertainty exists.

## Living Document

Update this file when a new pattern becomes team standard.
