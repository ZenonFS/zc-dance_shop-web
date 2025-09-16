import { environment } from '@/environments/environment';
import { IHttpResponse } from '@/shared/interfaces/http-response.interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EcommerceService {
  private readonly _URI_PRODUCTS = `${environment.ecommerceUrl}/products`

  constructor(private readonly httpClient: HttpClient) {}

  async getProducts(params?: Record<string, string>) {
    return await firstValueFrom(this.httpClient.get<IHttpResponse<Record<string, any>[]>>(this._URI_PRODUCTS, {params}))
  }

  async getProductsFilters()  {
    return await firstValueFrom(this.httpClient.get<IHttpResponse<Record<string, any>[]>>( `${this._URI_PRODUCTS}/filters`))
  }
}
