import { IFacturationData } from "./cart.interfaces";

export interface IPaymentTransaction {
  transaction: {
    id: string;
    created_at: string;
    finalized_at: string;
    amount_in_cents: number;
    reference: string;
    customer_email: string;
    currency: string;
    payment_method_type: string;
    payment_method: any[];
    status: string;
    status_message: null;
    shipping_address: null;
    redirect_url: null;
    payment_source_id: null;
    payment_link_id: null;
    customer_data: any[];
    billing_data: any[];
    origin: null;
  };
  sent_at: string;
  timestamp: number;
  signature: {
    checksum: string;
    properties: string[];
  };
  environment: string;
}

export interface ITransaction {
  reference: string;
  products: any[];
  facturationData: IFacturationData & {id: string};
  shippingData: any;
  paymentTransaction?: IPaymentTransaction;
}

export type TransactionCartDto = Omit<ITransaction, 'paymentTransaction'>;
