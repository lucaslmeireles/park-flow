export class UserException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserException';
  }
}

export class UserEmailAlreadyExistsException extends UserException {
  constructor(email: string) {
    super(`User with email "${email}" already exists`);
    this.name = 'UserEmailAlreadyExistsException';
  }
}

export class UserNotFound extends UserException {
  constructor(id: string) {
    super(`User with id "${id}" not found`);
    this.name = 'UserNotFound';
  }
}

export class UserInvalidPasswordException extends UserException {
  constructor() {
    super(`Invalid password`);
    this.name = 'UserInvalidPasswordException';
  }
}
