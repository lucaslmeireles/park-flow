export class CreateOrganizationResponse {
  id: string;
  message: string;

  constructor(id: string) {
    this.id = id;
    this.message = `Organization created successfully with ID: ${id}`;
  }
}
