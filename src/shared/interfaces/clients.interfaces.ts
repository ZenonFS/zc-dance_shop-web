export interface IClient {
  id: string;
  uuid: string;
  name: string;
  nameObject?: {
    firstName: string;
    secondName: string | null;
    lastName: string;
    secondLastName: string | null;
  };
  identification: string;
  phonePrimary: string;
  phoneSecondary: string | null;
  mobile: string;
  email: string;
  status: string;
  type: string[];
  address: {
    zipCode: string | null;
    department: string | null;
    country: string | null;
    address: string | null;
    city: string | null;
  };
  term: string | null;
  seller: string | null;
  priceList: string | null;
  statementAttached: boolean;
  fax: string | null;
  observations: string | null;
  accounting: {
    accountReceivable: string | null;
    debtToPay: string | null;
  };
  created_at: string;
  updated_at: string;
  branchOffices: any[]; // se puede tipar más si se conoce la estructura
  attachmentsTotal: number;
  creditLimit: number | null;
  identificationObject: {
    dv: string | null;
    type: string;
    number: string;
  };
  kindOfPerson: string;
  regime: string;
  fiscalResponsabilities: any[]; // idem: se puede especificar
  settings: {
    sendElectronicDocuments: boolean;
  };
  enableHealthSector: boolean;
  healthPatients: any | null;
  fiscalResidence: any | null;
}

export interface ICreateContact {
  kindOfPerson: 'LEGAL_ENTITY' | 'PERSON_ENTITY';
  name?: string;
  nameObject?: {
    firstName: string;
    secondName?: string;
    lastName: string;
  };
  identificationObject: {
    type: 'CC';
    number: string;
  };
  mobile: string;
  email: string;
  address?: {
    country: string;
    address: string;
    city: string;
    department: string;
  };
  accounting: {
    accountReceivable: 5008;
    debtToPay: 5070;
  };
  regime: 'COMMON_REGIME';
  type: 'client';
  status: 'active';
  ignoreRepeated: true;
  statementAttached: 'yes';
}

export type CreateContactDTO = Omit<
  ICreateContact,
  'status' | 'type' | 'statementAttached' | 'ignoreRepeated' | 'accounting' | 'regime'
>;

export type UpdateContactDTO = Partial<
  Omit<
    ICreateContact,
    'status' | 'type' | 'statementAttached' | 'ignoreRepeated' | 'accounting' | 'regime'
  >
>;
