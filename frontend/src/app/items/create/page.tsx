'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateItem } from '@/hooks/useItems';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/layout/Header';

const createItemSchema = z.object({
  name: z.string().min(2, '商品名は2文字以上で入力してください'),
  price: z.number().min(1, '価格は1円以上で入力してください').max(999999, '価格は999,999円以下で入力してください'),
  description: z.string().optional(),
});

type CreateItemForm = z.infer<typeof createItemSchema>;

export default function CreateItemPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const createItemMutation = useCreateItem();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateItemForm>({
    resolver: zodResolver(createItemSchema),
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const onSubmit = (data: CreateItemForm) => {
    createItemMutation.mutate(data, {
      onSuccess: (item) => {
        router.push(`/items/${item.ID}`);
      },
    });
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">新しいアイテムを出品</h1>
            <p className="text-gray-600 mt-2">商品情報を入力してください</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                商品名 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="商品名を入力してください"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                価格（円） <span className="text-red-500">*</span>
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                min="1"
                max="999999"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="1000"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                商品説明
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="商品の詳細な説明を入力してください（任意）"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {createItemMutation.error && (
              <div className="text-sm text-red-600">
                出品に失敗しました。入力内容を確認してください。
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={createItemMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {createItemMutation.isPending ? '出品中...' : '出品する'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

