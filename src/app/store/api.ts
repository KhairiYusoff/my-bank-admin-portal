import { adminApi } from '@/features/admin/store/adminApi';
import { api as authApi } from '@/features/auth/store/authApi';

// Export the APIs
export { adminApi, authApi };

// Export middleware and reducer for the store
export const apiMiddleware = [
  adminApi.middleware,
  authApi.middleware,
];

// Export reducers for the store
export const apiReducers = {
  [adminApi.reducerPath]: adminApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
};
