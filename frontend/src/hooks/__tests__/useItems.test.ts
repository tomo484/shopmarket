/// <reference types="jest" />
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useItems, useCreateItem } from '../useItems';
import api from '@/lib/api';


jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

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

describe('useItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch items successfully', async () => {
    const mockItems = [
      { ID: 1, Name: 'Test Item', Price: 1000, Description: 'Test', SoldOut: false },
    ];
    mockedApi.get.mockResolvedValueOnce({ data: { data: mockItems } });
    
    const { result } = renderHook(() => useItems(), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    
    expect(mockedApi.get).toHaveBeenCalledWith('/items');
    expect(result.current.data).toEqual({ data: mockItems });
  });
});

describe('useCreateItem', () => {
  it('should create item successfully', async () => {
    const mockItem = { ID: 1, Name: 'New Item', Price: 1000, Description: 'New' };
    mockedApi.post.mockResolvedValueOnce({ data: { data: mockItem } });
    
    const { result } = renderHook(() => useCreateItem(), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.mutate).toBeDefined();
    expect(mockedApi.post).not.toHaveBeenCalled();
  });
});
