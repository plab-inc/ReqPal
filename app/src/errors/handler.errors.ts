import AlertService from "@/services/util/alert.service.ts";
import {
    AuthenticationError,
    ConversionError,
    DatabaseError,
    PrivilegeError,
    UserAlreadyRegisteredError
} from "@/errors/custom.errors.ts";

const unhandledRejectionHandler = (event: PromiseRejectionEvent): void => {

    const error = event.reason;

    if (error instanceof PrivilegeError) {
        AlertService.addErrorAlert("Sie haben nicht die nötigen Rechte um diese Aktion auszuführen.");
        return;
    }

    if (error instanceof ConversionError) {
        AlertService.addErrorAlert("Fehler im Format der CSV Datei: " + error.message);
        return;
    }

    if (error instanceof DatabaseError) {
        AlertService.addErrorAlert("Es ist ein Fehler mit der Datenbank aufgetreten.");
        return;
    }

    if (error instanceof AuthenticationError) {
        console.log("Handling Authentication error")
        if (error.message === 'Email not confirmed') {
            AlertService.addErrorAlert("Ihre Email wurde noch nicht bestätigt.");
            return;
        }
        AlertService.addErrorAlert("Fehler bei der Anmeldung/Registrierung/Zurücksetzen des Passworts.");
        return;
    }

    if (error instanceof UserAlreadyRegisteredError) {
        AlertService.addErrorAlert(error.message);
        return;
    }

    AlertService.addErrorAlert("Ein unerwarteter Fehler ist aufgetreten.");

};

const globalErrorHandler = (event: ErrorEvent): void => {
    console.log("Handling unexpected error")
    console.log(event);
    AlertService.addErrorAlert("Ein unerwarteter Fehler ist aufgetreten.");
};

export {unhandledRejectionHandler, globalErrorHandler};