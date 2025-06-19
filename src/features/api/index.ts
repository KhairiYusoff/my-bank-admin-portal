import { adminApi } from '../admin/adminApi';

// Export the admin API
export { adminApi };

// Export middleware and reducer for the store
export const apiMiddleware = [
  adminApi.middleware,
];

// Export reducers for the store
export const apiReducers = {
  [adminApi.reducerPath]: adminApi.reducer,
};
