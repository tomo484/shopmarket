'use client';

import { useAuth } from '@/hooks/useAuth';
import { useItems, useDeleteItem } from '@/hooks/useItems';
import { formatPrice, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { data: items, isLoading, error } = useItems();
  const deleteItemMutation = useDeleteItem();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const handleDelete = async (itemId: number, itemName: string) => {
    if (confirm(`「${itemName}」を削除しますか？`)) {
      deleteItemMutation.mutate(itemId);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ヘッダーセクション */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ダッシュボード</h1>
          <p className="text-gray-600">あなたが出品したアイテムを管理できます</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">総出品数</h3>
            <p className="text-3xl font-bold text-blue-600">{items?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">販売中</h3>
            <p className="text-3xl font-bold text-green-600">
              {items?.filter(item => !item.SoldOut).length || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">売り切れ</h3>
            <p className="text-3xl font-bold text-red-600">
              {items?.filter(item => item.SoldOut).length || 0}
            </p>
          </div>
        </div>

        {/* アイテム一覧 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">マイアイテム</h2>
            <Link
              href="/items/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              新しいアイテムを追加
            </Link>
          </div>

          {isLoading && (
            <div className="p-8 text-center">
              <div className="text-gray-600">読み込み中...</div>
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <div className="text-red-600">エラーが発生しました</div>
            </div>
          )}

          {items && items.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-600 mb-4">まだアイテムがありません</div>
              <Link
                href="/items/create"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                最初のアイテムを出品する
              </Link>
            </div>
          )}

          {items && items.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      商品名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      価格
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作成日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/items/${item.ID}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {item.Name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(item.Price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.SoldOut ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            売り切れ
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            販売中
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.CreatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/items/edit/${item.ID}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          編集
                        </Link>
                        <button
                          onClick={() => handleDelete(item.ID, item.Name)}
                          disabled={deleteItemMutation.isPending}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

