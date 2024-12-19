'use client';

import { AiResponse } from '@/types';

interface AiResponseProps {
  response: AiResponse | null;
}

export function AiResponseIndicator({ response }: AiResponseProps) {
  if (!response) return null;

  return (
    <div
      className="fixed bottom-24 right-8 max-w-xs bg-white dark:bg-stone-800 
                    rounded-lg shadow-lg p-4 text-sm animate-fade-in border border-stone-200 dark:border-stone-700"
    >
      <div className="flex items-center gap-3">
        {response.type === 'thinking' ? (
          <>
            <div className="flex gap-1">
              <div
                className="animate-bounce w-2 h-2 bg-blue-400 rounded-full"
                style={{ animationDelay: '0ms' }}
              />
              <div
                className="animate-bounce w-2 h-2 bg-blue-400 rounded-full"
                style={{ animationDelay: '150ms' }}
              />
              <div
                className="animate-bounce w-2 h-2 bg-blue-400 rounded-full"
                style={{ animationDelay: '300ms' }}
              />
            </div>
            <span className="text-stone-600 dark:text-stone-300">
              Thinking...
            </span>
          </>
        ) : (
          <div className="text-stone-600 dark:text-stone-300">
            {response.message}
          </div>
        )}
      </div>
    </div>
  );
}
