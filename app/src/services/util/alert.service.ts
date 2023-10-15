import { useUtilStore } from "@/stores/util.store.ts";

class AlertServiceClass {
  private get store() {
    return useUtilStore();
  }

  addSuccessAlert(message: string) {
    this.store.addAlert(message, 'success');
  }

  addErrorAlert(message: string) {
    this.store.addAlert(message, 'error');
  }

  addInfoAlert(message: string) {
    this.store.addAlert(message, 'info');
  }

  addWarningAlert(message: string) {
    this.store.addAlert(message, 'warning');
  }
}

const AlertService = new AlertServiceClass();

export default AlertService;