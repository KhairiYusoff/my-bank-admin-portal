import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    credentials: 'include', // Important for cookie-based auth
    baseUrl: 'http://127.0.0.1:5001/api', // Use 127.0.0.1 instead of localhost to match frontend origin
    prepareHeaders: (headers, { getState }) => {
      // For cookie-based auth, we don't need to set Authorization header
      // The browser will automatically include the cookie with the request
      
      // Set content type for all requests
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: () => ({}),
});
