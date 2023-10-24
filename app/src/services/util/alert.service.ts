import {DialogType, useUtilStore} from "@/stores/util.store.ts";

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

    openDialog(onConfirm: () => void, title: string, message: string, confirmButton: string, cancelButton: string) {
        this.store.openDialog(onConfirm, title, message, confirmButton, cancelButton);
    }

    addHelpDialog(type: DialogType, onConfirm: () => void) {
        switch (type) {
            case "lessonFinished":
                this.addLessonFinishDialog(onConfirm);
                break;
            case "resetLesson":
                this.addResetLessonDialog(onConfirm);
                break;
            case "mcExplanation":
                this.addMCExplanationDialog();
                break;
            case "tfExplanation":
                this.addTFExplanationDialog();
                break;
            case "sliderExplanation":
                this.addSliderExplanationDialog()
                break;
            case "notesExplanation":
                this.addNotesExplanationDialog();
                break;
            case "productExplanation":
                this.addProductExplanationDialog();
                break;
            default:
                break;
        }
    }

    private addLessonFinishDialog(onConfirm: () => void) {
        this.store.openDialog(onConfirm,
            "Lektion beenden",
            "Möchten Sie wirklich die Lektion beenden und Ihre Lösungen einreichen? Die Lösungen können dann nicht mehr verändert werden.",
            "Lektion beenden", "Zurück zur Lektion");
    }

    private addResetLessonDialog(onConfirm: () => void) {
        this.store.openDialog(onConfirm,
            "Lektion zurücksetzen",
            "Möchten Sie wirklich die Lektion zurücksetzen und Ihre eingereichten Antworten löschen? " +
            "Die Lösungen können dann nicht mehr eingesehen werden. Ihre gesammelten Punkte behalten Sie trotzdem.",
            "Lektion zurücksetzen", "Zurück zur Lektion");
    }

    private addMCExplanationDialog() {
        const mcExplanation =
            "In einer Multiple-Choice-Aufgabe ist das Ziel, alle Aussagen auszuwählen, die auf die zuvor gestellte Frage zutreffen. " +
            "Sie haben die Möglichkeit, mehrere oder auch keine Aussagen auszuwählen. " +
            "Bitte lesen Sie die Frage sorgfältig durch und überlegen Sie, welche Aussagen wahr und welche falsch sind. " +
            "Sobald Sie eine Aussage auswählen, gilt sie als zutreffend."
        this.store.openDialog(() => {
            },
            "Multiple Choice Aufgabe: Erklärung",
            mcExplanation,
            "Verstanden!", "Zurück zur Lektion");
    }

    private addTFExplanationDialog() {
        const trueOrFalseExplanation =
            "In einer True or False Aufgabe ist das Ziel, zu entscheiden, ob eine Aussage wahr (True) oder falsch (False) ist. " +
            "Sie haben zwei Optionen zur Auswahl, und Ihre Aufgabe besteht darin, diejenige auszuwählen, die am besten zur Aussage passt. " +
            "Beachten Sie, dass dementsprechend nur eine Option ausgewählt werden kann. " +
            "Eine 'True' Auswahl bedeutet, dass die Aussage korrekt ist, während 'False' bedeutet, dass die Aussage nicht korrekt ist. " +
            "Bitte lesen Sie die Aussage sorgfältig durch und entscheiden Sie, ob sie wahr oder falsch ist."

        this.store.openDialog(() => {
            },
            "True or False Aufgabe: Erklärung",
            trueOrFalseExplanation,
            "Verstanden!", "Zurück zur Lektion");
    }

    private addSliderExplanationDialog() {
        const sliderExplanation: string =
            "In einer True or False Aufgabe ist das Ziel, zu entscheiden, ob eine Aussage wahr (True) oder falsch (False) ist. " +
            "Sie haben zwei Optionen zur Auswahl, und Ihre Aufgabe besteht darin, diejenige auszuwählen, die am besten zur Aussage passt. " +
            "Beachten Sie, dass dementsprechend nur eine Option ausgewählt werden kann. " +
            "Eine 'True' Auswahl bedeutet, dass die Aussage korrekt ist, während 'False' bedeutet, dass die Aussage nicht korrekt ist. " +
            "Bitte lesen Sie die Aussage sorgfältig durch und entscheiden Sie, ob sie wahr oder falsch ist."

        this.store.openDialog(() => {
            },
            "Slider Aufgabe: Erklärung",
            sliderExplanation,
            "Verstanden!", "Zurück zur Lektion");
    }

    private addNotesExplanationDialog() {
        const notesExplanation = "Nutzen Sie die bereitgestellten Textfelder, um sich Notizen zu Produkten, Anforderungen oder anderen Themen zu machen. " +
            "Das Textfeld besitzt einen Titel, dass Ihnen helfen kann, Ihre Gedanken direkt zu einer bestimmten Kategorie zuzuordnen. " +
            "In dem Feld 'Allgemein' können Sie frei alles notieren, was Ihnen wichtig ist oder auffällt."

        this.store.openDialog(() => {
            },
            "Notizen: Erklärung",
            notesExplanation,
            "Verstanden!", "Zurück zur Lektion");
    }

    private addProductExplanationDialog() {
        const productExplanation = "In diesem Bereich finden Sie Produkte, die für den weiteren Verlauf dieser Lektion oder für konkrete Aufgaben relevant sein können. " +
            "Betrachten Sie sich die Produkte und klicken Sie bei Bedarf von weiteren Informationen auf das Produkt. " +
            "Sie werden dann zu einer hilfreichen Website oder der offiziellen Website des Produkts weitergeleitet."

        this.store.openDialog(() => {
            },
            "Produkte: Erklärung",
            productExplanation,
            "Verstanden!", "Zurück zur Lektion");
    }
}

const AlertService = new AlertServiceClass();

export default AlertService;
