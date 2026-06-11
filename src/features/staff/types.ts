import { BaseResponse } from "@/features/users/types";

export type StaffRole = "admin" | "banker";
export type StaffStatus = "active" | "suspended" | "terminated";

export interface StaffMember {
  _id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: StaffStatus;
  applicationStatus: string;
  isActive: boolean;
  isVerified: boolean;
  isProfileComplete: boolean;
  isFirstTime?: boolean;
  preferences?: {
    language?: string;
    notifications?: boolean;
  };
  passwordChangedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffListResponse extends BaseResponse {
  data: StaffMember[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  password: string;
  role: StaffRole;
  confirmPassword?: string; // Optional since it's only used for form validation
}

export interface CreateStaffResponse extends BaseResponse {
  data: StaffMember;
}

export interface UpdateStaffRequest {
  role?: StaffRole;
  status?: StaffStatus;
}

export interface UpdateStaffResponse extends BaseResponse {
  data: StaffMember;
}

export interface DeleteStaffResponse extends BaseResponse {}

export interface GetStaffByIdResponse extends BaseResponse {
  data: StaffMember;
}

export interface StaffQueryParams {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  status?: string;
  role?: StaffRole;
}
