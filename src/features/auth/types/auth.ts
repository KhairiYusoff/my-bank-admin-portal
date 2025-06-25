import { BaseResponse } from '@/features/users/types';
import type { UserProfile } from './profile';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends BaseResponse {
  data: {
    user: UserProfile;
  };
}

export interface LogoutResponse {
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
