import { Address } from './address.model';
import { User } from './user.model';

export interface RegistrationResponse {
  id: number;
  username: string;
  password: string;
  email: string;
  address: Address;
  name: string;
  lastname: string;
  user: User;
}
