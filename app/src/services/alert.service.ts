import { useAlertStore } from "@/stores/alert.store";

const alertStore= useAlertStore();

export function addSuccessAlert(message: string) {
  alertStore.addAlert(message, 'success');
}

export function addErrorAlert(message: string) {
  alertStore.addAlert(message, 'error');
}

export function addInfoAlert(message: string) {
  alertStore.addAlert(message, 'info');
}

export function addWarningAlert(message: string) {
  alertStore.addAlert(message, 'warning');
}