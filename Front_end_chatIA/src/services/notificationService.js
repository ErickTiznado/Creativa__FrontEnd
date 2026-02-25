import { api } from './api.js';

export const notificationService = {
  async getVapidPublicKey() {
    const response = await api.get('/notifications/vapid-public-key');
    return response.data.data.vapidPublicKey;
  },

  async subscribe(subscription) {
    const response = await api.post('/notifications/subscribe', { subscription });
    return response.data;
  },

  async unsubscribe(endpoint) {
    const response = await api.delete('/notifications/unsubscribe', {
      data: { endpoint },
    });
    return response.data;
  },

  async sendTest() {
    const response = await api.post('/notifications/test');
    return response.data;
  },
};
