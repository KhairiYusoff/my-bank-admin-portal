export type ThemePreference = 'light' | 'dark' | 'system';

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

export interface UserPreferences extends UpdatePreferencesRequest {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
