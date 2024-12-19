'use client';

import { Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { ImageContext as ImageContextType } from '@/lib/store/entries';
import { useState } from 'react';

interface ImageContextProps {
  images: ImageContextType[];
}

export function ImageContext({ images }: ImageContextProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-stone-400 hover:text-stone-300 transition-colors"
      >
        <ImageIcon className="w-4 h-4" />
        <span className="text-sm">{images.length}</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-y-0 right-0 w-72 bg-stone-900/95 border-l border-amber-800/20 
                    backdrop-blur-sm shadow-xl z-50 overflow-y-auto"
        >
          <div className="sticky top-0 bg-stone-900/95 backdrop-blur-sm p-4 border-b border-amber-800/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Images</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
