import Cookies from 'js-cookie';
import { User } from '@/types/auth';

export const setAuthToken = (token: string) => {
  Cookies.set('token', token, { expires: 7 }); 
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get('token');
};

export const removeAuthToken = () => {
  Cookies.remove('token');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
