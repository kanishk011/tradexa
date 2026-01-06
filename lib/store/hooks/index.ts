// Base Redux hooks
export { useAppDispatch, useAppSelector, useAppStore, useShallowSelector } from '../baseHooks';

// Auth hooks
export {
  useReduxAuth,
  useReduxLogin,
  useReduxRegister,
  usePermissions,
  useRequireAuth,
} from './useReduxAuth';

// Cart hooks
export {
  useReduxCart,
  useReduxAddToCart,
  useProductInCart,
  useCartItem,
} from './useReduxCart';

// Wishlist hooks
export {
  useReduxWishlist,
  useReduxToggleWishlist,
  useProductInWishlist,
  useWishlistItem,
} from './useReduxWishlist';

// UI hooks
export {
  useNotifications,
  useQuickView,
  useSidebar,
  useSearchUI,
  useMobileMenu,
  useTheme,
  useLoading,
  useReduxUI,
} from './useReduxUI';

// Products hooks
export {
  useFeaturedProducts,
  useCategories,
  useProducts,
  useProduct,
  useProductById,
  useProductSearch,
  useNewArrivals,
  useCategoryProducts,
  useHomePageProducts,
} from './useReduxProducts';
