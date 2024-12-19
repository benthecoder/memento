'use client';

import { useEffect, useState } from 'react';
import { useEntriesStore } from '@/lib/store/entries';
import { getAmbientResponse } from '@/lib/api';
import { cn } from '@/lib/utils';

export function AiAssistant() {
  const { currentEntry } = useEntriesStore();
  const [suggestions, setSuggestions] = useState<
    Array<{ id: string; text: string }>
  >([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (!currentEntry?.content || currentEntry.content.length < 50) return;

    const timer = setTimeout(async () => {
      setIsThinking(true);
      try {
        const suggestion = await getAmbientResponse(
          currentEntry.content,
          currentEntry.imageContexts
        );
        setSuggestions((prev) => [
          { id: crypto.randomUUID(), text: suggestion },
          ...prev.slice(0, 4),
        ]);
      } catch (error) {
        console.error('Failed to get suggestion:', error);
      } finally {
        setIsThinking(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentEntry?.content, currentEntry?.imageContexts]);

  return (
    <div className="h-screen p-4 space-y-4">
      <h2 className="text-lg font-medium text-stone-800 dark:text-stone-200">
        AI Assistant
      </h2>

      <div className="space-y-3">
        {isThinking && (
          <div className="p-4 rounded-lg bg-stone-100 dark:bg-stone-800/50">
            <div className="animate-pulse h-4 bg-stone-200 dark:bg-stone-700 rounded" />
          </div>
        )}

        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={cn(
              'p-4 rounded-lg bg-stone-100 dark:bg-stone-800/50',
              'transition-opacity duration-300',
              isThinking ? 'opacity-50' : 'opacity-100'
            )}
          >
            {suggestion.text}
          </div>
        ))}
      </div>
    </div>
  );
}
