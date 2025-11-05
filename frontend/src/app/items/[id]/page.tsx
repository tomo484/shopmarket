'use client';

import { useParams, useRouter } from 'next/navigation';
import { useItem, useDeleteItem } from '@/hooks/useItems';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, formatDate } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const itemId = Number(params.id);
  
  const { data: item, isLoading, error } = useItem(itemId);
  const deleteItemMutation = useDeleteItem();

  const handleDelete = async () => {
    if (confirm('このアイテムを削除しますか？')) {
      deleteItemMutation.mutate(itemId, {
        onSuccess: () => {
          router.push('/dashboard');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-red-600">アイテムが見つかりません</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* 画像エリア */}
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">画像なし</span>
              </div>
            </div>
            
            {/* 商品情報エリア */}
            <div className="md:w-1/2 p-8">
              <div className="mb-4">
                {item.SoldOut && (
                  <span className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full mb-2">
                    売り切れ
                  </span>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.Name}</h1>
                <p className="text-4xl font-bold text-blue-600 mb-4">{formatPrice(item.Price)}</p>
              </div>

              {item.Description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">商品説明</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{item.Description}</p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm text-gray-500">出品日: {formatDate(item.CreatedAt)}</p>
              </div>

              {/* 操作ボタン（自分のアイテムの場合のみ表示） */}
              {isLoggedIn && (
                <div className="flex space-x-4">
                  <Link
                    href={`/items/edit/${item.ID}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    編集
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleteItemMutation.isPending}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                  >
                    {deleteItemMutation.isPending ? '削除中...' : '削除'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 戻るボタン */}
        <div className="mt-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← 戻る
          </button>
        </div>
      </div>
    </div>
  );
}

