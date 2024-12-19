'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface AiResponseProps {
  isThinking: boolean;
  suggestion: string;
  isInitialPrompt?: boolean;
}

export function AiResponse({
  isThinking,
  suggestion,
  isInitialPrompt = false,
}: AiResponseProps) {
  if (!isThinking && !suggestion) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-6 right-6 z-50"
      >
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
      </motion.div>
    </AnimatePresence>
  );
}
