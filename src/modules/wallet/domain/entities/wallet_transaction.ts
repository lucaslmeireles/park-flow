import { TransactionType } from 'src/generated/prisma/enums';
import { Entity } from 'src/shared/domain/entity';

interface WalletTransactionProps {
  walletId: string;
  paymentId: string;
  type: TransactionType;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class WalletTransaction extends Entity<WalletTransactionProps> {
  private walletId: string;
  private paymentId: string;
  private type: TransactionType;
  private amount: number;
  constructor(id: string, props: WalletTransactionProps) {
    super(id, props.createdAt, props.updatedAt);
    this.walletId = props.walletId;
    this.paymentId = props.paymentId;
    this.type = props.type;
    this.amount = props.amount;
  }

  static create(id: string, props: WalletTransactionProps): WalletTransaction {
    return new WalletTransaction(id, {
      walletId: props.walletId,
      paymentId: props.paymentId,
      type: props.type,
      amount: props.amount,
      createdAt: props.createdAt,
    });
  }

  static reconstruct(
    id: string,
    props: WalletTransactionProps,
  ): WalletTransaction {
    return new WalletTransaction(id, props);
  }

  equals(object?: Entity<WalletTransactionProps>): boolean {
    if (!object) return false;
    return object.getId() === this.getId();
  }

  geteProps(): WalletTransactionProps {
    return {
      walletId: this.walletId,
      paymentId: this.paymentId,
      type: this.type,
      amount: this.amount,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }
}
