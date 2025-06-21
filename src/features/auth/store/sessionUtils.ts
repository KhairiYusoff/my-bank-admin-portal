import { api } from '@/features/api/apiSlice';

// Time in milliseconds
export const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const WARNING_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export const setupInactivityTimer = (onInactive: () => void, onWarning?: () => void) => {
  let warningTimer: number | null = null;
  let logoutTimer: number | null = null;

  const resetTimers = () => {
    // Clear existing timers if they exist
    if (warningTimer) clearTimeout(warningTimer);
    if (logoutTimer) clearTimeout(logoutTimer);
    
    // Set new warning timer
    warningTimer = window.setTimeout(() => {
      onWarning?.();
      
      // Set logout timer that will trigger after the remaining time
      logoutTimer = window.setTimeout(() => {
        onInactive();
      }, INACTIVITY_TIMEOUT - WARNING_TIMEOUT);
      
    }, WARNING_TIMEOUT);
  };

  // Set initial timers
  resetTimers();

  // Reset timers on user activity
  const events = ['mousedown', 'keydown', 'mousemove', 'scroll', 'click', 'touchstart'];
  const resetTimersOnActivity = () => {
    resetTimers();
  };

  events.forEach(event => {
    window.addEventListener(event, resetTimersOnActivity);
  });

  // Cleanup function
  return () => {
    if (warningTimer) clearTimeout(warningTimer);
    if (logoutTimer) clearTimeout(logoutTimer);
    events.forEach(event => {
      window.removeEventListener(event, resetTimersOnActivity);
    });
  };
};

export const refreshAccessToken = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5001/api/auth/refresh-token', {
      method: 'GET',
      credentials: 'include', // Important for sending cookies
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

// RTK Query error handling
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await api.baseQuery(args, api, extraOptions);
  
  // If 401 and not a refresh request, try to refresh token
  if (result?.error?.status === 401) {
    const refreshResult = await refreshAccessToken();
    
    if (refreshResult) {
      // Retry the original request with new token
      result = await api.baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, clear auth state
      api.dispatch({ type: 'auth/logout' });
      window.location.href = '/login';
    }
  }
  
  return result;
};

// Export the enhanced api instance
export const enhancedApi = api.enhanceEndpoints({
  endpoints: () => ({
    // This will apply to all endpoints
    baseQuery: baseQueryWithReauth,
  }),
});
