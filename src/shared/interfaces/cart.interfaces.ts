import { IProduct } from "./product.interfaces";

export default interface IProductCart extends IProduct {
  amount: number;
}
