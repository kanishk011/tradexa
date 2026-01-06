'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  showNotification,
  hideNotification,
  clearAllNotifications,
  showSuccess,
  showError,
  showWarning,
  showInfo,
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
  clearRecentSearches,
  openMobileMenu,
  closeMobileMenu,
  toggleMobileMenu,
  setThemeMode,
  toggleTheme,
  setGlobalLoading,
  setOperationLoading,
  selectNotifications,
  selectQuickView,
  selectSidebar,
  selectSearch,
  selectMobileMenuOpen,
  selectThemeMode,
  selectIsGlobalLoading,
  selectIsOperationLoading,
  selectLatestNotification,
  selectIsQuickViewOpen,
  selectQuickViewProductId,
  selectIsSidebarOpen,
  selectSidebarType,
  selectIsSearchOpen,
  selectSearchQuery,
  selectRecentSearches,
  NotificationSeverity,
} from '../slices/uiSlice';

// Notifications hook
export function useNotifications() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const latestNotification = useAppSelector(selectLatestNotification);

  const show = useCallback(
    (message: string, severity: NotificationSeverity = 'info', autoHideDuration?: number) => {
      dispatch(showNotification({ message, severity, autoHideDuration }));
    },
    [dispatch]
  );

  const success = useCallback(
    (message: string, autoHideDuration?: number) => {
      dispatch(showSuccess(message, autoHideDuration));
    },
    [dispatch]
  );

  const error = useCallback(
    (message: string, autoHideDuration?: number) => {
      dispatch(showError(message, autoHideDuration));
    },
    [dispatch]
  );

  const warning = useCallback(
    (message: string, autoHideDuration?: number) => {
      dispatch(showWarning(message, autoHideDuration));
    },
    [dispatch]
  );

  const info = useCallback(
    (message: string, autoHideDuration?: number) => {
      dispatch(showInfo(message, autoHideDuration));
    },
    [dispatch]
  );

  const hide = useCallback(
    (id: string) => {
      dispatch(hideNotification(id));
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    dispatch(clearAllNotifications());
  }, [dispatch]);

  return {
    notifications,
    latestNotification,
    show,
    success,
    error,
    warning,
    info,
    hide,
    clearAll,
  };
}

// Quick View Modal hook
export function useQuickView() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsQuickViewOpen);
  const productId = useAppSelector(selectQuickViewProductId);

  const open = useCallback(
    (productId: string) => {
      dispatch(openQuickView(productId));
    },
    [dispatch]
  );

  const close = useCallback(() => {
    dispatch(closeQuickView());
  }, [dispatch]);

  return {
    isOpen,
    productId,
    open,
    close,
  };
}

// Sidebar hook
export function useSidebar() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsSidebarOpen);
  const sidebarType = useAppSelector(selectSidebarType);

  const open = useCallback(
    (type: 'cart' | 'menu' | 'filters') => {
      dispatch(openSidebar(type));
    },
    [dispatch]
  );

  const close = useCallback(() => {
    dispatch(closeSidebar());
  }, [dispatch]);

  const toggle = useCallback(
    (type: 'cart' | 'menu' | 'filters') => {
      dispatch(toggleSidebar(type));
    },
    [dispatch]
  );

  return {
    isOpen,
    type: sidebarType,
    open,
    close,
    toggle,
    isCartOpen: isOpen && sidebarType === 'cart',
    isMenuOpen: isOpen && sidebarType === 'menu',
    isFiltersOpen: isOpen && sidebarType === 'filters',
  };
}

// Search hook
export function useSearchUI() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsSearchOpen);
  const query = useAppSelector(selectSearchQuery);
  const recentSearches = useAppSelector(selectRecentSearches);

  const open = useCallback(() => {
    dispatch(openSearch());
  }, [dispatch]);

  const close = useCallback(() => {
    dispatch(closeSearch());
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch(toggleSearch());
  }, [dispatch]);

  const setQuery = useCallback(
    (value: string) => {
      dispatch(setSearchQuery(value));
    },
    [dispatch]
  );

  const addToRecent = useCallback(
    (search: string) => {
      dispatch(addRecentSearch(search));
    },
    [dispatch]
  );

  const clearRecent = useCallback(() => {
    dispatch(clearRecentSearches());
  }, [dispatch]);

  return {
    isOpen,
    query,
    recentSearches,
    open,
    close,
    toggle,
    setQuery,
    addToRecent,
    clearRecent,
  };
}

// Mobile Menu hook
export function useMobileMenu() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectMobileMenuOpen);

  const open = useCallback(() => {
    dispatch(openMobileMenu());
  }, [dispatch]);

  const close = useCallback(() => {
    dispatch(closeMobileMenu());
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch(toggleMobileMenu());
  }, [dispatch]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

// Theme hook
export function useTheme() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectThemeMode);

  const setMode = useCallback(
    (mode: 'light' | 'dark' | 'system') => {
      dispatch(setThemeMode(mode));
    },
    [dispatch]
  );

  const toggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  return {
    mode,
    setMode,
    toggle,
    isDark: mode === 'dark',
    isLight: mode === 'light',
    isSystem: mode === 'system',
  };
}

// Loading states hook
export function useLoading(operationKey?: string) {
  const dispatch = useAppDispatch();
  const isGlobalLoading = useAppSelector(selectIsGlobalLoading);
  const isOperationLoading = useAppSelector(
    operationKey ? selectIsOperationLoading(operationKey) : () => false
  );

  const setGlobal = useCallback(
    (loading: boolean) => {
      dispatch(setGlobalLoading(loading));
    },
    [dispatch]
  );

  const setOperation = useCallback(
    (operation: string, loading: boolean) => {
      dispatch(setOperationLoading({ operation, loading }));
    },
    [dispatch]
  );

  const startOperation = useCallback(
    (operation: string) => {
      dispatch(setOperationLoading({ operation, loading: true }));
    },
    [dispatch]
  );

  const endOperation = useCallback(
    (operation: string) => {
      dispatch(setOperationLoading({ operation, loading: false }));
    },
    [dispatch]
  );

  return {
    isGlobalLoading,
    isOperationLoading,
    setGlobal,
    setOperation,
    startOperation,
    endOperation,
  };
}

// Combined UI hook for common operations
export function useReduxUI() {
  const notifications = useNotifications();
  const quickView = useQuickView();
  const sidebar = useSidebar();
  const search = useSearchUI();
  const mobileMenu = useMobileMenu();
  const theme = useTheme();
  const loading = useLoading();

  return {
    notifications,
    quickView,
    sidebar,
    search,
    mobileMenu,
    theme,
    loading,
  };
}

export default useReduxUI;
