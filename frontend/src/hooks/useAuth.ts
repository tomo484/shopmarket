import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { setAuthToken, removeAuthToken, isAuthenticated } from '@/lib/auth';
import { LoginRequest, SignupRequest, AuthResponse } from '@/types/auth';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      setIsLoggedIn(true);
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupRequest): Promise<AuthResponse> => {
      // サインアップ後に自動ログイン
      await api.post('/auth/signup', data);
      const loginResponse = await api.post('/auth/login', data);
      return loginResponse.data;
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      setIsLoggedIn(true);
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const logout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    queryClient.clear();
  };

  return {
    isLoggedIn,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
  };
};
