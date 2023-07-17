export const requiredRule = (value: string): boolean | string => !!value || "Benötigt.";

export const matchingPasswordsRule = (value: string, password: string): boolean | string =>
value === password || "Die Passwörter stimmen nicht überein";

export const emailRule = (value: string): boolean | string => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(value) || "Ungültige E-Mail.";
};