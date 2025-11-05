'use client';

import Header from '@/components/layout/Header';
import { useItems } from '@/hooks/useItems';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function HomePage() {
  const { data: items, isLoading, error } = useItems();

  return (
    <div>
      <Header />
      
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">あなたの商品を世界に</h1>
            <p className="text-xl mb-8">簡単にアイテムを出品・管理できるプラットフォーム</p>
            <Link
              href="/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              今すぐ始める
            </Link>
          </div>
        </div>
      </div>

      {/* アイテム一覧セクション */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">最新のアイテム</h2>
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="text-gray-600">読み込み中...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-600">エラーが発生しました</div>
          </div>
        )}

        {items && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.ID} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">画像なし</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{item.Name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{formatPrice(item.Price)}</p>
                  {item.Description && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.Description}</p>
                  )}
                  {item.SoldOut && (
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                      売り切れ
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {items && items.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-600">アイテムがありません</div>
          </div>
        )}
      </div>
    </div>
  );
}