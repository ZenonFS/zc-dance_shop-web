import { Cart } from '@/domain/use-cases/cart';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroup, InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMask } from 'primeng/inputmask';
import { debounceTime } from 'rxjs';
import { EcommerceService } from '@/domain/api/rest/ecommerce.service';
import { GeolocationAPI } from '@/domain/api/rest/geolocation.api';
import { IFacturationData, IShippingData } from '@/shared/interfaces/cart.interfaces';
import { SelectButton } from 'primeng/selectbutton';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';
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
export class Checkout implements OnInit {
  readonly #ecommerceInstance = inject(EcommerceService);
  readonly #geolocationApiInstance = inject(GeolocationAPI);
  readonly #titleCasePipe = inject(TitlecaseEsPipe);

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

  get nationalId() {
    return this.cartInstance.fcNationalId.value;
  }
  get nationalIdInputMask() {
    return this.kindOfPerson === 'LEGAL_ENTITY' ? '999999999?-9' : '9?999999999';
  }

  get fullname() {
    return this.cartInstance.fcFullName.value;
  }
  get firstName() {
    return this.cartInstance.fcFirstName.value ?? '';
  }
  get secondName() {
    return this.cartInstance.fcSecondName.value ?? '';
  }
  get lastName() {
    return this.cartInstance.fcLastName.value ?? '';
  }

  get phoneNumber() {
    return this.cartInstance.fcPhoneNumber.value;
  }
  get email() {
    return this.cartInstance.fcEmail.value;
  }

  get useShippingData() {
    return this.cartInstance.fcUseShippingData.value;
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
    private readonly route: ActivatedRoute
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

    this.cartInstance.fcFullName.disable();
    this.cartInstance.fcShippingState.disable();

    this.#registerValueChanges();
    this.#loadCitiesAndStates();
  }

  #registerValueChanges() {
    this.cartInstance.fcKindOfPerson.valueChanges.subscribe((kindOfPerson) => {
      this.cartInstance.fgFacturation.reset({ kindOfPerson });
      if (!kindOfPerson) return;
      if (kindOfPerson === 'LEGAL_ENTITY') {
        this.cartInstance.fcFirstName.disable();
        this.cartInstance.fcSecondName.disable();
        this.cartInstance.fcLastName.disable();

        this.cartInstance.fcFullName.enable();
        this.cartInstance.fcFullName.addValidators(Validators.required);
      }
      if (kindOfPerson === 'PERSON_ENTITY') {
        this.cartInstance.fcFullName.disable();

        this.cartInstance.fcFirstName.enable();
        this.cartInstance.fcFirstName.addValidators(Validators.required);

        this.cartInstance.fcSecondName.enable();

        this.cartInstance.fcLastName.enable();
        this.cartInstance.fcLastName.addValidators(Validators.required);
      }
    });
    this.cartInstance.fcFirstName.valueChanges.subscribe((value) => {
      this.cartInstance.fcFullName.patchValue(`${value ?? ''} ${this.secondName} ${this.lastName}`);
    });
    this.cartInstance.fcSecondName.valueChanges.subscribe((value) => {
      this.cartInstance.fcFullName.patchValue(`${this.firstName} ${value ?? ''} ${this.lastName}`);
    });
    this.cartInstance.fcLastName.valueChanges.subscribe((value) => {
      this.cartInstance.fcFullName.patchValue(
        `${this.firstName} ${this.secondName} ${value ?? ''}`
      );
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
              this.cartInstance.fgFacturation.patchValue(
                {
                  nationalId: identification,
                  fullName: results.name,
                  firstName: results.nameObject?.firstName,
                  secondName: results.nameObject?.secondName,
                  lastName: results.nameObject?.lastName,
                  address: results.address.address,
                  state: results.address.department,
                  city: results.address.city,
                  phoneNumber: results.mobile,
                  email: results.email,
                },
                { emitEvent: false }
              );
              this.cartInstance.fgFacturation.updateValueAndValidity();
            }
          } catch (error) {
            console.error(error);
          }
        }
      });
    this.cartInstance.fcUseShippingData.valueChanges.subscribe((value) => {
      if (value) {
        const { address, city, phoneNumber, state } = this.cartInstance.fgShipping.controls;
        this.cartInstance.fgFacturation.patchValue({
          phoneNumber: phoneNumber.value,
          address: address.value,
          city: city.value,
          state: state.value,
        });
      } else {
        this.cartInstance.fgFacturation.patchValue({
          phoneNumber: null,
          address: null,
          city: null,
          state: null,
        });
      }
    });

    this.cartInstance.fcShippingCity.valueChanges.subscribe((value) => {
      if (!value) return;

      const cityMetadata = this.#cities.get(value);
      if (!cityMetadata || !cityMetadata.state) return;

      if (cityMetadata.postalCode === 'domicilio') this.cartInstance.shippingCost = 12000;
      if (cityMetadata.postalCode === 'interrapidisimo') this.cartInstance.shippingCost = 18000;

      this.cartInstance.fcShippingState.patchValue(cityMetadata.state.split('-').pop()?.trim() ?? '');

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
