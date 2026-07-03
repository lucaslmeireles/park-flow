export class RegisterUserResponse {
  id: string;
  message: string;

  constructor(id: string) {
    this.id = id;
    this.message = `User registered successfully with ID: ${id}`;
  }
}
