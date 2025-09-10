import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import IProductCart from '@/shared/interfaces/cart.interfaces';
import { IProduct } from '@/shared/interfaces/product.interfaces';
import { Cart } from '@/domain/use-cases/cart';

@Component({
  selector: 'app-product-card',
  imports: [SkeletonModule, CommonModule, ButtonModule, ImageModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard implements IProduct {
  @Input('uuid') uuid!: string;
  @Input('name') name!: string;
  @Input('description') description!: string;
  @Input('price') price!: number;
  @Input('imageUrl') imageUrl!: string;
  @Input('quantityAvalible') quantityAvalible!: number;

  constructor(private readonly cart: Cart) {}

  addProductToCart() {
    const productCart = {
      uuid: this.uuid,
      name: this.name,
      price: this.price,
      imageUrl: this.imageUrl,
      quantityAvalible: this.quantityAvalible,
      amount: 1,
      description: this.description
    } satisfies IProductCart;

    // Assuming Cart is injected in the parent component
    // and has a method to add products to the cart
    this.cart.addProduct(productCart);
  }
}
