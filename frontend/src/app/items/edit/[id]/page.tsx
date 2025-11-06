'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useItem, useUpdateItem } from '@/hooks/useItems';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import Header from '@/components/layout/Header';

const updateItemSchema = z.object({
  name: z.string().min(2, '商品名は2文字以上で入力してください'),
  price: z.number().min(1, '価格は1円以上で入力してください').max(999999, '価格は999,999円以下で入力してください'),
  description: z.string().optional(),
  soldOut: z.boolean(),
});

type UpdateItemForm = z.infer<typeof updateItemSchema>;

export default function EditItemPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const itemId = Number(params.id);
  
  const { data: item, isLoading } = useItem(itemId);
  const updateItemMutation = useUpdateItem();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateItemForm>({
    resolver: zodResolver(updateItemSchema),
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (item) {
      reset({
        name: item.Name,
        price: item.Price,
        description: item.Description || '',
        soldOut: item.SoldOut,
      });
    }
  }, [item, reset]);

  const onSubmit = (data: UpdateItemForm) => {
    updateItemMutation.mutate(
      { id: itemId, data },
      {
        onSuccess: () => {
          router.push(`/items/${itemId}`);
        },
      }
    );
  };

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div>
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center text-red-600">アイテムが見つかりません</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">アイテムを編集</h1>
            <p className="text-gray-600 mt-2">商品情報を更新してください</p>
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
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  {...register('soldOut')}
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">売り切れにする</span>
              </label>
            </div>

            {updateItemMutation.error && (
              <div className="text-sm text-red-600">
                更新に失敗しました。入力内容を確認してください。
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={updateItemMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {updateItemMutation.isPending ? '更新中...' : '更新する'}
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

