import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Toast } from 'primeng/toast';
import { Carousel } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Button } from 'primeng/button';
import { SelectButton, SelectButtonChangeEvent } from 'primeng/selectbutton';
import { EcommerceService } from '@/domain/api/rest/ecommerce.service';
import { IImage, IProduct } from '@/shared/interfaces/product-details.interfaces';
import { Skeleton } from 'primeng/skeleton';
import IProductCart from '@/shared/interfaces/cart.interfaces';
import { Cart } from '@/domain/use-cases/cart';
import { IOptions } from '@/shared/interfaces';

@Component({
  selector: 'app-details',
  imports: [
    CommonModule,
    Breadcrumb,
    RouterModule,
    Toast,
    Carousel,
    AccordionModule,
    InputGroup,
    InputGroupAddon,
    Button,
    SelectButton,
    Skeleton,
  ],
  providers: [MessageService],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details implements OnInit {
  breadcumItems: MenuItem[] = [{ label: 'Colección', routerLink: '/collections' }];
  value!: number;

  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  images: IImage[] = [];

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '1199px',
      numVisible: 2,
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

  private _uuid!: string;
  private _product!: IProduct & {
    variants: IProduct[];
    sizesMap?: Map<string, string[]>;
    colorsMap?: Map<string, string[]>;
  };
  get product() {
    return this._product;
  }
  // * Filters
  #colorsOptions: IOptions[] = [];
  get colors() {
    return this.#colorsOptions;
  }

  #sizesOptions: IOptions[] = [];
  get sizes() {
    return this.#sizesOptions;
  }

  get productIsInCart() {
    return this.cart.hasProduct(this._product['id'])
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ecommerceInstance: EcommerceService,
    private readonly messageService: MessageService,
    private readonly cart: Cart,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.#processParams();
    this.#getProductDetails();
  }

  #processParams() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this._uuid = id;
  }

  async #getFilters() {
    const { results } = await this.ecommerceInstance.getProductsFilters();
    if (results) {
      this.#colorsOptions = results[2]
        ? results[2]['options'].map((option: any) => ({
            ...option,
            isDisabled: this._product.colorsMap
              ? !this._product.colorsMap.has(option['value'])
              : false,
          }))
        : [];

      this.#sizesOptions = results[1]
        ? results[1]['options'].map((option: any) => ({
            ...option,
            isDisabled: this._product.sizesMap
              ? !this._product.sizesMap.has(option['value'])
              : false,
          }))
        : [];
    }
  }

  async #getProductDetails() {
    this.cd.detach();
    const { results } = await this.ecommerceInstance.getProduct(this._uuid);
    if (results) {
      this._product = { ...results, variants: [] };

      this.breadcumItems.push({
        label: results['itemCategory']['name'],
        routerLink: `/collections?t=${results['itemCategory']['id']}`,
      });
      this.breadcumItems.push({
        label: results['name'],
      });
      this.images = results['images'];
      this.cd.detectChanges();
      this.cd.reattach();

      await this.#getVariants(results['reference']);
    }
  }

  async #getVariants(reference: string) {
    const { results: variantsResult } = await this.ecommerceInstance.getVariantsProduct(reference);
    if (variantsResult) {
      this._product['variants'] = variantsResult;

      const variants = variantsResult.map(({ name }) =>
        name
          .split('/')
          .map((element) => element.trim())
          .slice(1)
      );

      const sizesMap = variants.reduce((map, [size, color]) => {
        map.set(size, [...(map.get(size) || []), color]);
        return map;
      }, new Map<string, string[]>());
      this._product['sizesMap'] = sizesMap;

      const colorsMap = variants.reduce((map, [size, color]) => {
        map.set(color, [...(map.get(color) || []), size]);
        return map;
      }, new Map<string, string[]>());
      this._product['colorsMap'] = colorsMap;

      await this.#getFilters();
    }
  }

  addProductToCart() {
    if (this.cart.hasProduct(this._product.id)) {
      this.cart.patchProduct(this._product.id, {
        price: this._product.price[0].price,
        quantityAvalible: this._product.inventory.availableQuantity,
        amount: 2,
      });
    } else {
      const productCart = {
        uuid: this._product.id,
        name: this._product.name,
        price: this._product.price[0].price,
        imagesUrl: this._product.images,
        quantityAvalible: this._product.inventory.availableQuantity,
        amount: 1,
        isSelected: true,
        description: this._product.description,
      } satisfies IProductCart;

      this.cart.addProduct(productCart);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Producto agregado',
      detail: `${this._product.name} ha sido añadido a la cesta.`,
      life: 3000,
      contentStyleClass: 'test-test',
    });
  }

  onSizeChange($event: SelectButtonChangeEvent) {
    console.log('[onSizeChange] $event', $event);
    if ($event.value.length === 0) this.images = this._product.images;
    $event.value.forEach((value: any) => {
      const variants = this._product.variants.filter((variant) =>
        variant.name.includes(`/ ${value} /`)
      );
      const variantImages = variants.flatMap(({ images }) => images);
      console.log(value, 'variantImages', variantImages);
      this.images = variantImages;
    });
  }

  onColorChange($event: SelectButtonChangeEvent) {
    console.log('[onColorChange] $event', $event);
    const variantImages = $event.value.flatMap((value: any) => {
      const variants = this._product.variants.filter((variant) =>
        variant.name.includes(`/ ${value}`)
      );
      return variants.flatMap(({ images }) => images);
    });
    console.log('variantImages', variantImages);
    if ($event.value.length === 0 || variantImages.length === 0) this.images = this._product.images;
    this.images = variantImages;
  }
}
