import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ProductCard } from '../../../components/collections/product-card/product-card';
import { IProduct } from '../../../../shared/interfaces/product.interfaces';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { EcommerceService } from '@/domain/api/rest/ecommerce.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-collections',
  imports: [
    SkeletonModule,
    ButtonModule,
    CommonModule,
    ProductCard,
    FormsModule,
    Select,
    SelectButton,
    ChipModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './collections.html',
  styleUrl: './collections.scss',
})
export class Collections {
  #activatedRoute = inject(ActivatedRoute);

  private _products: IProduct[] = [];

  get products() {
    return this._products;
  }
  set setProducts(products: IProduct[]) {
    this._products = products;
  }
  set pushProducts(products: IProduct[]) {
    this._products = [...this._products, ...products];
  }

  private page = 1;

  loadingMore = false;
  isLoading = false;

  // * Filters
  private _filters: Record<string, any>[] = [];
  get filters() {
    return this._filters;
  }
  set setFilters(filters: Record<string, any>[]) {
    this._filters = filters;
  }

  // Filter Form
  fgFilters = new FormGroup({
    fcColor: new FormControl<string[] | null>(null),
    fcSize: new FormControl<string[] | null>(null),
    fcType: new FormControl<string | null>(null),
  });

  get isFormVoid() {
    const { fcColor, fcSize, fcType } = this.fgFilters.value;
    return !fcColor && !fcSize && !fcType;
  }

  get totalProducts() {
    return this.products.length;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ecommerceInstance: EcommerceService
  ) {}

  async ngOnInit() {
    this.#activatedRoute.queryParams.subscribe(({t}) => {
      this.fgFilters.controls.fcType.patchValue(t ?? null);
      this.applyFilters();
    });

    this.#registerOnChangeFilters();
    await this._getFilters();
    this.#getQueryParams();

    const { fcColor, fcSize, fcType } = this.fgFilters.value;

    await this._getProducts(true, {
      t: fcType ? fcType : '',
      s: fcSize ? fcSize.join(',') : '',
      c: fcColor ? fcColor.join(',') : '',
    });
  }

  #registerOnChangeFilters() {
    this.fgFilters.valueChanges.subscribe((values) => {
      if (values) {
        const { fcColor, fcSize, fcType } = values;

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            t: fcType ? fcType : '',
            s: fcSize ? fcSize.join(',') : '',
            c: fcColor ? fcColor.join(',') : '',
          },
        });
      }
    });
  }

  #getQueryParams() {
    const qpType = this.route.snapshot.queryParamMap.get('t');

    if (qpType) {
      this.fgFilters.controls.fcType.patchValue(qpType);
    }

    const qpSize = this.route.snapshot.queryParamMap.get('s');
    if (qpSize) {
      this.fgFilters.controls.fcSize.patchValue(qpSize.split(','));
    }

    const qpColor = this.route.snapshot.queryParamMap.get('c');
    if (qpColor) {
      this.fgFilters.controls.fcColor.patchValue(qpColor.split(','));
    }
  }

  private async _getFilters() {
    const { results } = await this.ecommerceInstance.getProductsFilters();
    if (results) this.setFilters = results;
  }

  private async _getProducts(loadAllProducts: boolean, params?: Record<string, string>) {
    this.isLoading = true;
    try {
      const { results } = await this.ecommerceInstance.getProducts(params);
      if (results && loadAllProducts)
        this.setProducts = results.map((product) => ({
          uuid: product['id'],
          name: product['name'],
          reference: product['reference'],
          type: product['type'],
          price: product['price'][0]['price'],
          description: product['description'],
          imagesUrl: product['images'] ?? ['/zc.png'],
          quantityAvalible: product['inventory']['availableQuantity'],
        }));
      return results;
    } catch (error) {
      console.error(error);

      return [];
    } finally {
      this.isLoading = false;
    }
  }

  cleanFilters() {
    this.fgFilters.reset();

    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }

  async applyFilters() {
    const { fcColor, fcSize, fcType } = this.fgFilters.value;

    await this._getProducts(true, {
      t: fcType ? fcType : '',
      s: fcSize ? fcSize.join(',') : '',
      c: fcColor ? fcColor.join(',') : '',
    });
  }

  private async _loadMoreProducts() {
    if (this.products.length < 25) this.page = -1;
    if (this.page === -1) return;
    this.loadingMore = true;

    this.page++;
    const products = await this._getProducts(false, {
      start: this.page === 1 ? '0' : String(25 * this.page - 25),
      limit: this.page === 1 ? '25' : String(25 * this.page),
    });
    this.loadingMore = false;

    if (products) {
      this.pushProducts = products.map((product) => ({
        uuid: product['id'],
        name: product['name'],
        reference: product['reference'],
        type: product['type'],
        price: product['price'][0]['price'],
        description: product['description'],
        imagesUrl: product['images'] ?? ['/zc.png'],
        quantityAvalible: product['inventory']['availableQuantity'],
      }));

      if (products.length < 25) this.page = -1;
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this._loadMoreProducts();
    }
  }
}
