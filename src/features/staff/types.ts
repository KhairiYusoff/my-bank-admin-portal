import { BaseResponse } from '@/features/users/types';

export type StaffRole = 'admin' | 'banker';

export interface StaffMember {
  _id: string;
  name: string;
  email: string;
  role: StaffRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  applicationStatus: string;
  isVerified: boolean;
  isProfileComplete: boolean;
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

export interface StaffQueryParams {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  status?: string;
  role?: StaffRole;
}
