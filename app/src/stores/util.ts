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

interface IAlert {
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
        gamificationAlerts: [] as IAlert[],
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
        addGamificationAlert(activity: XpActivityLogDTO) {
            const xp: number | null = activity.received_xp;
            const action: string | null = activity.action;
            let alertText: string = "";
            let actionType: string = "";
            let actionTitle: string = "";

            if (action) {
                const actionParts = action.split(':');
                if (actionParts.length > 1) {
                    actionType = action.split(':')[0].trim();
                    actionTitle = action.split(':')[1].trim();
                } else {
                    actionType = action;
                }
            }

            switch (actionType) {
                case('Objective'):
                    alertText = xp + " XP für Lernziel " + actionTitle + " erhalten!"
                    break;
                case('Achievement'):
                    alertText = xp + " XP für Achievement " + actionTitle + " erhalten!";
                    break;
                case('ReqPal Achievement'):
                    alertText = xp + " XP für ReqPal Achievement " + actionTitle + " erhalten!";
                    break;
                case('All lesson objectives'):
                    alertText = xp + " XP für alle Lernziele dieser Lektion erhalten!";
                    break;
                default:
                    alertText = xp + " XP erhalten!"
            }

            const id: string = Date.now().toString();
            this.gamificationAlerts.push({id: id, message: alertText, type: "success"});
        }
    }
});
