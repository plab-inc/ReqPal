class PrivilegeError extends Error {
    private code: number;

    constructor(message: string, code: number) {
        super(message);
        this.name = "PrivilegeError";
        this.code = code;
    }
}

class DatabaseError extends Error {
    private code: number;

    constructor(message: string, code: number) {
        super(message);
        this.name = "DatabaseError";
        this.code = code;
    }
}

class ConversionError extends Error {
    private code: number;

    constructor(message: string, code: number) {
        super(message);
        this.name = "ConversionError";
        this.code = code;
    }
}

class AuthenticationError extends Error {
    private code: number;

    constructor(message: string, code: number) {
        super(message);
        this.name = "AuthenticationError";
        this.code = code;
    }
}

class UserAlreadyRegisteredError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserAlreadyRegisteredError";
    }
}


export {PrivilegeError, DatabaseError, ConversionError, AuthenticationError, UserAlreadyRegisteredError};