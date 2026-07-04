export class RegisterUserResponse {
  id: string;
  message: string;

  constructor(id: string) {
    this.id = id;
    this.message = `User registered successfully with ID: ${id}`;
  }
}

export class UpdateNameUserResponse {
  message: string;

  constructor() {
    this.message = `User name updated successfully`;
  }
}

export class UpdatePasswordUserResponse {
  message: string;

  constructor() {
    this.message = `User password updated successfully`;
  }
}
