import { Address } from './address.model';

export interface UserProfile {
  id?: string;
  email: string;
  username: string;
  password: string;
  name: string;
  lastname: string;
  enabled: boolean;
  address: Address;
}
