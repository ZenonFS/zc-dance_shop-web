import { IProduct } from './product.interfaces';

export default interface IProductCart extends IProduct {
  amount: number;
  isSelected: boolean;
}

export interface IFacturationData {
  nationalId?: string | null;
  fullName?: string | null;
  firstName?: string | null;
  secondName?: string | null;
  lastName?: string | null;

  address?: string | null;
  state?: string | null;
  city?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface IShippingData {
  address?: string | null;
  state?: string | null;
  city?: string | null;
  phoneNumber?: string | null;
}
