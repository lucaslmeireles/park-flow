export class PricingRuleException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PricingRuleException';
  }
}

export class PricingRuleNotFound extends PricingRuleException {
  constructor(message: string) {
    super(message);
  }
}

export class PricingRuleNotActive extends PricingRuleException {
  constructor(message: string) {
    super(message);
  }
}
