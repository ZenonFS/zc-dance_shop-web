import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ProductCard } from '../../../components/collections/product-card/product-card';
import { IProduct } from '../../../../shared/interfaces/product.interfaces';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Select, SelectChangeEvent } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { EcommerceService } from '@/domain/api/rest/ecommerce.service';

interface ISelectOption {
  name: string;
  value: string;
}

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
  ],
  templateUrl: './collections.html',
  styleUrl: './collections.scss',
})
export class Collections {
  // Mocks
  private _products: IProduct[] = [
    {
      uuid: '1',
      name: '',
      price: 0,
      description: '',
      imageUrl: '',
      quantityAvalible: 0,
    },
    {
      uuid: '2',
      name: '',
      price: 0,
      description: '',
      imageUrl: '',
      quantityAvalible: 0,
    },
    {
      uuid: '3',
      name: '',
      price: 0,
      description: '',
      imageUrl: '',
      quantityAvalible: 0,
    },

  ];

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

  // * Filters
  private _filters: Record<string, any>[] = [];
  get filters() {
    return this._filters;
  }
  set setFilters(filters: Record<string, any>[]) {
    this._filters = filters;
  }

  // Filter Form
  fgFilters: FormGroup = new FormGroup({
    fcColor: new FormControl<ISelectOption | null>(null),
    fcSize: new FormControl<ISelectOption | null>(null),
    fcType: new FormControl<ISelectOption | null>(null),
  });

  // get selectedColor() {
  //   return this.fgFilters.controls.fcColor.value?.value;
  // }

  // get selectedSize() {
  //   return this.fgFilters.controls.fcSize.value?.value;
  // }

  // get selectedType() {
  //   return this.fgFilters.controls.fcType.value?.value;
  // }

  // set setSelectedType(selectedOption: ISelectOption) {
  //   this.fgFilters.controls.fcType.patchValue(selectedOption);
  // }

  get totalProducts() {
    return this.products.length;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ecommerceInstance: EcommerceService
  ) {}

  async ngOnInit() {
    await Promise.all([this._getProducts(true), this._getFilters()]);

    const qpType = this.route.snapshot.queryParamMap.get('t');
    console.log('qpType', qpType);

    if (qpType) {
      // const type = this.types.find(({ value }) => value === qpType);
      // console.log('type', type);
      // if (type) this.fgFilters.controls.fcType.patchValue(type);
    }
  }

  private async _getFilters() {
    const { results } = await this.ecommerceInstance.getProductsFilters();
    if (results) this.setFilters = results;
  }

  private async _getProducts(loadAllProducts: boolean, params?: Record<string, string>) {
    const { results } = await this.ecommerceInstance.getProducts(params);
    if (results && loadAllProducts)
      this.setProducts = results.map((product) => ({
        uuid: product['id'],
        name: product['name'],
        price: product['price'][0]['price'],
        description: product['description'],
        imageUrl: product['images']?.[0]['url'] ?? '/zc.png',
        quantityAvalible: product['inventory']['availableQuantity'],
      }));
    return results;
  }

  private async _loadMoreProducts() {
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
        price: product['price'][0]['price'],
        description: product['description'],
        imageUrl: product['images']?.[0]['url'] ?? '/zc.png',
        quantityAvalible: product['inventory']['availableQuantity'],
      }));

      if (products.length < 25) this.page = -1;
    }
  }

  onChangeFilter($event: SelectChangeEvent, inputRef: string) {
    console.log($event.value);
    // this.setSelectedType = $event.value;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this._loadMoreProducts();
    }
  }
}
