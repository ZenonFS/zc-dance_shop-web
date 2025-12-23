import { IAttachment } from './../../../../../shared/interfaces/product-details.interfaces';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Toast } from 'primeng/toast';
import { Carousel } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { SelectButton, SelectButtonChangeEvent } from 'primeng/selectbutton';
import { EcommerceService } from '@/domain/api/rest/ecommerce.service';
import { IImage, IProduct } from '@/shared/interfaces/product-details.interfaces';
import { Skeleton } from 'primeng/skeleton';
import IProductCart from '@/shared/interfaces/cart.interfaces';
import { Cart } from '@/domain/use-cases/cart';
import { IOptions } from '@/shared/interfaces';
import { Message } from 'primeng/message';
import { Dialog } from 'primeng/dialog';
import { Listbox } from 'primeng/listbox';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ProgressSpinner } from 'primeng/progressspinner';
import HotToastClass from '@/shared/utils/helpers/hot-toast.helper';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-details',
  imports: [
    CommonModule,
    FormsModule,
    Breadcrumb,
    RouterModule,
    Toast,
    Carousel,
    AccordionModule,
    Button,
    Message,
    SelectButton,
    TabsModule,
    Skeleton,
    Dialog,
    Listbox,
    InputNumber,
    ProgressSpinner,
  ],
  providers: [MessageService],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details implements OnInit {
  #hotToast = inject(HotToastClass);

  @ViewChild('sizeSelect') sizeSelectRef!: SelectButton;
  @ViewChild('colorSelect') colorSelectRef!: SelectButton;

  breadcumItems: MenuItem[] = [{ label: 'Colección', routerLink: '/collections' }];
  amount = 1;

  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  images: IImage[] = [];
  attachment!: IAttachment;

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 2,
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

  isLoading = true;

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
  get hasColors() {
    return this.#colorsOptions.some((option) => !option.isDisabled);
  }

  #sizesOptions: IOptions[] = [];
  get sizes() {
    return this.#sizesOptions;
  }

  get productIsInCart() {
    return this.cart.hasProduct(this._product['id']);
  }

  get canBuyProduct() {
    return (
      this._product.inventory.availableQuantity > 0 ||
      this._product.variants.some(({ inventory }) => inventory.availableQuantity > 0)
    );
  }

  selectedVariant!: string;
  visible: boolean = false;
  onChanging = false;

  sizesGuideDialogIsVisible = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ecommerceInstance: EcommerceService,
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
    this.isLoading = true;
    try {
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
    } catch (error) {
    } finally {
      this.isLoading = false;
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
      if (results['attachments']) this.attachment = results['attachments'][0];
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

  async addProductToCart() {
    if (this._product.type === 'variantParent') {

      if (this.sizeSelectRef.value && this.colorSelectRef.value && this.hasColors) {
        const variant = this._product.variants.find(({ name }) =>
          name.includes(`/ ${this.sizeSelectRef.value} / ${this.colorSelectRef.value}`)
        );
        if (!variant) return;
        const productCart = {
          uuid: variant.id,
          name: variant.name,
          reference: variant.reference,
          type: variant.type,
          price: variant.price[0].price,
          imagesUrl: variant.images,
          quantityAvalible: variant.inventory.availableQuantity,
          amount: this.amount,
          isSelected: true,
          description: variant.description,
        } satisfies IProductCart;

        this.#addProduct(productCart);
      } else if (this.sizeSelectRef.value && !this.colorSelectRef.value && !this.hasColors) {
        const variant = this._product.variants.find(({ name }) =>
          name.includes(`/ ${this.sizeSelectRef.value}`)
        );
        if (!variant) return;
        const productCart = {
          uuid: variant.id,
          name: variant.name,
          reference: variant.reference,
          type: variant.type,
          price: variant.price[0].price,
          imagesUrl: variant.images,
          quantityAvalible: variant.inventory.availableQuantity,
          amount: this.amount,
          isSelected: true,
          description: variant.description,
        } satisfies IProductCart;

        this.#addProduct(productCart);
      } else this.showDialog();
      return;
    }

    const productCart = {
      uuid: this._product.id,
      name: this._product.name,
      reference: this._product.reference,
      type: this._product.type,
      price: this._product.price[0].price,
      imagesUrl: this._product.images,
      quantityAvalible: this._product.inventory.availableQuantity,
      amount: this.amount,
      isSelected: true,
      description: this._product.description,
    } satisfies IProductCart;

    this.#addProduct(productCart);
  }

  #addProduct(productCart: IProductCart) {
    this.cart.addProduct(productCart);
    this.#hotToast.successNotification(`${this._product.name} ha sido añadido a la cesta.`);
  }

  onSizeChange($event: SelectButtonChangeEvent) {
    this.onChanging = true;
    if (!$event.value) {
      this.colorSelectRef.value = undefined;
      this.images = this._product.images;
      this.#colorsOptions.forEach((colorOption) => {
        colorOption.isDisabled = this._product.colorsMap
          ? !this._product.colorsMap.has(colorOption.value)
          : false;
      });
      this.#sizesOptions.forEach((sizeOption) => {
        sizeOption.isDisabled = this._product.sizesMap
          ? !this._product.sizesMap.has(sizeOption.value)
          : false;
      });
      // Forzar cambio de referencia
      this.#colorsOptions = [...this.#colorsOptions];
      this.onChanging = false;
      this.cd.detectChanges();
      return;
    }

    const variants = this._product.variants.filter((variant) =>
      variant.name.includes(
        this.colorSelectRef.value
          ? `/ ${$event.value} / ${this.colorSelectRef.value}`
          : `/ ${$event.value} /`
      )
    );
    this.images = variants.flatMap(({ images }) => images);

    const colorsRelated = this._product.sizesMap?.get($event.value);
    if (colorsRelated) {
      this.#colorsOptions.forEach((colorOption) => {
        colorOption.isDisabled = !colorsRelated.includes(colorOption.value);
      });
      // Forzar cambio de referencia
      this.#colorsOptions = [...this.#colorsOptions];
    }
    this.onChanging = false;
    this.cd.detectChanges();
  }

  onColorChange($event: SelectButtonChangeEvent) {
    this.onChanging = true;
    if (!$event.value) {
      this.sizeSelectRef.value = undefined;
      this.images = this._product.images;
      this.#colorsOptions.forEach((colorOption) => {
        colorOption.isDisabled = this._product.colorsMap
          ? !this._product.colorsMap.has(colorOption.value)
          : false;
      });
      this.#sizesOptions.forEach((sizeOption) => {
        sizeOption.isDisabled = this._product.sizesMap
          ? !this._product.sizesMap.has(sizeOption.value)
          : false;
      });
      this.#sizesOptions = [...this.#sizesOptions];
      this.onChanging = false;
      this.cd.detectChanges();
      return;
    }

    const variants = this._product.variants.filter((variant) =>
      variant.name.includes(
        this.sizeSelectRef.value
          ? `/ ${this.sizeSelectRef.value} / ${$event.value}`
          : `/ ${$event.value}`
      )
    );
    this.images = variants.flatMap(({ images }) => images);

    const sizesRelated = this._product.colorsMap?.get($event.value);
    if (sizesRelated) {
      this.#sizesOptions.forEach((sizeOption) => {
        sizeOption.isDisabled = !sizesRelated.includes(sizeOption.value);
      });
      this.#sizesOptions = [...this.#sizesOptions];
    }
    this.onChanging = false;
    this.cd.detectChanges();
  }

  // #region Modal Methods
  showDialog() {
    this.visible = true;
  }

  confirmAddToCart() {
    if (!this.selectedVariant) return;
    const variant = this._product.variants.find(({ id }) => this.selectedVariant === id);
    if (!variant) return;

    const productCart = {
      uuid: variant.id,
      name: variant.name,
      reference: variant.reference,
      type: variant.type,
      price: variant.price[0].price,
      imagesUrl: variant.images,
      quantityAvalible: variant.inventory.availableQuantity,
      amount: this.amount,
      isSelected: true,
      description: variant.description,
    } satisfies IProductCart;

    this.#addProduct(productCart);
    this.visible = false;
  }
  // #endregion
}
