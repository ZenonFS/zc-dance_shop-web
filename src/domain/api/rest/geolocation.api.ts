import { environment } from '@/environments/environment';
import { ICity } from '@/shared/interfaces/geolocation.interfaces';
import { IHttpResponse } from '@/shared/interfaces/http-response.interfaces';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeolocationAPI {
  readonly #URI = `${environment.geolocationUrl}`;
  readonly #httpClient = inject(HttpClient);

  // #region Cities
  async getCities() {
    return await firstValueFrom(
      this.#httpClient.get<IHttpResponse<ICity[]>>(`${this.#URI}/cities`)
    );
  }
  // #endregion
}
