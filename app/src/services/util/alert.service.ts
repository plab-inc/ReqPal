import {DialogType, useUtilStore} from "@/stores/util.store.ts";
import {
    dividerTeacherExplanation,
    LessonFinished,
    LessonReset,
    mcExplanation,
    notesExplanation,
    notesTeacherExplanation,
    productExplanation,
    productQualificationExplanation,
    productQualificationTeacherExplanation,
    sliderExplanation,
    textfieldExplanation,
    tfExplanation
} from "@/utils/dialog.defaults.ts";

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

    openDialog(title: string, message: string, confirmButton: string, cancelButton?: string, onConfirm?: () => void) {
        this.store.openDialog({
            title: title,
            message: message,
            confirmLabel: confirmButton,
            cancelLabel: cancelButton
        }, onConfirm);
    }

    addHelpDialog(type: DialogType, onConfirm?: () => void) {
        switch (type) {
            case "lessonFinished":
                this.store.openDialog(LessonFinished, onConfirm);
                break;
            case "resetLesson":
                this.store.openDialog(LessonReset, onConfirm);
                break;
            case "mcExplanation":
                this.store.openDialog(mcExplanation);
                break;
            case "tfExplanation":
                this.store.openDialog(tfExplanation);
                break;
            case "sliderExplanation":
                this.store.openDialog(sliderExplanation)
                break;
            case "productQualificationExplanation":
                this.store.openDialog(productQualificationExplanation)
                break;
            case "notesExplanation":
                this.store.openDialog(notesExplanation);
                break;
            case "productExplanation":
                this.store.openDialog(productExplanation);
                break;
            case "productQualificationTeacherExplanation":
                this.store.openDialog(productQualificationTeacherExplanation);
                break;
            case "textfieldExplanation":
                this.store.openDialog(textfieldExplanation);
                break;
            case "notesTeacherExplanation":
                this.store.openDialog(notesTeacherExplanation);
                break;
            case "dividerTeacherExplanation":
                this.store.openDialog(dividerTeacherExplanation);
                break;
            default:
                break;
        }
    }
}

const AlertService = new AlertServiceClass();

export default AlertService;
