// Service Worker for Push Notifications
const CACHE_NAME = 'homebase-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');
  
  let notificationData = {
    title: 'Home Base',
    body: 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'default',
    data: {},
    actions: []
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.error('Error parsing push data:', error);
    }
  }

  const notificationTitle = notificationData.title;
  const notificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    data: notificationData.data,
    actions: notificationData.actions,
    requireInteraction: notificationData.requireInteraction || false,
    silent: false,
    vibrate: [100, 50, 100],
    timestamp: notificationData.timestamp || Date.now()
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// Notification click event - handle user interactions
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  const notificationData = event.notification.data || {};
  const action = event.action;

  // Handle different actions
  if (action === 'view' || action === 'reply' || action === 'schedule' || action === 'respond') {
    // Navigate to specific URL based on action and data
    let targetUrl = '/';
    
    if (notificationData.actionUrl) {
      targetUrl = notificationData.actionUrl;
    } else if (notificationData.type === 'appointment') {
      targetUrl = '/appointments';
    } else if (notificationData.type === 'maintenance') {
      targetUrl = '/maintenance';
    } else if (notificationData.type === 'message') {
      targetUrl = `/messages/${notificationData.conversationId || ''}`;
    } else if (notificationData.type === 'proposal') {
      targetUrl = '/contractor-dashboard#proposals';
    }

    event.waitUntil(
      clients.matchAll().then(clientList => {
        // Check if there's already an open window/tab
        for (const client of clientList) {
          if (client.url === self.registration.scope && 'focus' in client) {
            client.postMessage({
              type: 'notification-click',
              action: action,
              data: notificationData,
              targetUrl: targetUrl
            });
            return client.focus();
          }
        }
        
        // No existing window, open a new one
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
    );
  } else {
    // Default click behavior - open the app
    event.waitUntil(
      clients.matchAll().then(clientList => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background sync event:', event.tag);
  
  if (event.tag === 'background-sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  try {
    // Sync any pending notifications when back online
    const response = await fetch('/api/notifications/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    if (response.ok) {
      const notifications = await response.json();
      console.log('Synced notifications:', notifications.length);
    }
  } catch (error) {
    console.error('Failed to sync notifications:', error);
  }
}

// Handle message from main app
self.addEventListener('message', event => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});