import {defineStore} from 'pinia';
import {DialogText} from "@/utils/dialogs.ts";
import {XpActivityLogDTO} from "@/types/xpActivityLog.ts";

export type AlertType = 'success' | 'error' | 'info' | 'warning';
export type DialogType =
    'lessonFinished'
    | 'resetLesson'
    | 'mcExplanation'
    | 'tfExplanation'
    | 'sliderExplanation'
    | 'notesExplanation'
    | 'notesTeacherExplanation'
    | 'productExplanation'
    | 'productQualificationExplanation'
    | 'productQualificationTeacherExplanation'
    | 'textfieldExplanation'
    | 'dividerTeacherExplanation';

export interface IAlert {
    id: string;
    message: string;
    type: AlertType;
}

interface IDialog {
    id: string;
    onConfirm: () => void;
    onlyConfirmButton: boolean;
    content: DialogText;
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
        startLoadingBar() {
            this.showLoadingBar = true;
        },
        stopLoadingBar() {
            this.showLoadingBar = false;
        },
        openDialog(content: DialogText, onConfirm?: () => void) {
            const id = Date.now().toString();
            const onlyConfirm: boolean = !content.cancelLabel;
            const confirmation: () => void = onConfirm ? onConfirm : () => {
            };

            this.dialogs.push({id: id, onConfirm: confirmation, content: content, onlyConfirmButton: onlyConfirm});
        },
        closeDialog(id: string) {
            this.dialogs = this.dialogs.filter(dialog => dialog.id !== id);
        },
    }
});
