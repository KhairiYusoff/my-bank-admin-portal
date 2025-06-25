// Common Types
export interface BaseResponse {
  success: boolean;
  message: string;
  errors?: any;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Preferences {
  theme: string;
  language: string;
  notifications: boolean;
}

export interface NextOfKin {
  name: string;
  phone: string;
  relationship: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  applicationStatus: string;
  isVerified: boolean;
  isProfileComplete: boolean;
  role: string;
  address: Address;
  preferences: Preferences;
  nextOfKin: NextOfKin;
  accountType?: string;
  age?: number;
  dateOfBirth?: string;
  educationLevel?: string;
  employerName?: string;
  employmentType?: string;
  identityNumber?: string;
  job?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UsersResponse extends BaseResponse {
  data: User[];
  meta: UsersMeta;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  search?: string;
  status?: string;
  role?: string;
}
