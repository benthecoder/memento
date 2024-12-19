'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEntriesStore } from '@/lib/store/entries';
import { ImageUploadPrompt } from '@/components/image-upload-prompt';
import { MinimalEditor } from '@/components/editor';
import { motion, AnimatePresence } from 'framer-motion';

interface WritePageProps {
  params: Promise<{ slug: string }>;
}

export default function WritePage({ params }: WritePageProps) {
  const router = useRouter();
  const { entries, setCurrentEntry, currentEntry, isHydrated } =
    useEntriesStore();
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    if (!isHydrated) return;

    const entry = entries.find((e) => e.id === resolvedParams.slug);
    if (!entry) {
      router.push('/home');
      return;
    }

    setCurrentEntry(entry);
    setIsLoading(false);
  }, [isHydrated, entries, resolvedParams.slug, router, setCurrentEntry]);

  if (!isHydrated || isLoading || !currentEntry) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="min-h-screen bg-[#1C1917] text-stone-100">
      <header className="fixed top-0 left-0 right-0 z-10 backdrop-blur-sm bg-[#1C1917]/80  border-amber-800/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push('/home')}
            className="text-stone-400 hover:text-stone-200 transition-colors"
          >
            ← Back
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {currentEntry.imageContexts.length === 0 ? (
          <ImageUploadPrompt
            key="upload"
            onClose={() => router.push('/home')}
          />
        ) : (
          <MinimalEditor key="editor" entry={currentEntry} />
        )}
      </AnimatePresence>
    </div>
  );
}
