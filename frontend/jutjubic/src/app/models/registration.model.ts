import { Address } from './address.model';

export interface Registration {
  email: string;
  username: string;
  password: string;
  repeatPassword: string;
  name: string;
  lastname: string;
  address: Address;
}
