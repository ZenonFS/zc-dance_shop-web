import { Cart } from '@/domain/use-cases/cart';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputGroup, InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMask } from 'primeng/inputmask';
import { debounceTime } from 'rxjs';
import { EcommerceService } from '@/domain/api/rest/ecommerce.service';
import { GeolocationAPI } from '@/domain/api/rest/geolocation.api';
import { SelectButton } from 'primeng/selectbutton';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { CommonModule, ViewportScroller } from '@angular/common';
import { TitlecaseEsPipe } from '@/app/pipes/titlecase-es-pipe';

interface IOption {
  name: string;
  code: string;
  state?: string;
  postalCode?: string;
}

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    Card,
    Divider,
    InputMask,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputGroupModule,
    InputTextModule,
    InputGroup,
    SelectButton,
    AutoComplete,
  ],
  providers: [TitlecaseEsPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit, AfterViewInit {
  readonly #ecommerceInstance = inject(EcommerceService);
  readonly #geolocationApiInstance = inject(GeolocationAPI);

  @ViewChild('targetSection') targetSection!: HTMLElement;

  transactionReference!: string;
  #signatureIntegrity!: string;
  get signatureIntegrity() {
    return this.#signatureIntegrity;
  }
  #expirationTime!: string;
  get expirationTime() {
    return this.#expirationTime;
  }

  // * Form Props
  kindOfPersonOptions = [
    { label: 'Persona natural', value: 'PERSON_ENTITY' },
    { label: 'Persona jurídica', value: 'LEGAL_ENTITY' },
  ];

  yesOrNotOptions = [
    { label: 'Sí', value: true },
    { label: 'No', value: false },
  ];

  get kindOfPerson() {
    return this.cartInstance.fcKindOfPerson.value;
  }

  get fcEmail() {
    return this.cartInstance.fcEmail;
  }

  get nationalIdInputMask() {
    return this.kindOfPerson === 'LEGAL_ENTITY' ? '999999999?-9' : '9?999999999';
  }

  get cartTotalPriceInCents() {
    const cartTotalPrice = String(
      this.cartInstance.cartTotalPrice + this.cartInstance.shippingCost
    );
    return cartTotalPrice.padEnd(cartTotalPrice.length + 2, '0');
  }

  #cities = new Map<string, IOption>();
  get cities() {
    return Array.from(this.#cities.values());
  }
  selectedCity: any;

  filteredCities: IOption[] = [];
  get optionsCities() {
    return this.filteredCities.length === 0
      ? this.cities.slice(0, 50)
      : this.filteredCities.slice(0, 50);
  }
  #states = new Map<string, IOption>();
  get states() {
    return Array.from(this.#states.values());
  }

  get fgShipping() {
    return this.cartInstance.fgShipping;
  }

  get fgFacturation() {
    return this.cartInstance.fgFacturation;
  }

  constructor(
    public readonly cartInstance: Cart,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly scroller: ViewportScroller
  ) {}

  ngOnInit() {
    const transactionReference = this.route.snapshot.queryParamMap.get('transactionReference');
    if (!transactionReference) {
      this.router.navigate(['/cart']);
      return;
    }
    this.transactionReference = transactionReference;

    const transactionId = this.route.snapshot.queryParamMap.get('transactionId');
    if (transactionId) this.cartInstance.transactionId = transactionId;

    this.cartInstance.fcShippingFullName.disable();
    this.cartInstance.fcShippingState.disable();
    this.cartInstance.fcFullName.disable();

    this.#registerValueChanges();
    this.#loadCitiesAndStates();
  }

  ngAfterViewInit() {
    const transactionId = this.route.snapshot.queryParamMap.get('transactionId');
    if (transactionId) {
      this.cartInstance.transactionId = transactionId;

      this.scroller.scrollToAnchor('form-shipping');
    }
  }

  #registerValueChanges() {
    this.cartInstance.fcShippingNationalId.valueChanges
      .pipe(debounceTime(600))
      .subscribe(async (identification) => {
        if (identification) {
          try {
            const { results } = await this.#ecommerceInstance.getClientByIdentification(
              identification.replaceAll('_', '')
            );

            this.cartInstance.isNewClient = !results;

            if (results) {
              this.cartInstance.clientId = results['id'];

              const newFcFacturationValue: Record<string, any> = {
                nationalId: identification,
                fullName: results.name,
                firstName: results.nameObject?.firstName,
                secondName: results.nameObject?.secondName,
                lastName: results.nameObject?.lastName,
                phoneNumber: results.mobile,
                email: results.email,
              };

              newFcFacturationValue['address'] = results.address.address;
              newFcFacturationValue['state'] = results.address.department;
              newFcFacturationValue['city'] = results.address.city;

              this.cartInstance.fgShipping.patchValue(newFcFacturationValue, {
                emitEvent: false,
              });
              this.cartInstance.fgShipping.updateValueAndValidity();
            }
          } catch (error) {
            console.error(error);
          }
        }
      });

    this.cartInstance.fcNationalId.valueChanges
      .pipe(debounceTime(600))
      .subscribe(async (identification) => {
        if (identification) {
          try {
            const { results } = await this.#ecommerceInstance.getClientByIdentification(
              identification.replaceAll('_', '')
            );

            this.cartInstance.isNewClient = !results;

            if (results) {
              this.cartInstance.clientId = results['id'];

              const newFcFacturationValue: Record<string, any> = {
                nationalId: identification,
                fullName: results.name,
                firstName: results.nameObject?.firstName,
                secondName: results.nameObject?.secondName,
                lastName: results.nameObject?.lastName,
                phoneNumber: results.mobile,
                email: results.email,
              };

              const fcAddressValue = this.cartInstance.fcAddress.value;
              if (!fcAddressValue) {
                newFcFacturationValue['address'] = results.address.address;
                newFcFacturationValue['state'] = results.address.department;
                newFcFacturationValue['city'] = results.address.city;
              }

              this.cartInstance.fgFacturation.patchValue(newFcFacturationValue, {
                emitEvent: false,
              });
              this.cartInstance.fgFacturation.updateValueAndValidity();
            }
          } catch (error) {
            console.error(error);
          }
        }
      });

    this.cartInstance.fcShippingCity.valueChanges.subscribe((value) => {
      if (!value) return;

      const cityMetadata = this.#cities.get(value);
      if (!cityMetadata || !cityMetadata.state) return;

      if (cityMetadata.postalCode === 'domicilio') this.cartInstance.shippingCost = 13000;
      if (cityMetadata.postalCode === 'interrapidisimo') this.cartInstance.shippingCost = 18000;

      this.cartInstance.fcShippingState.patchValue(
        cityMetadata.state.split('-').pop()?.trim() ?? ''
      );
    });
  }

  async #loadCitiesAndStates() {
    this.cartInstance.fcState.disable();

    this.cartInstance.fcCity.valueChanges.subscribe((value) => {
      if (!value) return;
      const cityMetadata = this.#cities.get(value);

      if (!cityMetadata || !cityMetadata.state) return;

      this.cartInstance.fcState.patchValue(cityMetadata.state.split('-').pop()?.trim() ?? '');
    });

    const { results } = await this.#geolocationApiInstance.getCities();
    if (!results) return;

    results.forEach(({ externalId, name, state, postalCode }) => {
      if (!this.#cities.has(name))
        this.#cities.set(name, { code: externalId, name: name, state, postalCode });

      if (state) {
        const [code, ...rest] = state?.split('-');
        if (!this.#states.has(code))
          this.#states.set(code, { code, name: rest.join('-'), postalCode });
      }
    });
  }

  filterCountry(event: AutoCompleteCompleteEvent) {
    let filtered: IOption[] = [];
    let query = event.query;

    for (let i = 0; i < (this.cities as any[]).length; i++) {
      let country = this.cities[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.filteredCities = filtered;
  }
}
