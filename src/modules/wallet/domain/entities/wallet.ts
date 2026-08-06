import { Entity } from 'src/shared/domain/entity';

interface WalletProps {
  userId: string;
  active: boolean;
  balance?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export class Wallet extends Entity<WalletProps> {
  private userId: string;
  private active: boolean;
  private balance?: number;
  private constructor(id: string, props: WalletProps) {
    super(id, props.createdAt, props.updatedAt);
    this.userId = props.userId;
    this.active = props.active;
    this.balance = props.balance;
  }

  static create(id: string, props: WalletProps): Wallet {
    return new Wallet(id, {
      userId: props.userId,
      active: props.active,
      balance: props.balance ?? 0,
    });
  }

  static reconstruct(id: string, props: WalletProps): Wallet {
    return new Wallet(id, props);
  }

  equals(object?: Entity<WalletProps>): boolean {
    if (!object) return false;
    return object.getId() === this.getId();
  }

  getProps(): WalletProps {
    return {
      userId: this.userId,
      active: this.active,
      balance: this.balance,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }
}
