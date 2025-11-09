/// <reference types="jest" />
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import api from '@/lib/api';


jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;


jest.mock('@/lib/auth', () => ({
  setAuthToken: jest.fn(),
  removeAuthToken: jest.fn(),
  isAuthenticated: jest.fn(() => false),
}));

const { setAuthToken, removeAuthToken, isAuthenticated } = require('@/lib/auth');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct login state', () => {
    isAuthenticated.mockReturnValue(true);
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.isLoggedIn).toBe(true);
  });

  it('should handle successful login', async () => {
    const mockResponse = { data: { token: 'test-token' } };
    mockedApi.post.mockResolvedValueOnce(mockResponse);
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    await act(async () => {
      result.current.login({ email: 'test@example.com', password: 'password' });
    });
    
    expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should handle successful signup with auto-login', async () => {
    const mockSignupResponse = { data: {} };
    const mockLoginResponse = { data: { token: 'test-token' } };
    
    mockedApi.post
      .mockResolvedValueOnce(mockSignupResponse) 
      .mockResolvedValueOnce(mockLoginResponse); 
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    await act(async () => {
      result.current.signup({ email: 'test@example.com', password: 'password' });
    });
    
    expect(mockedApi.post).toHaveBeenCalledTimes(2);
    expect(mockedApi.post).toHaveBeenNthCalledWith(1, '/auth/signup', {
      email: 'test@example.com',
      password: 'password',
    });
    expect(mockedApi.post).toHaveBeenNthCalledWith(2, '/auth/login', {
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should handle logout', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    act(() => {
      result.current.logout();
    });
    
    expect(removeAuthToken).toHaveBeenCalled();
    expect(result.current.isLoggedIn).toBe(false);
  });
});
