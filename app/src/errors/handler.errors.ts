import AlertService from "@/services/alert.service.ts";
import { PrivilegeError, DatabaseError, ConversionError } from "@/errors/custom.errors.ts";

const unhandledRejectionHandler = (event: PromiseRejectionEvent): void => {

    const error = event.reason;

    if (error instanceof PrivilegeError) {
        AlertService.addErrorAlert("Sie haben nicht die nötigen Rechte um diese Aktion auszuführen.");
        return;
    }

    if (error instanceof ConversionError) {
        AlertService.addErrorAlert("Beim konvertieren der Datei ist ein Fehler aufgetreten.");
        return;
    }

    if (error instanceof DatabaseError) {
        AlertService.addErrorAlert("Beim hochladen in die Datenbank ist ein Fehler aufgetreten.");
        return;
    }

    AlertService.addErrorAlert("Ein unerwarteter Fehler ist aufgetreten.");

};

const globalErrorHandler = (event: ErrorEvent): void => {
    AlertService.addErrorAlert("Ein unerwarteter Fehler ist aufgetreten.");
};

export { unhandledRejectionHandler, globalErrorHandler };