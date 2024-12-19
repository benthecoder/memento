'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ImageContext } from '@/types';

interface ImagePreviewProps {
  images: ImageContext[];
  isOpen: boolean;
}

export function ImagePreview({ images, isOpen }: ImagePreviewProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed right-8 bottom-24 w-[calc(100vw-4rem)] max-w-3xl bg-surface-overlay
                   border border-accent-muted rounded-lg shadow-xl 
                   backdrop-blur-sm z-50"
        >
          <div className="p-3 overflow-x-auto">
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-60 aspect-[3/2] flex-shrink-0 rounded-md overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                    sizes="240px"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
