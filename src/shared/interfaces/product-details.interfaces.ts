export interface ICategory {
  id: string;
  name: string;
}

export interface IItemCategory {
  id: number;
  name: string;
  description: string;
  status: string;
}

export interface ICurrency {
  code: string;
  symbol: string;
}

export interface IPrice {
  idPriceList: string;
  name: string;
  type: string;
  price: number;
  currency: ICurrency;
  main: boolean;
  edited: boolean;
}

export interface IWarehouse {
  name: string;
  observations: string | null;
  isDefault: boolean;
  status: string;
  id: string;
  costCenter: string | null;
  address: string;
  initialQuantity: number;
  availableQuantity: number;
  minQuantity: number | null;
  maxQuantity: number | null;
}

export interface IInventory {
  initialQuantity: number;
  initialQuantityDate: string;
  unit: string;
  unitCost: number;
  availableQuantity: number;
  warehouses: IWarehouse[];
}

export interface ICategoryRule {
  id: string;
  name: string;
  key: string;
}

export interface IAccountingCategory {
  id: string;
  idParent: string;
  name: string;
  text: string;
  code: string | null;
  description: string;
  type: string;
  readOnly: boolean;
  nature: string;
  blocked: string;
  status: string;
  categoryRule: ICategoryRule;
  use: string;
  showThirdPartyBalance: boolean;
}

export interface IAccounting {
  inventory: IAccountingCategory;
  inventariablePurchase: IAccountingCategory;
}

export interface ITax {
  // Define según sea necesario si hay estructura en otros objetos
}

export interface IImage {
  id: number;
  name: string;
  url: string;
  favorite: boolean;
}

export interface ICustomField {
  // Define según sea necesario si hay estructura
}

export interface IProduct {
  id: string;
  category: ICategory;
  hasNoIvaDays: boolean;
  itemCategory: IItemCategory;
  name: string;
  description: string;
  reference: string;
  status: string;
  calculationScale: number;
  price: IPrice[];
  inventory: IInventory;
  accounting: IAccounting;
  tax: ITax[];
  images: IImage[];
  customFields: ICustomField[];
  productKey: string | null;
  type: string;
  itemType: string | null;
}
