export const requiredRule = (value: any): boolean | string => !!value || "Benötigt";
export const requiredStringRule = (value: string | null | any): boolean | string => {
    if(typeof value === 'string') return (value && !!value.trim()) || "Benötigt";
    return "Benötigt";
}

export const requiredAtLeast6CharsRule = (value: string | null | any): boolean | string => {
    if(typeof value === 'string') {
        if(value.trim().length < 6) {
            return "Es werden mindestens 6 Zeichen benötigt."
        }
    }
    return true;
}

export const minMaxWords = (value: string | null | any): boolean | string => {

    if(typeof value === 'string') {
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


export const matchingPasswordsRule = (value: string, password: string): boolean | string =>
    value === password || "Die Passwörter stimmen nicht überein";

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
