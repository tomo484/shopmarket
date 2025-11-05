import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Item, CreateItemRequest, UpdateItemRequest } from '@/types/item';

export const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: async (): Promise<Item[]> => {
      const response = await api.get('/items');
      return response.data.data;
    },
  });
};

export const useItem = (id: number) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: async (): Promise<Item> => {
      const response = await api.get(`/items/${id}`);
      return response.data.data;
    },
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateItemRequest): Promise<Item> => {
      const response = await api.post('/items', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateItemRequest }): Promise<Item> => {
      const response = await api.put(`/items/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['items', id] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
