import AlertService from "@/services/alert.service.ts";
import {PrivilegeError, DatabaseError, ConversionError, AuthenticationError} from "@/errors/custom.errors.ts";
import {AuthApiError} from "@supabase/supabase-js";

const unhandledRejectionHandler = (event: PromiseRejectionEvent): void => {

    const error = event.reason;

    if (error instanceof PrivilegeError) {
        AlertService.addErrorAlert("Sie haben nicht die nötigen Rechte um diese Aktion auszuführen.");
        return;
    }

    if (error instanceof ConversionError) {
        AlertService.addErrorAlert("Fehler im Format der CSV Datei.");
        return;
    }

    if (error instanceof DatabaseError) {
        AlertService.addErrorAlert("Beim hochladen in die Datenbank ist ein Fehler aufgetreten.");
        return;
    }

    if (error instanceof AuthenticationError) {
        AlertService.addErrorAlert("Feher bei der Anmeldung/Registrierung/Zurücksetzen des Passworts.");
        return;
    }

    AlertService.addErrorAlert("Ein unerwarteter Fehler ist aufgetreten.");

};

const globalErrorHandler = (event: ErrorEvent): void => {
    AlertService.addErrorAlert("Ein unerwarteter Fehler ist aufgetreten.");
};

export { unhandledRejectionHandler, globalErrorHandler };