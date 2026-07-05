import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import IProductCart from '@/shared/interfaces/cart.interfaces';
import { IProduct } from '@/shared/interfaces/product.interfaces';
import { IProduct as IProductDetail } from '@/shared/interfaces/product-details.interfaces';
import { Cart } from '@/domain/use-cases/cart';
import { ActivatedRoute, Router } from '@angular/router';
import { Carousel } from 'primeng/carousel';
import { IImage } from '@/shared/interfaces/product-details.interfaces';
import { Toast } from 'primeng/toast';
import { EcommerceService } from '@/domain/api/rest/ecommerce.service';
import { Dialog } from 'primeng/dialog';
import { IOptions } from '@/shared/interfaces';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { InputNumber } from 'primeng/inputnumber';
import { Tag } from 'primeng/tag';
import HotToastClass from '@/shared/utils/helpers/hot-toast.helper';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-card',
  imports: [
    CommonModule,
    FormsModule,
    SkeletonModule,
    ButtonModule,
    ImageModule,
    Carousel,
    Toast,
    Dialog,
    ListboxModule,
    Tag,
    InputNumber,
  ],
  providers: [MessageService],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard implements IProduct {
  #hotToast = inject(HotToastClass);

  @Input() uuid!: string;
  @Input() name!: string;
  @Input() reference!: string;
  @Input() type!: string;
  @Input() description!: string;
  @Input() price!: number;
  @Input() imagesUrl!: IImage[];
  @Input() quantityAvalible!: number;

  #variants: IProductDetail[] = [];

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

  visible: boolean = false;

  #colorsOptions: IOptions[] = [];
  get colors() {
    return this.#colorsOptions;
  }
  selectedVariant!: string;

  #sizesOptions: IOptions[] = [];
  get sizes() {
    return this.#sizesOptions;
  }

  get canBuyProduct() {
    return (
      this.quantityAvalible > 0 ||
      this.#variants.some(({ inventory }) => inventory.availableQuantity > 0)
    );
  }

  amount = 1;

  get maxAvailableQuantity() {
    if (this.type === 'variantParent') {
      if (this.selectedVariant) {
        const variant = this.#variants.find(({ id }) => this.selectedVariant === id);
        return variant?.inventory.availableQuantity ?? 0;
      }
      return 0;
    }
    return this.quantityAvalible;
  }

  get btnLabel() {
    return this.type === 'variantParent' ? 'Seleccionar opciones' : 'Agregar al carrito';
  }

  constructor(
    private readonly cart: Cart,
    private readonly ecommerceInstance: EcommerceService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  async #getVariants(reference: string) {
    const { results: variantsResult } = await this.ecommerceInstance.getVariantsProduct(reference);
    if (variantsResult) {
      this.#variants = variantsResult;

      this.#sizesOptions = variantsResult.map(
        ({ id, name }) =>
          ({
            id,
            value: name
              .split('/')
              .map((element) => element.trim())
              .slice(1)
              .join(' / '),
            isDisabled: false,
          }) satisfies IOptions,
      );
    }
  }

  async addProductToCart() {
    if (this.type === 'variantParent') {
      await this.#getVariants(this.reference);
      this.showDialog();
      return;
    }

    const productCart = {
      uuid: this.uuid,
      name: this.name,
      reference: this.reference,
      type: this.type,
      price: this.price,
      imagesUrl: this.imagesUrl,
      quantityAvalible: this.quantityAvalible,
      amount: this.amount,
      isSelected: true,
      description: this.description,
    } satisfies IProductCart;

    this.#addProduct(productCart);
  }

  #addProduct(productCart: IProductCart) {
    this.cart.addProduct(productCart);

    this.#hotToast.successNotification(`${this.name} ha sido añadido a la cesta.`);
  }

  async goToDetails() {
    await this.router.navigate(['details', this.uuid], { relativeTo: this.route });
  }

  // #region Modal Methods
  showDialog() {
    this.visible = true;
  }

  confirmAddToCart() {
    if (!this.selectedVariant) return;
    const variant = this.#variants.find(({ id }) => this.selectedVariant === id);
    if (!variant) return;

    const productCart = {
      uuid: variant.id,
      name: variant.name,
      reference: variant.reference,
      type: variant.type,
      price: variant.price[0].price,
      imagesUrl: variant.images,
      quantityAvalible: variant.inventory.availableQuantity,
      amount: 1,
      isSelected: true,
      description: variant.description,
    } satisfies IProductCart;

    this.#addProduct(productCart);
    this.visible = false;
  }
  // #endregion
}
