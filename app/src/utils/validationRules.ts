export const requiredRule = (value: string): boolean | string => !!value || "Benötigt.";
export const noEmptyStringRule = (value: string | null): boolean | string =>
    (value && !!value.trim()) || "Benötigt.";
export const booleanValueRule = (value: boolean | null): boolean | string => {
    if (value === true || value === false) {
        return true;
    }
    return "Bitte wähle entweder 'true' oder 'false'.";
};

export const requiredNumberRule = (value: null | number | string): boolean | string => {
    if (typeof value === 'number') {
        return !Number.isNaN(value) ? true : 'Benötigt.';
    } else if (typeof value === 'string') {
        const numericValue = parseFloat(value);
        return !isNaN(numericValue) ? true : 'Benötigt.';
    } else {
        return 'Benötigt';
    }
};


export const matchingPasswordsRule = (value: string, password: string): boolean | string =>
    value === password || "Die Passwörter stimmen nicht überein";

export const emailRule = (value: string): boolean | string => {
    const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Ungültige E-Mail.";
};

export const hyperlinkRule = (value: string): boolean | string => {
    if (value === "") return true;
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    return pattern.test(value) || "Ungültiger Hyperlink.";
};