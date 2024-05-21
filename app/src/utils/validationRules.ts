import {useProfileStore} from "@/stores/profile.ts";
import {useLessonStore} from "@/stores/lesson.ts";
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import {useCatalogStore} from "@/stores/catalog.ts";

export const requiredRule = (value: any): boolean | string => !!value || "Benötigt";
export const requiredStringRule = (value: string | null | any): boolean | string => {
    if (typeof value === 'string') return (value && !!value.trim()) || "Benötigt";
    return "Benötigt";
}

export const requiredAtLeast6CharsRule = (value: string | null | any): boolean | string => {
    if (typeof value === 'string') {
        if (value.trim().length < 6) {
            return "Es werden mindestens 6 Zeichen benötigt."
        }
    }
    return true;
}

export const minMaxWords = (value: string | null | any): boolean | string => {

    if (typeof value === 'string') {
        const words = value.split(/\s+/).length;
        const characters = value.length;
        if (words >= 15 && words <= 100 && characters <= 500) {
            return true;
        } else {
            return "Mindestens 15 und maximal 100 Wörter";
        }
    }
    return "Mindestens 15 und maximal 50 Wörter";
}

export const requiredBooleanRule = (value: boolean | null): boolean | string => {
    if (value === true || value === false) {
        return true;
    }
    return "Bitte wähle entweder 'true' oder 'false'";
};

export const requiredNumberRule = (value: null | number | string): boolean | string => {
    if (typeof value === 'number') {
        return !Number.isNaN(value) ? true : 'Benötigt';
    } else if (typeof value === 'string') {
        const numericValue = parseFloat(value);
        return !isNaN(numericValue) ? true : 'Benötigt';
    } else {
        return 'Benötigt';
    }
};

export const matchingPasswordsRule = (value: string, password: string): boolean | string => {
    return value === password || "Die Passwörter stimmen nicht überein";
};

export const requiredEmailRule = (value: string): boolean | string => {
    const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Ungültige E-Mail-Adresse";
};

export const requiredUsernameRule = (value: string): boolean | string => {
    //no email in username
    const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !pattern.test(value) || "Ihr Nutzername darf keine E-mail Adresse beinhalten";
};

export const requiredHyperlinkRule = (value: string): boolean | string => {
    if (value === "") return true;
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    return pattern.test(value) || "Ungültiger Hyperlink";
};

export const containsAtLeastOneElementRule = (value: any): boolean | string => {
    // Überprüfe, ob mindestens ein Wert in value nicht null oder undefined ist
    return Array.isArray(value) && value.some(element => element !== null && element !== undefined);
};

export const requiredUniqueUsernameRule = async (value: any): Promise<boolean | string> => {
    const profileStore = useProfileStore();
    const exists = await profileStore.checkIfUsernameExists(value);
    if (exists) return "Der Nutzername existiert bereits.";
    return true;
};

export const requiredUniqueUsernameExcludingUUIDRule = async (value: any): Promise<boolean | string> => {
    const profileStore = useProfileStore();
    const exists = await profileStore.checkIfUsernameExistsExcludingUUID(value);
    if (exists) return "Der Nutzername existiert bereits.";
    return true;
};

export const requiredUniqueLessonTitleRule = async (): Promise<boolean | string> => {
    const lessonStore = useLessonStore();
    const lessonFormStore = useLessonFormStore();
    const exists = await lessonStore.checkIfLessonTitleExists(lessonFormStore.lessonTitle, lessonFormStore.uuid);
    if (exists) return "Der Titel existiert bereits.";
    return true;
};

export const requiredUniqueCatalogNameRule = async (value: File[]): Promise<boolean | string> => {
    const catalogStore = useCatalogStore();
    for (const file of value) {
        const name = file.name;
        const catalogName = name.substring(0, name.lastIndexOf('.')) || name;
        const exists = await catalogStore.checkIfCatalogNameExists(catalogName);
        if (exists) return "Der Name existiert bereits.";
    }

    return true;
};