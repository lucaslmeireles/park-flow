export class CreatePricingPeriodResponse {
  id: string;
  message: string;

  constructor(id: string) {
    this.id = id;
    this.message = `PricingPeriod created successfully with ID: ${id}`;
  }
}
