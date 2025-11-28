import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";

export interface SubscriptionStatus {
  isLoading: boolean;
  isInTrial: boolean;
  trialDaysRemaining: number;
  hasActiveSubscription: boolean;
  isPaidSubscriber: boolean;
  trialExpired: boolean;
  subscriptionStatus: string;
  needsUpgrade: boolean;
}

export function useHomeownerSubscription(): SubscriptionStatus {
  const { user, isLoading: isAuthLoading } = useAuth();
  const typedUser = user as User | undefined;

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['/api/user'],
    enabled: !!typedUser && typedUser.role === 'homeowner',
  });

  const isLoading = isAuthLoading || isUserLoading;

  if (isLoading || !userData) {
    return {
      isLoading: true,
      isInTrial: false,
      trialDaysRemaining: 0,
      hasActiveSubscription: false,
      isPaidSubscriber: false,
      trialExpired: false,
      subscriptionStatus: 'unknown',
      needsUpgrade: false,
    };
  }

  const data = userData as any;
  const subscriptionStatus = data.subscriptionStatus || 'inactive';
  const trialEndsAt = data.trialEndsAt ? new Date(data.trialEndsAt) : null;
  const now = new Date();

  // Calculate trial status
  const isInTrial = subscriptionStatus === 'trialing' && !!trialEndsAt && trialEndsAt > now;
  const trialDaysRemaining = trialEndsAt 
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const trialExpired = trialEndsAt ? trialEndsAt <= now && subscriptionStatus !== 'active' : false;

  // Check if user has an active paid subscription
  const hasActiveSubscription = subscriptionStatus === 'active' || subscriptionStatus === 'grandfathered';
  
  // A user is a paid subscriber if they have an active subscription (not just trialing)
  const isPaidSubscriber = hasActiveSubscription && !!data.stripeSubscriptionId;

  // User needs upgrade if trial expired and no active subscription
  const needsUpgrade = (trialExpired || subscriptionStatus === 'inactive' || subscriptionStatus === 'cancelled') 
    && !hasActiveSubscription && !isInTrial;

  return {
    isLoading: false,
    isInTrial,
    trialDaysRemaining,
    hasActiveSubscription,
    isPaidSubscriber,
    trialExpired,
    subscriptionStatus,
    needsUpgrade,
  };
}
