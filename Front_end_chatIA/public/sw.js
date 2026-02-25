// Service Worker - Push Notifications
// Creativa App

self.addEventListener('push', (event) => {
  const defaults = {
    title: 'Creativa',
    body: 'Tienes una nueva notificación.',
    icon: '/vite.svg',
    data: { url: '/' },
  };

  let payload = defaults;

  if (event.data) {
    try {
      payload = { ...defaults, ...event.data.json() };
    } catch {
      payload = { ...defaults, body: event.data.text() };
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon,
    badge: payload.icon,
    data: payload.data || {},
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ('focus' in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
