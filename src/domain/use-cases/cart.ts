import { Injectable } from '@angular/core';
import IProductCart from '../../shared/interfaces/cart.interfaces';

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private readonly cart: { products: IProductCart[] } = { products: [] };

  get cartTotalPrice(): number {
    if (this.cart.products.length === 0) return 0;

    return this.cart.products
      .map(({ price }) => price)
      .reduce((prevValue, currValue) => prevValue + currValue, 0);
  }

  get cartTotalProducts() {
    if (this.cart.products.length === 0) return 0;

    return this.cart.products
      .map(({ amount }) => amount)
      .reduce((prevValue, currValue) => prevValue + currValue, 0);
  }

  get products() {
    return this.cart.products;
  }


  addProduct(productCart: IProductCart) {
    console.log(productCart);

    this.cart.products.push(productCart);
  }
}
