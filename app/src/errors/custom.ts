export class PrivilegeError extends Error {
    private code: number;

    constructor(message: string, code: number) {
        super(message);
        this.name = "PrivilegeError";
        this.code = code;
    }
}

export class DatabaseError extends Error {
    private code: number;

    constructor(message: string, code: number) {
        super(message);
        this.name = "DatabaseError";
        this.code = code;
    }
}

export class BpmnParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BpmnParsingError";
  }
}

export class BpmnPersistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BpmnPersistError";
  }
}

export class BpmnImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BpmnImportError";
  }
}

export class ConversionError extends Error {
    private code: number;

    constructor(message: string, code: number) {
        super(message);
        this.name = "ConversionError";
        this.code = code;
    }
}

export class AuthenticationError extends Error {
    private code: number;

    constructor(message: string, code: number) {
        super(message);
        this.name = "AuthenticationError";
        this.code = code;
    }
}

export class UserAlreadyRegisteredError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserAlreadyRegisteredError";
    }
}
