import React, { Suspense, lazy, useCallback, ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { logout, selectIsAuthenticated } from "./features/auth/store/authSlice";
import { theme } from "./app/theme";
import { routes } from "./routes";
import AdminLayout from "./components/layout/AdminLayout";
import SessionTimeout from "./features/auth/components/SessionTimeout";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load components for better performance
const Login = lazy(() => import("./features/auth/pages/LoginForm"));

// Wrapper component to handle Suspense for route elements
const RouteElement = ({ element }: { element: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>{element}</Suspense>
);

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // Render login or main app based on auth status
  const renderContent = () => {
    if (isAuthenticated) {
      return (
        <>
          <Routes>
            <Route element={<AdminLayout />}>
              {routes.map(({ path, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <Suspense fallback={<LoadingSpinner fullScreen />}>
                      {element}
                    </Suspense>
                  }
                />
              ))}
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
          <SessionTimeout onLogout={handleLogout} />
        </>
      );
    }

    return (
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Login />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<LoadingSpinner fullScreen />}>
            {renderContent()}
          </Suspense>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default React.memo(App);
