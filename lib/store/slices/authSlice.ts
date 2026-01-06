'use client';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getApolloClient } from '@/lib/apollo/client';
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  LOGOUT_MUTATION,
  REFRESH_TOKEN_MUTATION,
  CURRENT_USER_QUERY,
} from '@/lib/graphql/queries';
import Cookies from 'js-cookie';
import type { RootState } from '../index';

// Types
interface UserRole {
  role: {
    name: string;
    displayName: string;
    permissions: string[];
  };
  isPrimary: boolean;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  userRoles: UserRole[];
  createdAt: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

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

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  tokens: AuthTokens | null;
}

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Helper functions for token management
const setTokens = (tokens: AuthTokens) => {
  Cookies.set(TOKEN_KEY, tokens.accessToken, {
    expires: 1,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  Cookies.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  // Also store in localStorage for Apollo client
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
};

const clearTokens = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

const getAccessToken = () => Cookies.get(TOKEN_KEY);
const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_KEY);

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  tokens: null,
};

// Async thunks
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAccessToken();
      if (!token) {
        return { user: null };
      }

      const client = getApolloClient();
      const { data, errors } = await client.query({
        query: CURRENT_USER_QUERY,
        fetchPolicy: 'network-only',
      });

      if (errors?.length) {
        clearTokens();
        return { user: null };
      }

      return { user: data.me };
    } catch (error: any) {
      clearTokens();
      return rejectWithValue(error.message || 'Failed to initialize auth');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (input: LoginInput, { rejectWithValue }) => {
    try {
      const client = getApolloClient();
      const { data, errors } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { input },
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      if (!data?.login) {
        return rejectWithValue('Login failed');
      }

      const tokens: AuthTokens = {
        accessToken: data.login.accessToken,
        refreshToken: data.login.refreshToken,
      };
      setTokens(tokens);

      return {
        user: data.login.user,
        tokens,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (input: RegisterInput, { rejectWithValue }) => {
    try {
      const client = getApolloClient();
      const { data, errors } = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { input },
      });

      if (errors?.length) {
        return rejectWithValue(errors[0].message);
      }

      if (!data?.register) {
        return rejectWithValue('Registration failed');
      }

      const tokens: AuthTokens = {
        accessToken: data.register.accessToken,
        refreshToken: data.register.refreshToken,
      };
      setTokens(tokens);

      return {
        user: data.register.user,
        tokens,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const client = getApolloClient();
      await client.mutate({ mutation: LOGOUT_MUTATION });
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      // Clear Apollo cache
      const client = getApolloClient();
      await client.clearStore();
    }
    return null;
  }
);

export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return rejectWithValue('No refresh token available');
      }

      const client = getApolloClient();
      const { data, errors } = await client.mutate({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: { refreshToken },
      });

      if (errors?.length) {
        clearTokens();
        return rejectWithValue(errors[0].message);
      }

      if (!data?.refreshToken) {
        clearTokens();
        return rejectWithValue('Token refresh failed');
      }

      const tokens: AuthTokens = {
        accessToken: data.refreshToken.accessToken,
        refreshToken: data.refreshToken.refreshToken,
      };
      setTokens(tokens);

      // Fetch updated user data
      const { data: userData } = await client.query({
        query: CURRENT_USER_QUERY,
        fetchPolicy: 'network-only',
      });

      return {
        user: userData.me,
        tokens,
      };
    } catch (error: any) {
      clearTokens();
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.tokens = null;
      state.error = null;
      clearTokens();
    },
  },
  extraReducers: (builder) => {
    // Initialize auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.user;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
      });

    // Refresh token
    builder
      .addCase(refreshAuthToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { setUser, clearError, resetAuth } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthInitialized = (state: RootState) => state.auth.isInitialized;

// Role and permission selectors
export const selectUserRoles = (state: RootState): string[] => {
  const user = state.auth.user;
  if (!user) return [];
  return user.userRoles.map((ur) => ur.role.name);
};

export const selectHasRole = (roleName: string) => (state: RootState): boolean => {
  const user = state.auth.user;
  if (!user) return false;
  return user.userRoles.some((ur) => ur.role.name === roleName);
};

export const selectHasPermission = (permission: string) => (state: RootState): boolean => {
  const user = state.auth.user;
  if (!user) return false;
  return user.userRoles.some(
    (ur) => ur.role.permissions.includes(permission) || ur.role.permissions.includes('*')
  );
};

export const selectHasAnyPermission = (permissions: string[]) => (state: RootState): boolean => {
  const user = state.auth.user;
  if (!user) return false;
  return permissions.some((permission) =>
    user.userRoles.some(
      (ur) => ur.role.permissions.includes(permission) || ur.role.permissions.includes('*')
    )
  );
};

export default authSlice.reducer;
