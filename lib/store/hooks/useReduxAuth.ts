'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  initializeAuth,
  loginUser,
  registerUser,
  logoutUser,
  refreshAuthToken,
  clearError,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectAuthInitialized,
  selectUserRoles,
  selectHasRole,
  selectHasPermission,
  selectHasAnyPermission,
} from '../slices/authSlice';
import { resetCart } from '../slices/cartSlice';
import { resetWishlist } from '../slices/wishlistSlice';
import { showSuccess, showError } from '../slices/uiSlice';

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  accountType?: 'buyer' | 'seller';
}

// Main auth hook
export function useReduxAuth() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isInitialized = useAppSelector(selectAuthInitialized);
  const roles = useAppSelector(selectUserRoles);

  const initialize = useCallback(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const login = useCallback(
    async (input: LoginInput) => {
      try {
        const result = await dispatch(loginUser(input)).unwrap();
        dispatch(showSuccess(`Welcome back, ${result.user.firstName}!`));
        return { success: true, user: result.user };
      } catch (error: any) {
        dispatch(showError(error || 'Login failed'));
        return { success: false, error };
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      try {
        const result = await dispatch(registerUser(input)).unwrap();
        dispatch(showSuccess(`Welcome, ${result.user.firstName}! Your account has been created.`));
        return { success: true, user: result.user };
      } catch (error: any) {
        dispatch(showError(error || 'Registration failed'));
        return { success: false, error };
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // Clear cart and wishlist on logout
      dispatch(resetCart());
      dispatch(resetWishlist());
      dispatch(showSuccess('You have been logged out'));
      return { success: true };
    } catch (error: any) {
      return { success: false, error };
    }
  }, [dispatch]);

  const refreshToken = useCallback(async () => {
    try {
      await dispatch(refreshAuthToken()).unwrap();
      return { success: true };
    } catch (error: any) {
      return { success: false, error };
    }
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const hasRole = useCallback(
    (roleName: string) => roles.includes(roleName),
    [roles]
  );

  return {
    // Data
    user,
    roles,

    // State
    isAuthenticated,
    isLoading,
    isInitialized,
    error,

    // Actions
    initialize,
    login,
    register,
    logout,
    refreshToken,
    clearError: clearAuthError,
    hasRole,
  };
}

// Hook for login form
export function useReduxLogin() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const login = useCallback(
    async (input: LoginInput) => {
      try {
        const result = await dispatch(loginUser(input)).unwrap();
        dispatch(showSuccess(`Welcome back, ${result.user.firstName}!`));
        return { success: true, user: result.user };
      } catch (error: any) {
        dispatch(showError(error || 'Invalid email or password'));
        return { success: false, error };
      }
    },
    [dispatch]
  );

  const clearLoginError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    login,
    isLoading,
    error,
    clearError: clearLoginError,
  };
}

// Hook for registration form
export function useReduxRegister() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const register = useCallback(
    async (input: RegisterInput) => {
      try {
        const result = await dispatch(registerUser(input)).unwrap();
        dispatch(showSuccess(`Welcome, ${result.user.firstName}!`));
        return { success: true, user: result.user };
      } catch (error: any) {
        dispatch(showError(error || 'Registration failed'));
        return { success: false, error };
      }
    },
    [dispatch]
  );

  const clearRegisterError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    register,
    isLoading,
    error,
    clearError: clearRegisterError,
  };
}

// Hook for checking permissions
export function usePermissions() {
  const user = useAppSelector(selectUser);
  const roles = useAppSelector(selectUserRoles);

  const hasRole = useCallback(
    (roleName: string) => roles.includes(roleName),
    [roles]
  );

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false;
      return user.userRoles.some(
        (ur) => ur.role.permissions.includes(permission) || ur.role.permissions.includes('*')
      );
    },
    [user]
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]) => {
      if (!user) return false;
      return permissions.some((permission) =>
        user.userRoles.some(
          (ur) => ur.role.permissions.includes(permission) || ur.role.permissions.includes('*')
        )
      );
    },
    [user]
  );

  return {
    roles,
    hasRole,
    hasPermission,
    hasAnyPermission,
    isBuyer: hasRole('BUYER'),
    isSeller: hasRole('SELLER'),
    isAdmin: hasRole('ADMIN'),
  };
}

// Hook for protected routes
export function useRequireAuth(options?: {
  roles?: string[];
  permissions?: string[];
  redirectTo?: string;
}) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitialized = useAppSelector(selectAuthInitialized);
  const { hasRole, hasAnyPermission } = usePermissions();

  const isAuthorized = (() => {
    if (!isAuthenticated) return false;

    if (options?.roles && !options.roles.some(hasRole)) {
      return false;
    }

    if (options?.permissions && !hasAnyPermission(options.permissions)) {
      return false;
    }

    return true;
  })();

  return {
    isAuthenticated,
    isInitialized,
    isAuthorized,
    isLoading: !isInitialized,
    redirectTo: !isAuthenticated
      ? options?.redirectTo || '/auth/login'
      : '/unauthorized',
  };
}

export default useReduxAuth;
