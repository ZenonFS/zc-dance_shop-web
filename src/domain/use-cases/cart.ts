import { Injectable } from '@angular/core';
import IProductCart, {
  IFacturationData,
  IShippingData,
} from '../../shared/interfaces/cart.interfaces';
import { liveQuery } from 'dexie';
import { db } from '@/shared/config/indexdb.config';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class Cart {
  cart$ = liveQuery(() => db.cart.toArray());
  facturationData$ = liveQuery(() => db.facturationData.toArray());

  #isNewClient = true;
  get isNewClient() {
    return this.#isNewClient;
  }
  set isNewClient(value) {
    this.#isNewClient = value;
  }

  #clientId: string | null = null;
  get clientId() {
    return this.#clientId;
  }
  set clientId(value) {
    this.#clientId = value;
  }

  private readonly cart: { products: IProductCart[] } = { products: [] };

  readonly #defaultValueShippingCost = 13000;
  #shippingCost = this.#defaultValueShippingCost;
  get shippingCost() {
    return this.#shippingCost === 0 || this.cartTotalPrice >= 400000 ? 0 : this.#shippingCost;
  }
  set shippingCost(value: number) {
    this.#shippingCost = value;
  }

  get discountPercentage(): number {
    if (this.cartTotalPrice >= 1500000) return 10;
    if (this.cartTotalPrice >= 800000) return 5;
    return 0;
  }

  get discountAmount(): number {
    return Math.round(this.cartTotalPrice * (this.discountPercentage / 100));
  }

  get cartTotalWithDiscount(): number {
    return this.cartTotalPrice - this.discountAmount;
  }

  get cartTotalPrice(): number {
    if (this.cart.products.length === 0) return 0;

    return this.cart.products
      .filter(({ isSelected }) => isSelected)
      .map(({ price, amount }) => price * amount)
      .reduce((prevValue, currValue) => prevValue + currValue, 0);
  }

  get cartTotalUnits() {
    if (this.cart.products.length === 0) return 0;

    return this.cart.products
      .filter(({ isSelected }) => isSelected === true)
      .map(({ amount }) => amount)
      .reduce((prevValue, currValue) => prevValue + currValue, 0);
  }

  get cartTotalProducts() {
    if (this.cart.products.length === 0) return 0;

    return this.cart.products.filter(({ isSelected }) => isSelected === true).length;
  }

  get products() {
    return this.cart.products;
  }

  fcUseShippingData = new FormControl(false, [Validators.required]);

  fcShippingKindOfPerson = new FormControl<'PERSON_ENTITY' | 'LEGAL_ENTITY'>('PERSON_ENTITY', [
    Validators.required,
  ]);
  fcShippingNationalId = new FormControl('', [Validators.required]);
  fcShippingFullName = new FormControl('', [Validators.required]);
  get shippingFullname() {
    return this.fcShippingFullName.value ?? '';
  }
  fcShippingFirstName = new FormControl('', [Validators.required]);
  get shippingFirstName() {
    return this.fcShippingFirstName.value ?? '';
  }
  fcShippingSecondName = new FormControl('');
  get shippingSecondName() {
    return this.fcShippingSecondName.value ?? '';
  }
  fcShippingLastName = new FormControl('', [Validators.required]);
  get shippingLastName() {
    return this.fcShippingLastName.value ?? '';
  }
  fcShippingState = new FormControl('', [Validators.required]);
  fcShippingCity = new FormControl('', [Validators.required]);
  fcEmail = new FormControl('', [Validators.required]);

  fgShipping = new FormGroup({
    kindOfPerson: this.fcShippingKindOfPerson,
    nationalId: this.fcShippingNationalId,
    fullName: this.fcShippingFullName,
    firstName: this.fcShippingFirstName,
    secondName: this.fcShippingSecondName,
    lastName: this.fcShippingLastName,

    address: new FormControl('', [Validators.required]),
    city: this.fcShippingCity,
    state: this.fcShippingState,
    phoneNumber: new FormControl('', [Validators.required]),
  });

  get shippingAddress() {
    return this.fgShipping.controls.address.value;
  }

  get shippingData() {
    return {
      ...this.fgShipping.value,
      state: this.fcShippingState.value,
      fullName: this.shippingFullname,
    } as IShippingData;
  }
  set shippingData(shippingData: IShippingData) {
    const { cost, ...rest } = shippingData;
    this.fgShipping.patchValue(rest, { emitEvent: false });
  }
  #shippingDataIsValid = false;
  get shippingDataIsValid() {
    return this.#shippingDataIsValid;
  }
  set shippingDataIsValid(isValid) {
    this.#shippingDataIsValid = isValid;
  }

  fcKindOfPerson = new FormControl<'PERSON_ENTITY' | 'LEGAL_ENTITY'>('PERSON_ENTITY', [
    Validators.required,
  ]);
  fcNationalId = new FormControl('', [Validators.required]);
  fcFullName = new FormControl('', [Validators.required]);
  get fullname() {
    return this.fcFullName.value ?? '';
  }
  fcFirstName = new FormControl('', [Validators.required]);
  get firstName() {
    return this.fcFirstName.value ?? '';
  }
  fcSecondName = new FormControl('');
  get secondName() {
    return this.fcSecondName.value ?? '';
  }
  fcLastName = new FormControl('', [Validators.required]);
  get lastName() {
    return this.fcLastName.value ?? '';
  }
  fcAddress = new FormControl('', [Validators.required]);
  fcState = new FormControl('', [Validators.required]);
  fcCity = new FormControl('', [Validators.required]);
  fcPhoneNumber = new FormControl('', [Validators.required]);
  get phoneNumber() {
    return this.fcPhoneNumber.value;
  }
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

  get facturationData() {
    return {
      ...this.fgFacturation.value,
      fullName: this.fullname,
      state: this.fcState.value,
    } as IFacturationData;
  }
  set facturationData(facturationData: IFacturationData) {
    this.fgFacturation.patchValue(facturationData, { emitEvent: false });
    this.fcCity.patchValue(facturationData['city'] ?? '');
    db.facturationData.upsert(<string>facturationData['nationalId'], facturationData);
  }
  get facturationDataFromDraft() {
    return this.facturationData$.getValue?.();
  }
  get facturationDataIsValid() {
    return this.fgFacturation.valid;
  }

  #transactionId: string | null = null;
  get transactionId() {
    return this.#transactionId;
  }
  set transactionId(value) {
    this.#transactionId = value;
  }

  constructor() {
    this.getDraft();

    // Shipping Value Changes
    this.fcShippingKindOfPerson.valueChanges.subscribe((kindOfPerson) => {
      this.fgFacturation.reset({ kindOfPerson });
      if (!kindOfPerson) return;
      if (kindOfPerson === 'LEGAL_ENTITY') {
        this.fcShippingFirstName.disable();
        this.fcShippingSecondName.disable();
        this.fcShippingLastName.disable();

        this.fcShippingFullName.enable();
        this.fcShippingFullName.addValidators(Validators.required);
      }
      if (kindOfPerson === 'PERSON_ENTITY') {
        this.fcShippingFullName.disable();

        this.fcShippingFirstName.enable();
        this.fcShippingFirstName.addValidators(Validators.required);

        this.fcShippingSecondName.enable();

        this.fcShippingLastName.enable();
        this.fcShippingLastName.addValidators(Validators.required);
      }
    });
    this.fcShippingFirstName.valueChanges.subscribe((value) => {
      this.fcShippingFullName.patchValue(
        `${value ?? ''} ${this.shippingSecondName} ${this.shippingLastName}`
      );
    });
    this.fcShippingSecondName.valueChanges.subscribe((value) => {
      this.fcShippingFullName.patchValue(
        `${this.shippingFirstName} ${value ?? ''} ${this.shippingLastName}`
      );
    });
    this.fcShippingLastName.valueChanges.subscribe((value) => {
      this.fcShippingFullName.patchValue(
        `${this.shippingFirstName} ${this.shippingSecondName} ${value ?? ''}`
      );
    });

    // Facturation Value Changes
    this.fcKindOfPerson.valueChanges.subscribe((kindOfPerson) => {
      this.fgFacturation.reset({ kindOfPerson }, {emitEvent: false});
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
  }

  async getDraft() {
    const draftCart = await db.cart.toArray();
    this.cart.products = draftCart;
  }

  hasProduct(uuid: string) {
    return this.cart.products.some(({ uuid: _uuid }) => uuid === _uuid);
  }

  async addProduct(productCart: IProductCart) {
    if (this.hasProduct(productCart.uuid)) await this.patchProduct(productCart.uuid, productCart);
    else {
      await db.cart.add(productCart);
      this.cart.products.push(productCart);
    }
  }

  async patchProduct(uuid: string, productCart: Partial<IProductCart>) {
    let product = this.cart.products.find(({ uuid: _uuid }) => uuid === _uuid);
    if (!product) throw new Error('Producto no válido para actualización.');

    if ('amount' in productCart && productCart.amount) {
      productCart.amount = product.amount + productCart.amount;
    } else {
      productCart.amount = product.amount + 1;
    }

    product = Object.assign(product, productCart);
    await db.cart.update(product.uuid, {
      name: product.name,
      description: product.description,
      amount: product.amount,
      price: product.price,
      quantityAvalible: product.quantityAvalible,
      imagesUrl: product.imagesUrl,
    });
  }

  async deleteProduct(uuid: string) {
    if (this.hasProduct(uuid)) {
      const productIndex = this.cart.products.findIndex(({ uuid: _uuid }) => _uuid === uuid);
      await db.cart.delete(uuid);

      this.cart.products.splice(productIndex, 1);
    }
  }

  async deleteProducts(uuids: string[]) {
    await Promise.all(uuids.map((uuid) => this.deleteProduct(uuid)));
  }
}
