'use client';

import ErrorMessage from '@/components/ui/ErrorMessage';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorMessage message="予期しないエラーが発生しました" onRetry={reset} />;
}

