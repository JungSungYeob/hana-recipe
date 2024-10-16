'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {}, [error]);

  return (
    <div className='w-xl'>
      <h2>Something went wrong!</h2>
      <pre className='break-words whitespace-pre-wrap' style={{ color: 'red' }}>{error.stack || error.message}</pre>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
