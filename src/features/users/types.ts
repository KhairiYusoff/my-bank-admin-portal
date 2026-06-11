// Common Types
export type UserStatus = "active" | "suspended" | "terminated";
export type ApplicationStatus =
  | "Pending"
  | "Completed"
  | "Rejected"
  | "Approved";

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
  status: UserStatus;
  applicationStatus: ApplicationStatus;
  isVerified: boolean;
  isProfileComplete: boolean;
  isFirstTime?: boolean;
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
  nationality?: string;
  residencyStatus?: string;
  maritalStatus?: string;
  salary?: string;
  purposeOfAccount?: string;
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

export interface UpdateCustomerRequest {
  status: UserStatus;
}

export interface UpdateCustomerResponse extends BaseResponse {
  data: User;
}

export interface DeleteCustomerResponse extends BaseResponse {}

export interface GetCustomerByIdResponse extends BaseResponse {
  data: User;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  search?: string;
  status?: string;
  role?: string;
}
