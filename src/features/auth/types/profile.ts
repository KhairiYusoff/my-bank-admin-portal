import { BaseResponse } from '@/features/users/types';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: string;
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
  isProfileComplete: boolean;
  applicationStatus: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface ProfileResponse extends BaseResponse {
  data: {
    user: UserProfile;
  };
}

export interface UpdateProfileResponse extends BaseResponse {
  data: UserProfile;
}
