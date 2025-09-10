import { Component, Input } from '@angular/core';
import IProductCart from '../../../../shared/interfaces/cart.interfaces';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-product-cart',
  imports: [CommonModule, ImageModule, SkeletonModule],
  templateUrl: './product-cart.html',
  styleUrl: './product-cart.scss'
})
export class ProductCart {
  @Input('product') product!: IProductCart

  ngOnInit() {
    console.log(this.product);
  }
}
