import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/app/store';

const baseQuery = fetchBaseQuery({
  credentials: 'include',
  baseUrl: 'http://127.0.0.1:5001/api',
  prepareHeaders: (headers, { getState }) => {
    headers.set('Content-Type', 'application/json');
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // If 401 and we haven't tried to refresh yet
  if (result.error?.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    );
    
    if (refreshResult.data) {
      // Retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed - clear auth state and redirect to login
      api.dispatch({ type: 'auth/logout' });
      window.location.href = '/login';
    }
  }
  
  return result;
};

export const api = createApi({
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

export const { middleware: apiMiddleware, reducerPath: apiReducerPath, reducer: apiReducer } = api;
