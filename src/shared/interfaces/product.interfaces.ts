import { IImage } from "./product-details.interfaces";

export interface IProduct {
  uuid: string;
  name: string;
  price: number;
  description: string;
  imagesUrl: IImage[];
  quantityAvalible: number;
}
