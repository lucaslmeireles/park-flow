export class CreatePricingRuleResponse {
  id: string;
  message: string;

  constructor(id: string) {
    this.id = id;
    this.message = `PricingRule created successfully with ID: ${id}`;
  }
}
