import { smsService } from './sms-service';
import { emailService } from './email-service';
import { storage, isDemoId, isDemoEmail } from './storage';

export async function sendWelcomeNotifications(
  userId: string,
  userName: string,
  userRole: string
): Promise<{ sms: boolean; email: boolean }> {
  const results = { sms: false, email: false };
  
  if (isDemoId(userId)) {
    console.log('[NOTIFICATIONS] Skipping welcome for demo user');
    return results;
  }

  try {
    const [smsResult, emailResult] = await Promise.allSettled([
      smsService.sendWelcomeSMS(userId, userName),
      emailService.sendWelcomeEmail(userId, userName, userRole)
    ]);
    
    results.sms = smsResult.status === 'fulfilled' && smsResult.value;
    results.email = emailResult.status === 'fulfilled' && emailResult.value;
    
    console.log(`[NOTIFICATIONS] Welcome sent - SMS: ${results.sms}, Email: ${results.email}`);
  } catch (error) {
    console.error('[NOTIFICATIONS] Error sending welcome notifications:', error);
  }
  
  return results;
}

export async function sendTrialExpiringNotifications(
  userId: string,
  userName: string,
  daysRemaining: number
): Promise<{ sms: boolean; email: boolean }> {
  const results = { sms: false, email: false };
  
  if (isDemoId(userId)) {
    console.log('[NOTIFICATIONS] Skipping trial reminder for demo user');
    return results;
  }

  try {
    const [smsResult, emailResult] = await Promise.allSettled([
      smsService.sendTrialExpiringSMS(userId, daysRemaining),
      emailService.sendTrialExpiringEmail(userId, userName, daysRemaining)
    ]);
    
    results.sms = smsResult.status === 'fulfilled' && smsResult.value;
    results.email = emailResult.status === 'fulfilled' && emailResult.value;
    
    console.log(`[NOTIFICATIONS] Trial expiring (${daysRemaining}d) sent - SMS: ${results.sms}, Email: ${results.email}`);
  } catch (error) {
    console.error('[NOTIFICATIONS] Error sending trial expiring notifications:', error);
  }
  
  return results;
}

export const notificationOrchestrator = {
  sendWelcomeNotifications,
  sendTrialExpiringNotifications,
};
