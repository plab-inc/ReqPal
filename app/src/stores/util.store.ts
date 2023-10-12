import { defineStore } from 'pinia';

export type AlertType = 'success' | 'error' | 'info' | 'warning';
interface IAlert {
  id: string;
  message: string;
  type: AlertType;
}

export const useUtilStore = defineStore({
  id: 'util',
  state: () => ({
    alerts: [] as IAlert[],
    showLoadingBar: false,
  }),
  actions: {
    addAlert(message: string, type: AlertType) {
      const id = Date.now().toString();
      this.alerts.push({ id, message, type });
    },
    removeAlert(id: string) {
      this.alerts = this.alerts.filter(alert => alert.id !== id);
    },
    toggleLoadingBar() {
      this.showLoadingBar = !this.showLoadingBar;
    },
    startLoadingBar() {
      this.showLoadingBar = true;
    },
    stopLoadingBar() {
      this.showLoadingBar = false;
    }
  }
});