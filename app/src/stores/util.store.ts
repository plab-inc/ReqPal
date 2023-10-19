import {defineStore} from 'pinia';

export type AlertType = 'success' | 'error' | 'info' | 'warning';
export type DialogType = 'lessonFinished' | 'mcExplanation' | 'tfExplanation' | 'sliderExplanation' | 'notesExplanation' | 'productExplanation';

interface IAlert {
    id: string;
    message: string;
    type: AlertType;
}

interface IDialog {
    id: string;
    onConfirm: () => void;
    title: string,
    message: string,
    confirmLabel: string,
    cancelLabel: string,
}

export const useUtilStore = defineStore({
    id: 'util',
    state: () => ({
        alerts: [] as IAlert[],
        showLoadingBar: false,
        dialogs: [] as IDialog[],
    }),
    actions: {
        addAlert(message: string, type: AlertType) {
            const id = Date.now().toString();
            this.alerts.push({id, message, type});
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
        },
        openDialog(onConfirm: () => void, title: string, message: string,
                   confirmLabel: string, cancelLabel: string) {
            const id = Date.now().toString();
            this.dialogs.push({id, onConfirm, title, message, confirmLabel, cancelLabel});
        },
        closeDialog(id: string) {
            this.dialogs = this.dialogs.filter(dialog => dialog.id !== id);
        }
    }
});
