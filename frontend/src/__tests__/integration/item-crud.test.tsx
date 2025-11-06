/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateItemPage from '@/app/items/create/page';
import api from '@/lib/api';

// APIのモック
jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

// Next.jsのuseRouterのモック
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// 認証ヘルパー関数のモック
jest.mock('@/lib/auth', () => ({
  isAuthenticated: jest.fn(() => true),
}));

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

describe('Item CRUD Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle item creation flow', async () => {
    const mockResponse = { 
      data: { 
        data: { 
          ID: 1, 
          Name: 'Test Item', 
          Price: 1000, 
          Description: 'Test Description' 
        } 
      } 
    };
    mockedApi.post.mockResolvedValueOnce(mockResponse);
    
    renderWithQueryClient(React.createElement(CreateItemPage));
    
    // フォーム入力
    const nameInput = screen.getByLabelText('商品名');
    const priceInput = screen.getByLabelText('価格');
    const descriptionInput = screen.getByLabelText('説明');
    const submitButton = screen.getByRole('button', { name: '作成' });
    
    fireEvent.change(nameInput, { target: { value: 'Test Item' } });
    fireEvent.change(priceInput, { target: { value: '1000' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);
    
    // API呼び出しの確認
    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith('/items', {
        name: 'Test Item',
        price: 1000,
        description: 'Test Description',
      });
    });
  });

  it('should display validation errors for invalid input', async () => {
    renderWithQueryClient(React.createElement(CreateItemPage));
    
    const submitButton = screen.getByRole('button', { name: '作成' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('商品名は必須です')).toBeInTheDocument();
      expect(screen.getByText('価格は必須です')).toBeInTheDocument();
    });
  });
});
