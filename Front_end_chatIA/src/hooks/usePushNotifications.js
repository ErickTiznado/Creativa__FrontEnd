import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { notificationService } from '../services/notificationService';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

async function autoSubscribe(reg) {
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return false;

  const vapidPublicKey = await notificationService.getVapidPublicKey();
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  await notificationService.subscribe(subscription.toJSON());
  return true;
}

export function usePushNotifications() {
  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window;

  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!isSupported) return;

    navigator.serviceWorker
      .register('/sw.js')
      .then(async (reg) => {
        const existing = await reg.pushManager.getSubscription();
        if (existing) {
          setIsSubscribed(true);
          return;
        }
        // Suscribir automáticamente
        try {
          const ok = await autoSubscribe(reg);
          setIsSubscribed(ok);
        } catch (err) {
          console.error('[PushNotifications] Auto-subscribe falló:', err);
          toast.error(`Notificaciones: ${err.message}`);
        }
      })
      .catch((err) => {
        console.error('[PushNotifications] SW registration falló:', err);
      });
  }, [isSupported]);

  return { isSupported, isSubscribed };
}
