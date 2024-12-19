'use client';

import { JournalEntry } from '@/lib/store/entries';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useEntriesStore } from '@/lib/store/entries';

interface EntryCardProps {
  entry: JournalEntry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const router = useRouter();
  const deleteEntry = useEntriesStore((state) => state.deleteEntry);
  const hasImages = entry.imageContexts && entry.imageContexts.length > 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    deleteEntry(entry.id);
  };

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
      className="group relative cursor-pointer"
    >
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 p-2 rounded-full bg-stone-800/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-stone-700/80 z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-stone-300"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-stone-950 border border-stone-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-stone-200">
              Delete Entry
            </AlertDialogTitle>
            <AlertDialogDescription className="text-stone-400">
              Are you sure you want to delete &quot;{entry.title}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-stone-900 border-stone-800 hover:bg-stone-800 text-stone-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-900 hover:bg-red-800 text-stone-200"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
