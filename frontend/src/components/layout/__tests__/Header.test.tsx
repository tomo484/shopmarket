/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '../Header';


jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));


jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const { useAuth } = require('@/hooks/useAuth');

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, component)
  );
};

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login and signup links when not logged in', () => {
    useAuth.mockReturnValue({
      isLoggedIn: false,
      logout: jest.fn(),
    });

    renderWithQueryClient(React.createElement(Header));
    
    expect(screen.getByText('ログイン')).toBeInTheDocument();
    expect(screen.getByText('サインアップ')).toBeInTheDocument();
    expect(screen.queryByText('ログアウト')).not.toBeInTheDocument();
  });

  it('should render logout button when logged in', () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      isLoggedIn: true,
      logout: mockLogout,
    });

    renderWithQueryClient(React.createElement(Header));
    
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
    expect(screen.getByText('ログアウト')).toBeInTheDocument();
    expect(screen.queryByText('ログイン')).not.toBeInTheDocument();
  });

  it('should call logout when logout button is clicked', () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      isLoggedIn: true,
      logout: mockLogout,
    });

    renderWithQueryClient(React.createElement(Header));
    
    const logoutButton = screen.getByText('ログアウト');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
