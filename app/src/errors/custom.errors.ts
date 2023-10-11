class PrivilegeError extends Error {
    private code: number;
    constructor(message:string , code: number) {
        super(message);
        this.name = "PrivilegeError";
        this.code = code;
    }
}

class DatabaseError extends Error {
    private code: number;
    constructor(message:string , code: number) {
        super(message);
        this.name = "DatabaseError";
        this.code = code;
    }
}

class ConversionError extends Error {
    private code: number;
    constructor(message:string , code: number) {
        super(message);
        this.name = "ConversionError";
        this.code = code;
    }
}
class AuthenticationError extends Error {
    private code: number;
    constructor(message:string , code: number) {
        super(message);
        this.name = "AuthenticationError";
        this.code = code;
    }
}


export { PrivilegeError, DatabaseError, ConversionError, AuthenticationError };