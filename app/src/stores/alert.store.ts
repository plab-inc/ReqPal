import { defineStore } from 'pinia';

export type AlertType = 'success' | 'error' | 'info' | 'warning';
interface AlertStore {
  id: string;
  message: string;
  type: AlertType;
}

export const useAlertStore = defineStore({
  id: 'alert',
  state: () => ({
    alerts: [] as AlertStore[],
  }),
  actions: {
    addAlert(message: string, type: AlertType) {
      const id = Date.now().toString();
      this.alerts.push({ id, message, type });
    },
    removeAlert(id: string) {
      this.alerts = this.alerts.filter(alert => alert.id !== id);
    }
  }
});