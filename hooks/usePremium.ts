import {
  selectExpirationDate,
  selectIsPremium,
  selectRevenueCatLoading,
} from '@/redux/features/revenuecat/revenuecatSlice';
import { useAppSelector } from '@/redux/hooks';

/**
 * Hook to check the user's premium subscription status.
 *
 * Usage:
 * ```tsx
 * const { isPremium, isLoading, expirationDate } = usePremium();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (!isPremium) return <UpgradePrompt />;
 * return <PremiumContent />;
 * ```
 */
export function usePremium() {
  const isPremium = useAppSelector(selectIsPremium);
  const isLoading = useAppSelector(selectRevenueCatLoading);
  const expirationDate = useAppSelector(selectExpirationDate);

  return {
    /** True if user has an active premium subscription */
    isPremium,
    /** True while the subscription status is being loaded */
    isLoading,
    /**
     * When the premium subscription expires (ISO string).
     * Null means: either not subscribed, or lifetime (never expires).
     */
    expirationDate,
  };
}
