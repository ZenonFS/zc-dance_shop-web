import { environment } from '@/environments/environment';
import {
  CreateContactDTO,
  IClient,
  UpdateContactDTO,
} from '@/shared/interfaces/clients.interfaces';
import { IHttpResponse } from '@/shared/interfaces/http-response.interfaces';
import { IProduct } from '@/shared/interfaces/product-details.interfaces';
import { TransactionCartDto } from '@/shared/interfaces/transaction.interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EcommerceService {
  private readonly _URI_PRODUCTS = `${environment.ecommerceUrl}/products`;
  private readonly _URI_CART = `${environment.ecommerceUrl}/cart`;
  readonly #URI_CLIENTS = `${environment.ecommerceUrl}/clients`;

  constructor(private readonly httpClient: HttpClient) {}

  // #region Products
  async getProducts(params?: Record<string, string>) {
    return await firstValueFrom(
      this.httpClient.get<IHttpResponse<IProduct[]>>(this._URI_PRODUCTS, { params })
    );
  }

  async getVariantsProduct(reference: string) {
    return await firstValueFrom(
      this.httpClient.get<IHttpResponse<IProduct[]>>(`${this._URI_PRODUCTS}/${reference}/variants`)
    );
  }

  async getProduct(id: string, params?: Record<string, string>) {
    return await firstValueFrom(
      this.httpClient.get<IHttpResponse<IProduct>>(`${this._URI_PRODUCTS}/${id}`, {
        params,
      })
    );
  }

  async getProductsFilters() {
    return await firstValueFrom(
      this.httpClient.get<IHttpResponse<Record<string, any>[]>>(`${this._URI_PRODUCTS}/filters`)
    );
  }
  // #endregion

  // #region Cart
  async postReference() {
    return await firstValueFrom(
      this.httpClient.post<IHttpResponse<string>>(`${this._URI_CART}/reference`, {})
    );
  }

  async postCreateTransaction(transactionCartDto: TransactionCartDto) {
    return await firstValueFrom(
      this.httpClient.post<IHttpResponse<Record<string, any>>>(
        `${this._URI_CART}/transaction`,
        transactionCartDto
      )
    );
  }
  // #endregion

  // #region Clients
  async postCreateClient(createContactDto: CreateContactDTO) {
    return await firstValueFrom(
      this.httpClient.post<IHttpResponse<Record<string, any>>>(
        `${this.#URI_CLIENTS}/`,
        createContactDto
      )
    );
  }

  async putUpdateClient(id: string, updateContactDto: UpdateContactDTO) {
    return await firstValueFrom(
      this.httpClient.put<IHttpResponse<Record<string, any>>>(
        `${this.#URI_CLIENTS}/${id}`,
        updateContactDto
      )
    );
  }

  async getClientByIdentification(identification: string) {
    return await firstValueFrom(
      this.httpClient.get<IHttpResponse<IClient>>(
        `${this.#URI_CLIENTS}/identification/${identification}`
      )
    );
  }
  // #endregion
}
