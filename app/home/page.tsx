'use client';

import { useEntriesStore } from '@/lib/store/entries';
import { useEffect, useState } from 'react';
import { EntryCard } from '@/components/entry-card';
import { PlusCircle } from 'lucide-react';
import { WelcomeGuide } from '@/components/welcome-guide';
import { ImageUploadPrompt } from '@/components/image-upload-prompt';

export default function Home() {
  const { entries, isHydrated } = useEntriesStore();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    const isFromLanding = sessionStorage.getItem('isFromLanding');

    if (!hasSeenWelcome && isFromLanding) {
      setShowWelcome(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }

    sessionStorage.removeItem('isFromLanding');
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {showWelcome && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <WelcomeGuide onDismiss={() => setShowWelcome(false)} />
        </div>
      )}

      {showImageUpload && (
        <div className="fixed inset-0 bg-stone-950 z-50">
          <ImageUploadPrompt onClose={() => setShowImageUpload(false)} />
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-stone-950/80 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-medium">Memento</h1>
          <button
            onClick={() => setShowImageUpload(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-800 hover:bg-stone-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Entry</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl text-stone-300 mb-4">No entries yet</h2>
            <p className="text-stone-400">
              Click the "New Entry" button above to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
