import { Cart } from '@/domain/use-cases/cart';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputGroup, InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMask } from 'primeng/inputmask';
import { debounceTime } from 'rxjs';
import { EcommerceService } from '@/domain/api/rest/ecommerce.service';
import { ToggleButton } from 'primeng/togglebutton';
import { GeolocationAPI } from '@/domain/api/rest/geolocation.api';
import { IFacturationData, IShippingData } from '@/shared/interfaces/cart.interfaces';
import { SelectButton } from 'primeng/selectbutton';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';

interface IOption {
  name: string;
  code: string;
  state?: string;
}

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    Card,
    ToggleButton,
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
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  readonly #ecommerceInstance = inject(EcommerceService);
  readonly #geolocationApiInstance = inject(GeolocationAPI);

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

  fcKindOfPerson = new FormControl<'PERSON_ENTITY' | 'LEGAL_ENTITY'>('PERSON_ENTITY');
  get kindOfPerson() {
    return this.fcKindOfPerson.value;
  }
  fcNationalId = new FormControl('', [Validators.required]);
  get nationalId() {
    return this.fcNationalId.value;
  }
  get nationalIdInputMask() {
    return this.kindOfPerson === 'LEGAL_ENTITY' ? '999999999?-9' : '9999?999999';
  }

  fcFullName = new FormControl('');
  get fullname() {
    return this.fcFullName.value;
  }
  fcFirstName = new FormControl('');
  get firstName() {
    return this.fcFirstName.value ?? '';
  }
  fcSecondName = new FormControl('');
  get secondName() {
    return this.fcSecondName.value ?? '';
  }
  fcLastName = new FormControl('');
  get lastName() {
    return this.fcLastName.value ?? '';
  }

  fcAddress = new FormControl('');
  fcState = new FormControl('');
  fcCity = new FormControl('');
  fcPhoneNumber = new FormControl('');
  get phoneNumber() {
    return this.fcPhoneNumber.value;
  }
  fcEmail = new FormControl('');
  get email() {
    return this.fcEmail.value;
  }

  fgFacturation = new FormGroup({
    kindOfPerson: this.fcKindOfPerson,
    nationalId: this.fcNationalId,
    fullName: this.fcFullName,
    firstName: this.fcFirstName,
    secondName: this.fcSecondName,
    lastName: this.fcLastName,
    address: this.fcAddress,
    state: this.fcState,
    city: this.fcCity,
    phoneNumber: this.fcPhoneNumber,
    email: this.fcEmail,
  });

  #fcUseFacturactionAdressData = new FormControl(false);
  get useFacturactionAdressData() {
    return this.#fcUseFacturactionAdressData.value;
  }

  fcShippingState = new FormControl('');

  fgShipping = new FormGroup({
    useFacturactionAdressData: this.#fcUseFacturactionAdressData,
    address: new FormControl(''),
    city: new FormControl(''),
    state: this.fcShippingState,
    phoneNumber: new FormControl(''),
  });

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

    this.fcFullName.disable();
    this.fcShippingState.disable();

    this.#registerValueChanges();
    this.#loadCitiesAndStates();

    this.#restoreDraft();
  }

  #registerValueChanges() {
    this.fcKindOfPerson.valueChanges.subscribe((kindOfPerson) => {
      this.fgFacturation.reset({ kindOfPerson });
      if (!kindOfPerson) return;
      if (kindOfPerson === 'LEGAL_ENTITY') {
        this.fcFirstName.disable();
        this.fcSecondName.disable();
        this.fcLastName.disable();

        this.fcFullName.enable();
        this.fcFullName.addValidators(Validators.required);
      }
      if (kindOfPerson === 'PERSON_ENTITY') {
        this.fcFullName.disable();

        this.fcFirstName.enable();
        this.fcFirstName.addValidators(Validators.required);

        this.fcSecondName.enable();

        this.fcLastName.enable();
        this.fcLastName.addValidators(Validators.required);
      }
    });
    this.fcFirstName.valueChanges.subscribe((value) => {
      this.fcFullName.patchValue(`${value ?? ''} ${this.secondName} ${this.lastName}`);
    });
    this.fcSecondName.valueChanges.subscribe((value) => {
      this.fcFullName.patchValue(`${this.firstName} ${value ?? ''} ${this.lastName}`);
    });
    this.fcLastName.valueChanges.subscribe((value) => {
      this.fcFullName.patchValue(`${this.firstName} ${this.secondName} ${value ?? ''}`);
    });

    this.fcNationalId.valueChanges.pipe(debounceTime(500)).subscribe(async (identification) => {
      if (identification) {
        try {
          const { results } = await this.#ecommerceInstance.getClientByIdentification(
            identification.replaceAll('_', '')
          );

          this.cartInstance.isNewClient = !results;

          if (results) {
            this.cartInstance.clientId = results['id'];
            this.fgFacturation.patchValue(
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
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
    this.#fcUseFacturactionAdressData.valueChanges.subscribe((value) => {
      if (value) {
        const { address, city, phoneNumber, state } = this.fgFacturation.controls;
        this.fgShipping.patchValue({
          phoneNumber: phoneNumber.value,
          address: address.value,
          city: city.value,
          state: state.value,
        });
      } else {
        this.fgShipping.patchValue({
          phoneNumber: null,
          address: null,
          city: null,
          state: null,
        });
      }
    });
    this.fgFacturation.valueChanges.pipe(debounceTime(500)).subscribe((values) => {
      this.cartInstance.facturationData = {
        ...values,
        fullName: this.fcFullName.value,
        state: this.fcState.value,
      } satisfies IFacturationData;
      console.log(this.fgFacturation.valid);

      this.cartInstance.facturationDataIsValid = this.fgFacturation.valid;
    });
    this.fgShipping.valueChanges.pipe(debounceTime(500)).subscribe((values) => {
      this.cartInstance.shippingData = values satisfies IShippingData;
    });
  }

  #restoreDraft() {
    console.log(this.cartInstance.facturationDataFromDraft);
  }

  async #loadCitiesAndStates() {
    this.fcState.disable();
    this.fcCity.valueChanges.subscribe((value) => {
      if (!value) return;
      const cityMetadata = this.#cities.get(value);

      if (!cityMetadata || !cityMetadata.state) return;

      this.fcState.patchValue(cityMetadata.state);
    });

    const { results } = await this.#geolocationApiInstance.getCities();
    if (!results) return;

    results.forEach(({ externalId, name, state }) => {
      if (!this.#cities.has(externalId))
        this.#cities.set(externalId, { code: externalId, name, state });

      if (state) {
        const [code, ...rest] = state?.split('-');
        if (!this.#states.has(code)) this.#states.set(code, { code, name: rest.join('-') });
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
