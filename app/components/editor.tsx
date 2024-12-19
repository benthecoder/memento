'use client';

import { useState, useEffect } from 'react';
import { useEntriesStore, JournalEntry } from '@/lib/store/entries';
import { useDebounce } from '@/hooks/use-debounce';
import { getAmbientResponse } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ImageIcon, ChevronRight } from 'lucide-react';

interface MinimalEditorProps {
  entry: JournalEntry;
}

export function MinimalEditor({ entry }: MinimalEditorProps) {
  const { updateEntry } = useEntriesStore();
  const [suggestion, setSuggestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isContextBarOpen, setIsContextBarOpen] = useState(false);

  // Get initial prompt when component mounts with images but no content
  useEffect(() => {
    const hasImages = entry.imageContexts.length > 0;
    const isEmpty = !entry.content.trim();

    if (hasImages && isEmpty) {
      setIsThinking(true);
      getAmbientResponse('', entry.imageContexts)
        .then((response) => {
          setSuggestion(response);
        })
        .catch((error) => {
          console.error('Failed to get initial suggestion:', error);
        })
        .finally(() => {
          setIsThinking(false);
        });
    }
  }, [entry.imageContexts, entry.content]);

  // Handle ongoing content changes
  const handleContentChange = useDebounce(async (content: string) => {
    if (content.length < 50) return;

    setIsThinking(true);
    try {
      // Only pass content for ongoing suggestions
      const response = await getAmbientResponse(content, []);
      setSuggestion(response);
    } catch (error) {
      console.error('Failed to get suggestion:', error);
    } finally {
      setIsThinking(false);
    }
  }, 1000);

  const renderSuggestion = () => {
    const isInitialPrompt = !entry.content.trim();
    return (
      <div
        className={`bg-stone-800/90 backdrop-blur-sm rounded-xl p-4 
                   border border-amber-800/20 ${
                     isInitialPrompt ? 'max-w-xl' : 'max-w-sm'
                   }`}
      >
        {isThinking ? (
          <div className="flex items-center gap-2">
            <div className="animate-pulse">Thinking</div>
            <div className="flex gap-1">
              <div
                className="w-1 h-1 rounded-full bg-stone-400 animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <div
                className="w-1 h-1 rounded-full bg-stone-400 animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <div
                className="w-1 h-1 rounded-full bg-stone-400 animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        ) : (
          <p
            className={`text-stone-300 ${
              isInitialPrompt ? 'text-lg' : 'text-base'
            }`}
          >
            {suggestion}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1C1917] text-stone-100">
      {/* Context Toggle Button */}
      <button
        onClick={() => setIsContextBarOpen(!isContextBarOpen)}
        className="fixed right-4 top-4 flex items-center gap-2 px-3 py-1.5 
             bg-stone-800/90 hover:bg-stone-700/90 rounded-full 
             border border-amber-800/20 backdrop-blur-sm transition-all
             z-50"
      >
        <ImageIcon className="w-4 h-4" />
        <span className="text-sm">{entry.imageContexts.length}</span>
        <ChevronRight
          className={`w-4 h-4 transition-transform ${
            isContextBarOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Context Bar */}
      <AnimatePresence>
        {isContextBarOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-4 top-16 w-96 bg-stone-900/95 border 
                 border-amber-800/20 rounded-lg shadow-xl backdrop-blur-sm
                 z-50"
          >
            <div className="flex flex-col h-screen">
              {/* Scrollable image container */}
              <div className="p-3 overflow-y-auto flex-1">
                <div className="grid gap-3">
                  {entry.imageContexts.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[3/2] rounded-md overflow-hidden"
                    >
                      <Image
                        src={img.url}
                        alt=""
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Editor */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        <input
          type="text"
          value={entry.title}
          onChange={(e) => updateEntry(entry.id, { title: e.target.value })}
          className="w-full text-3xl font-light bg-transparent border-none 
                   focus:outline-none mb-8"
          placeholder="Untitled Entry"
        />

        <textarea
          value={entry.content}
          onChange={(e) => {
            const newContent = e.target.value;
            updateEntry(entry.id, { content: newContent });
            handleContentChange(newContent);
          }}
          className="w-full min-h-[calc(100vh-12rem)] bg-transparent text-lg 
                   resize-none focus:outline-none font-light leading-relaxed"
          placeholder="Start writing about these moments..."
        />

        {/* AI Suggestion */}
        <AnimatePresence>
          {(isThinking || suggestion) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 right-8"
            >
              {renderSuggestion()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
