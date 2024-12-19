'use client';

import { useState, useEffect } from 'react';
import { useEntriesStore, JournalEntry } from '@/lib/store/entries';
import { useDebounce } from '@/hooks/use-debounce';
import { getAmbientResponse } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageContext } from './image-context';
import { ImagePreview } from './image-preview';
import { AiResponse } from './ai-response';

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
    if (content.length < 10) return;

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
        className={`bg-surface-overlay backdrop-blur-sm rounded-xl p-4 
                   border border-accent-muted shadow-lg
                   ${isInitialPrompt ? 'max-w-md' : 'max-w-xs'}`}
      >
        {isThinking ? (
          <div className="flex items-center gap-2">
            <div className="animate-pulse text-text-secondary">Thinking</div>
            <div className="flex gap-1">
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce-subtle"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <p
            className={`text-text-secondary ${
              isInitialPrompt ? 'text-body-lg' : 'text-body-md'
            }`}
          >
            {suggestion}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <ImageContext
        images={entry.imageContexts}
        isOpen={isContextBarOpen}
        onToggle={() => setIsContextBarOpen(!isContextBarOpen)}
      />

      <ImagePreview images={entry.imageContexts} isOpen={isContextBarOpen} />

      <AiResponse
        isThinking={isThinking}
        suggestion={suggestion}
        isInitialPrompt={!entry.content.trim()}
      />
      {/* Main Editor */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        <input
          type="text"
          value={entry.title}
          onChange={(e) => updateEntry(entry.id, { title: e.target.value })}
          className="w-full text-display-sm font-light bg-transparent 
          border-none focus:outline-none mb-8 
          text-text-primary placeholder:text-text-muted"
          placeholder="Untitled Entry"
        />

        <textarea
          value={entry.content}
          onChange={(e) => {
            const newContent = e.target.value;
            updateEntry(entry.id, { content: newContent });
            handleContentChange(newContent);
          }}
          className="w-full min-h-[calc(100vh-12rem)] bg-transparent 
          text-body-lg resize-none focus:outline-none 
          font-light leading-relaxed 
          text-text-primary placeholder:text-text-muted"
          placeholder="Start writing about these moments..."
        />

        {/* AI Suggestion */}
        <AnimatePresence>
          {(isThinking || suggestion) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 right-6 z-50" // Changed from top-24 right-8 to top-6 right-6
            >
              {renderSuggestion()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
