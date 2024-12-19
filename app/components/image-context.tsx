'use client';

import { ImageIcon } from 'lucide-react';
import { ImageContext as ImageContextType } from '@/lib/store/entries';

interface ImageContextProps {
  images: ImageContextType[];
  isOpen: boolean;
  onToggle: () => void;
}

export function ImageContext({ images, isOpen, onToggle }: ImageContextProps) {
  return (
    <>
      {/* Context Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed right-8 bottom-8 flex items-center justify-center
           w-14 h-14 bg-surface-secondary/90 
           hover:bg-surface-hover/90 
           rounded-full border border-accent-muted 
           backdrop-blur-sm transition-all z-50
           shadow-lg hover:scale-105 active:scale-95"
      >
        <div className="relative">
          <ImageIcon
            className={`w-6 h-6 transition-transform ${
              isOpen ? 'rotate-45' : ''
            }`}
          />
          {images.length > 0 && (
            <span
              className="absolute -top-2 -right-2 
                    w-5 h-5 flex items-center justify-center
                    bg-accent rounded-full text-xs font-medium
                    text-text-inverse"
            >
              {images.length}
            </span>
          )}
        </div>
      </button>
    </>
  );
}
