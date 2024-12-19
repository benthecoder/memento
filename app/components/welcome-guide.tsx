'use client';

import { motion } from 'framer-motion';

interface WelcomeGuideProps {
  onDismiss: () => void;
}

export function WelcomeGuide({ onDismiss }: WelcomeGuideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="relative max-w-xl w-full bg-[#1C1917]/95 backdrop-blur-sm rounded-3xl overflow-hidden p-8 shadow-2xl border border-amber-800/20"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-serif text-stone-100">
            Welcome to Memento
          </h1>
          <p className="text-stone-200 text-lg">
            Your personal space for mindful reflection and journaling
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#292524] border border-amber-900/20 hover:bg-[#2b2523] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-stone-700/50 flex items-center justify-center text-xl">
                  ✍️
                </span>
                <span className="text-white font-medium">Express</span>
              </div>
              <p className="text-stone-300 text-sm leading-relaxed">
                Write freely with AI-powered guidance to deepen your reflections
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#292524] border border-amber-900/20 hover:bg-[#2b2523] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-stone-700/50 flex items-center justify-center text-xl">
                  🖼️
                </span>
                <span className="text-white font-medium">Capture</span>
              </div>
              <p className="text-stone-300 text-sm leading-relaxed">
                Add images to preserve moments that inspire your writing
              </p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="w-full bg-amber-100 hover:bg-amber-50 text-stone-900 
                     rounded-xl py-4 font-medium text-lg
                     transition-colors duration-200"
          >
            Start Writing
          </button>
        </div>
      </div>
    </motion.div>
  );
}
