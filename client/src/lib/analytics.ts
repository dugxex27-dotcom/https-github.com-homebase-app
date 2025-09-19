// Analytics tracking utility for contractor interactions
import { apiRequest } from "@/lib/queryClient";

// Generate a simple session ID for tracking unique sessions
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('homebase_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('homebase_session_id', sessionId);
  }
  return sessionId;
};

// Track contractor-related clicks for analytics
export const trackContractorClick = async (contractorId: string, clickType: 'profile_view' | 'website' | 'facebook' | 'instagram' | 'linkedin' | 'google_business') => {
  try {
    const sessionId = getSessionId();
    const userAgent = navigator.userAgent;
    const referrerUrl = document.referrer;

    await apiRequest('/api/contractor/analytics/track', 'POST', {
      contractorId,
      clickType,
      sessionId,
      userAgent,
      referrerUrl,
    });
  } catch (error) {
    // Silently fail - don't disrupt user experience for analytics failures
    console.debug('Analytics tracking failed:', error);
  }
};

// Track profile view when contractor profile is displayed
export const trackProfileView = (contractorId: string) => {
  trackContractorClick(contractorId, 'profile_view');
};

// Track external link clicks
export const trackExternalLinkClick = (contractorId: string, linkType: 'website' | 'facebook' | 'instagram' | 'linkedin' | 'google_business', url: string) => {
  trackContractorClick(contractorId, linkType);
  // Open link in new tab after tracking
  window.open(url, '_blank', 'noopener,noreferrer');
};