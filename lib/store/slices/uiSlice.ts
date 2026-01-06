'use client';

import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Types
export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  severity: NotificationSeverity;
  autoHideDuration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ModalConfig {
  id: string;
  type: 'quickView' | 'confirmation' | 'auth' | 'cart' | 'search' | 'custom';
  props?: Record<string, unknown>;
  onClose?: () => void;
}

export interface QuickViewState {
  isOpen: boolean;
  productId: string | null;
}

export interface SearchState {
  isOpen: boolean;
  query: string;
  recentSearches: string[];
}

export interface SidebarState {
  isOpen: boolean;
  type: 'cart' | 'menu' | 'filters' | null;
}

export interface LoadingState {
  global: boolean;
  operations: Record<string, boolean>;
}

interface UIState {
  // Theme
  themeMode: 'light' | 'dark' | 'system';

  // Notifications
  notifications: Notification[];

  // Modals
  modals: ModalConfig[];
  quickView: QuickViewState;

  // Sidebar/Drawer
  sidebar: SidebarState;

  // Search
  search: SearchState;

  // Loading states
  loading: LoadingState;

  // Mobile menu
  mobileMenuOpen: boolean;

  // Scroll behavior
  scrollPosition: number;
  isScrollingUp: boolean;

  // Page transitions
  isPageTransitioning: boolean;
}

// Initial state
const initialState: UIState = {
  themeMode: 'system',
  notifications: [],
  modals: [],
  quickView: {
    isOpen: false,
    productId: null,
  },
  sidebar: {
    isOpen: false,
    type: null,
  },
  search: {
    isOpen: false,
    query: '',
    recentSearches: [],
  },
  loading: {
    global: false,
    operations: {},
  },
  mobileMenuOpen: false,
  scrollPosition: 0,
  isScrollingUp: true,
  isPageTransitioning: false,
};

// Utility to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setThemeMode: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.themeMode = action.payload;
    },
    toggleTheme: (state) => {
      if (state.themeMode === 'light') {
        state.themeMode = 'dark';
      } else {
        state.themeMode = 'light';
      }
    },

    // Notifications
    showNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id'> & { id?: string }>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: action.payload.id || generateId(),
        autoHideDuration: action.payload.autoHideDuration ?? 3000,
      };
      state.notifications.push(notification);
    },
    hideNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },

    // Modals
    openModal: (state, action: PayloadAction<ModalConfig>) => {
      // Check if modal with same ID already exists
      const exists = state.modals.some((m) => m.id === action.payload.id);
      if (!exists) {
        state.modals.push(action.payload);
      }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter((m) => m.id !== action.payload);
    },
    closeAllModals: (state) => {
      state.modals = [];
    },

    // Quick View Modal
    openQuickView: (state, action: PayloadAction<string>) => {
      state.quickView = {
        isOpen: true,
        productId: action.payload,
      };
    },
    closeQuickView: (state) => {
      state.quickView = {
        isOpen: false,
        productId: null,
      };
    },

    // Sidebar
    openSidebar: (state, action: PayloadAction<'cart' | 'menu' | 'filters'>) => {
      state.sidebar = {
        isOpen: true,
        type: action.payload,
      };
    },
    closeSidebar: (state) => {
      state.sidebar = {
        isOpen: false,
        type: null,
      };
    },
    toggleSidebar: (state, action: PayloadAction<'cart' | 'menu' | 'filters'>) => {
      if (state.sidebar.isOpen && state.sidebar.type === action.payload) {
        state.sidebar = { isOpen: false, type: null };
      } else {
        state.sidebar = { isOpen: true, type: action.payload };
      }
    },

    // Search
    openSearch: (state) => {
      state.search.isOpen = true;
    },
    closeSearch: (state) => {
      state.search.isOpen = false;
    },
    toggleSearch: (state) => {
      state.search.isOpen = !state.search.isOpen;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.search.query = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.search.recentSearches.includes(query)) {
        state.search.recentSearches = [query, ...state.search.recentSearches.slice(0, 9)];
      }
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.search.recentSearches = state.search.recentSearches.filter(
        (s) => s !== action.payload
      );
    },
    clearRecentSearches: (state) => {
      state.search.recentSearches = [];
    },

    // Loading
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setOperationLoading: (
      state,
      action: PayloadAction<{ operation: string; loading: boolean }>
    ) => {
      if (action.payload.loading) {
        state.loading.operations[action.payload.operation] = true;
      } else {
        delete state.loading.operations[action.payload.operation];
      }
    },
    clearAllLoading: (state) => {
      state.loading = { global: false, operations: {} };
    },

    // Mobile Menu
    openMobileMenu: (state) => {
      state.mobileMenuOpen = true;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },

    // Scroll
    updateScrollPosition: (state, action: PayloadAction<number>) => {
      state.isScrollingUp = action.payload < state.scrollPosition;
      state.scrollPosition = action.payload;
    },

    // Page Transitions
    startPageTransition: (state) => {
      state.isPageTransitioning = true;
    },
    endPageTransition: (state) => {
      state.isPageTransitioning = false;
    },

    // Reset UI
    resetUI: () => initialState,
  },
});

