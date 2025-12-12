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

  readonly #defaultValueShippingCost = 12000;
  #shippingCost = this.#defaultValueShippingCost;
  get shippingCost() {
    return this.#shippingCost === 0 || this.cartTotalPrice > 4000000 ? 0 : this.#shippingCost;
  }
  set shippingCost(value: number) {
    this.#shippingCost = value;
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

  fcShippingState = new FormControl('', [Validators.required]);
  fcShippingCity = new FormControl('', [Validators.required]);

  fgShipping = new FormGroup({
    address: new FormControl('', [Validators.required]),
    city: this.fcShippingCity,
    state: this.fcShippingState,
    phoneNumber: new FormControl('', [Validators.required]),
  });

  get shippingData() {
    return this.fgShipping.value as IShippingData;
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
  fcFirstName = new FormControl('', [Validators.required]);
  fcSecondName = new FormControl('');
  fcLastName = new FormControl('', [Validators.required]);
  fcAddress = new FormControl('', [Validators.required]);
  fcState = new FormControl('', [Validators.required]);
  fcCity = new FormControl('', [Validators.required]);
  fcPhoneNumber = new FormControl('', [Validators.required]);
  fcEmail = new FormControl('', [Validators.required]);
  fcUseShippingData = new FormControl(false, [Validators.required]);

  fgFacturation = new FormGroup({
    useShippingData: this.fcUseShippingData,
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
    return this.fgFacturation.value as IFacturationData;
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
