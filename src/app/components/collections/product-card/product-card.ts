import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import IProductCart from '@/shared/interfaces/cart.interfaces';
import { IProduct } from '@/shared/interfaces/product.interfaces';
import { Cart } from '@/domain/use-cases/cart';
import { ActivatedRoute, Router } from '@angular/router';
import { Carousel } from 'primeng/carousel';
import { IImage } from '@/shared/interfaces/product-details.interfaces';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";

@Component({
  selector: 'app-product-card',
  imports: [SkeletonModule, CommonModule, ButtonModule, ImageModule, Carousel, Toast],
  providers: [MessageService],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard implements IProduct {
  @Input() uuid!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() price!: number;
  @Input() imagesUrl!: IImage[];
  @Input() quantityAvalible!: number;

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  get showNavigators() {
    return this.imagesUrl.length > 1;
  }

  constructor(
    private readonly cart: Cart,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly route: ActivatedRoute
  ) {}

  addProductToCart() {
    const productCart = {
      uuid: this.uuid,
      name: this.name,
      price: this.price,
      imagesUrl: this.imagesUrl,
      quantityAvalible: this.quantityAvalible,
      amount: 1,
      isSelected: true,
      description: this.description,
    } satisfies IProductCart;

    this.cart.addProduct(productCart);

    this.messageService.add({
      severity: 'success',
      summary: 'Producto agregado',
      detail: `${this.name} ha sido añadido a la cesta.`,
      life: 3000,
      contentStyleClass: 'test-test',
    });
  }

  async goToDetails() {
    await this.router.navigate(['details', this.uuid], { relativeTo: this.route });
  }
}
