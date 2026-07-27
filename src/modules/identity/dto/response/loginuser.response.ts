export class LoginUserResponse {
  accessToken: string;
  expiresIn: string;

  constructor(accessToken: string, expiresIn = '1h') {
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
  }
}
