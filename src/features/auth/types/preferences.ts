import { BaseResponse } from '@/features/users/types';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemePreference;
  language: string;
  timezone: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface UpdatePreferencesRequest {
  theme?: ThemePreference;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
}

export interface UserPreferencesResponse extends BaseResponse {
  data: UserPreferences;
}

export interface UpdatePreferencesResponse extends BaseResponse {
  data: UserPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface UpdateNotificationPreferencesRequest {
  email?: boolean;
  push?: boolean;
  sms?: boolean;
}
