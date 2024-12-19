'use client';

import { JournalEntry } from '@/lib/store/entries';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface EntryCardProps {
  entry: JournalEntry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const router = useRouter();
  const hasImages = entry.imageContexts && entry.imageContexts.length > 0;

  // Dynamic grid layout helper
  const getImageLayout = (index: number, total: number) => {
    if (total === 1) {
      return 'w-full h-full';
    }
    if (total === 2) {
      return 'w-1/2 h-full';
    }
    if (total === 3) {
      if (index === 0) {
        return 'w-full h-1/2';
      }
      return 'w-1/2 h-1/2';
    }
    // For 4 images
    return 'w-1/2 h-1/2';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={() => router.push(`/write/${entry.id}`)}
      className="group cursor-pointer"
    >
      <div className="bg-[#1C1917]/95 backdrop-blur-sm rounded-2xl overflow-hidden border border-amber-800/20">
        {/* Image Grid */}
        {hasImages && (
          <div className="aspect-[3/2] relative flex flex-wrap bg-stone-800/50 overflow-hidden">
            {entry.imageContexts.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className={`relative ${getImageLayout(
                  idx,
                  entry.imageContexts.length
                )}`}
              >
                <div className="absolute inset-[0.5px]">
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-cover rounded-[2px]"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="text-sm text-stone-400">
            {format(parseISO(entry.createdAt), 'MMMM d, yyyy')}
          </div>
          <h3 className="text-xl font-medium text-stone-100 group-hover:text-white transition-colors">
            {entry.title}
          </h3>
          <p className="text-sm text-stone-300 line-clamp-2">{entry.content}</p>
        </div>
      </div>
    </motion.div>
  );
}
