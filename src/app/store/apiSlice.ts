import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/app/store';

// Create base query with credentials for cookie-based auth
const baseQuery = fetchBaseQuery({
  baseUrl: '/api', // Using Vite proxy
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // For cookie-based auth, we don't need to set Authorization header
    // The browser will automatically include cookies with each request
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Simple wrapper for baseQuery that handles 401 errors
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Handle 401 Unauthorized
  if (result.error?.status === 401) {
    // If we get a 401, the session might have expired
    // Redirect to login page
    window.location.href = '/login';
    // Clear any existing auth state
    api.dispatch({ type: 'auth/logout' });
  }
  
  return result;
};

// Create the base API
const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    'User',
    'PendingApplications',
    'Staff',
    'Account',
    'Transactions',
    'Customer',
    'UserProfile',
    'UserActivity',
  ],
});

// Export the API instance and its types
export { api };
export const { middleware: apiMiddleware, reducer: apiReducer, reducerPath } = api;
