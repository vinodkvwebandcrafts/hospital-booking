/**
 * Navigation parameter types used throughout the app.
 * With expo-router these are mainly used for type-safe linking.
 */
export type RootStackParamList = {
  '(auth)': undefined;
  '(authenticated)': undefined;
};

export type AuthStackParamList = {
  login: undefined;
};

export type DoctorTabsParamList = {
  index: undefined;
  'appointments/index': undefined;
  'appointments/[id]': { id: string };
  'patients/index': undefined;
  'patients/[id]': { id: string };
  profile: undefined;
};

export type AdminTabsParamList = {
  index: undefined;
  'doctors/index': undefined;
  'doctors/[id]': { id: string };
  'appointments/index': undefined;
  'appointments/[id]': { id: string };
  settings: undefined;
};