// Actions
export const {
  setThemeMode,
  toggleTheme,
  showNotification,
  hideNotification,
  clearAllNotifications,
  openModal,
  closeModal,
  closeAllModals,
  openQuickView,
  closeQuickView,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  openSearch,
  closeSearch,
  toggleSearch,
  setSearchQuery,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  setGlobalLoading,
  setOperationLoading,
  clearAllLoading,
  openMobileMenu,
  closeMobileMenu,
  toggleMobileMenu,
  updateScrollPosition,
  startPageTransition,
  endPageTransition,
  resetUI,
} = uiSlice.actions;

// Helper action creators
export const showSuccess = (message: string, autoHideDuration?: number) =>
  showNotification({ message, severity: 'success', autoHideDuration });

export const showError = (message: string, autoHideDuration?: number) =>
  showNotification({ message, severity: 'error', autoHideDuration });

export const showWarning = (message: string, autoHideDuration?: number) =>
  showNotification({ message, severity: 'warning', autoHideDuration });

export const showInfo = (message: string, autoHideDuration?: number) =>
  showNotification({ message, severity: 'info', autoHideDuration });

// Base selectors
export const selectUI = (state: RootState) => state.ui;
export const selectThemeMode = (state: RootState) => state.ui.themeMode;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectModals = (state: RootState) => state.ui.modals;
export const selectQuickView = (state: RootState) => state.ui.quickView;
export const selectSidebar = (state: RootState) => state.ui.sidebar;
export const selectSearch = (state: RootState) => state.ui.search;
export const selectLoading = (state: RootState) => state.ui.loading;
export const selectMobileMenuOpen = (state: RootState) => state.ui.mobileMenuOpen;
export const selectScrollPosition = (state: RootState) => state.ui.scrollPosition;
export const selectIsScrollingUp = (state: RootState) => state.ui.isScrollingUp;
export const selectIsPageTransitioning = (state: RootState) => state.ui.isPageTransitioning;

// Memoized selectors
export const selectIsGlobalLoading = createSelector(
  [selectLoading],
  (loading) => loading.global
);

export const selectIsOperationLoading = (operation: string) =>
  createSelector([selectLoading], (loading) => loading.operations[operation] ?? false);

export const selectHasActiveModals = createSelector(
  [selectModals],
  (modals) => modals.length > 0
);

export const selectTopModal = createSelector([selectModals], (modals) =>
  modals.length > 0 ? modals[modals.length - 1] : null
);

export const selectIsQuickViewOpen = createSelector(
  [selectQuickView],
  (quickView) => quickView.isOpen
);

export const selectQuickViewProductId = createSelector(
  [selectQuickView],
  (quickView) => quickView.productId
);

export const selectIsSidebarOpen = createSelector(
  [selectSidebar],
  (sidebar) => sidebar.isOpen
);

export const selectSidebarType = createSelector(
  [selectSidebar],
  (sidebar) => sidebar.type
);

export const selectIsSearchOpen = createSelector(
  [selectSearch],
  (search) => search.isOpen
);

export const selectSearchQuery = createSelector(
  [selectSearch],
  (search) => search.query
);

export const selectRecentSearches = createSelector(
  [selectSearch],
  (search) => search.recentSearches
);

export const selectHasNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.length > 0
);

export const selectLatestNotification = createSelector(
  [selectNotifications],
  (notifications) => (notifications.length > 0 ? notifications[notifications.length - 1] : null)
);

// Check if any UI element is blocking (modal, sidebar, etc.)
export const selectIsUIBlocking = createSelector(
  [selectHasActiveModals, selectIsSidebarOpen, selectIsSearchOpen],
  (hasModals, sidebarOpen, searchOpen) => hasModals || sidebarOpen || searchOpen
);

export default uiSlice.reducer;
