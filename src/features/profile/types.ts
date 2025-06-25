import { BaseResponse } from "@/features/users/types";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
  isVerified: boolean;
  role: string;
  isProfileComplete: boolean;
  applicationStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface UpdatePreferencesRequest {
  theme: string;
  language: string;
  notifications: boolean;
}

export interface UserPreferences extends UpdatePreferencesRequest {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse extends BaseResponse {
  data: UserProfile;
}

export interface PreferencesResponse extends BaseResponse {
  data: UserPreferences;
}
