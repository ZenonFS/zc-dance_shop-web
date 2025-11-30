import { EcommerceService } from '@/domain/api/rest/ecommerce.service';
import { Cart } from '@/domain/use-cases/cart';
import { IShippingData } from '@/shared/interfaces/cart.interfaces';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-check',
  imports: [CommonModule, Card, Skeleton, TableModule],
  templateUrl: './check.html',
  styleUrl: './check.scss',
})
export class Check {
  readonly #router: Router = inject(Router);
  readonly #cartInstance: Cart = inject(Cart);
  readonly #route: ActivatedRoute = inject(ActivatedRoute);
  readonly #ecommerceInstance: EcommerceService = inject(EcommerceService);

  transactionId!: string;
  transactionReference!: string;
  transactionData: {
    _id: string;
    reference: string;
    products: Record<string, any>[];
    facturationData: Record<string, any>;
    shippingData: IShippingData;
    createdAt: string;
    updatedAt: string;
  } | null = null;

  get totalPriceProducts() {
    return this.transactionData
      ? this.transactionData.products
          .map(({ price, amount }) => price * amount)
          .reduce((prevValue, currValue) => prevValue + currValue, 0)
      : 0;
  }

  ngOnInit() {
    const transactionReference = this.#route.snapshot.queryParamMap.get('transactionReference');
    const transactionId = this.#route.snapshot.queryParamMap.get('transactionId');
    const id = this.#route.snapshot.queryParamMap.get('id');
    if (transactionId || id) {
      this.transactionId = transactionId ?? id ?? '';
      this.#loadTransaction(transactionId ?? id ?? '');
    }
    if (transactionReference) this.transactionReference = transactionReference;
  }

  async #loadTransaction(transactionId: string) {
    const { results } = await this.#ecommerceInstance.getTransaction(transactionId);

    if (!results) return;

    this.transactionData = results;
    await this.#cartInstance.deleteProducts(results.products.map(({ uuid }) => uuid));
  }
}
