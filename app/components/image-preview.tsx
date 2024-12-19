'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { ImageContext } from '@/types';

interface ImagePreviewProps {
  images: ImageContext[];
  onClose: () => void;
}

export function ImagePreview({ images, onClose }: ImagePreviewProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed inset-y-0 right-0 w-72 bg-stone-900/95 border-l 
                 border-amber-800/20 backdrop-blur-sm shadow-xl z-50 overflow-y-auto"
    >
      <div className="sticky top-0 bg-stone-900/95 backdrop-blur-sm p-4 border-b border-amber-800/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Images</h3>
          <button
            onClick={onClose}
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
    </motion.div>
  );
}
