'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ImageContext } from '@/types';

interface ImagePreviewProps {
  images: ImageContext[];
  isOpen: boolean;
}

export function ImagePreview({ images, isOpen }: ImagePreviewProps) {
  // Calculate dynamic width based on number of images
  const getContainerWidth = () => {
    if (images.length === 1) return 'w-60'; // Single image width
    if (images.length === 2) return 'max-w-xl'; // 2 images
    return 'w-[calc(100vw-4rem)] max-w-3xl'; // 3+ images
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed right-8 bottom-24 ${getContainerWidth()} 
                   bg-surface-overlay border border-accent-muted 
                   rounded-lg shadow-xl backdrop-blur-sm z-50 overflow-hidden`}
        >
          <div className="flex gap-2 p-2">
            {' '}
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative h-40 flex-1 rounded-xl overflow-hidden " // Changed to flex-1 and fixed height
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 240px) 100vw, 240px"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
