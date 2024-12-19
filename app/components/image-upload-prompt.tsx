'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageUpload } from './image-upload';
import { useEntriesStore } from '@/lib/store/entries';
import { uploadImages } from '@/lib/api';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ImageUploadPromptProps {
  onClose: () => void;
}

export function ImageUploadPrompt({ onClose }: ImageUploadPromptProps) {
  const { createEntry, updateEntry } = useEntriesStore();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileSelect = async (files: FileList) => {
    const newFiles = Array.from(files);

    // Filter out duplicates based on file name and size
    const uniqueNewFiles = newFiles.filter((newFile) => {
      return !selectedFiles.some(
        (existingFile) =>
          existingFile.name === newFile.name &&
          existingFile.size === newFile.size
      );
    });

    const totalFiles = selectedFiles.length + uniqueNewFiles.length;

    if (totalFiles > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setSelectedFiles((prev) => [...prev, ...uniqueNewFiles]);
    const urls = uniqueNewFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Cleanup old URL
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const base64Images = await Promise.all(
        selectedFiles.map(async (file) => ({
          data: await fileToBase64(file),
          mediaType: file.type,
        }))
      );

      const { description } = await uploadImages(base64Images);

      // Create object URLs for preview
      const imageUrls = selectedFiles.map((file) => URL.createObjectURL(file));

      // Create entry only after successful image upload
      const newEntry = createEntry();
      updateEntry(newEntry.id, {
        imageContexts: imageUrls.map((url) => ({
          url,
          description,
        })),
      });

      router.push(`/write/${newEntry.id}`);
    } catch (error) {
      console.error('Failed to upload images:', error);
      alert('Failed to process images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex flex-col"
    >
      <div className="flex-1 overflow-y-auto pt-20 px-4 pb-32">
        <div className="max-w-2xl mx-auto mt-12 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif text-stone-100">
              Start with Images
            </h1>
            <p className="text-lg text-stone-300">
              Add up to 5 images that inspire your writing
            </p>
          </div>

          <div className="bg-[#292524] border border-amber-800/20 rounded-2xl p-8">
            <ImageUpload
              onUpload={handleFileSelect}
              isDisabled={isUploading}
              multiple
              currentImageCount={selectedFiles.length}
            />
            {/* Preview Grid */}
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-square group">
                    <Image
                      src={url}
                      alt=""
                      fill
                      className="object-cover rounded-md"
                      // Add sizes prop for better performance
                      sizes="(max-width: 640px) 33vw, 25vw"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/50 
                             rounded-full hover:bg-black/70 opacity-0 
                             group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom bar for buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1C1917]/95 backdrop-blur-sm border-t border-amber-800/20 p-4">
        <div className="max-w-2xl mx-auto flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
          >
            Cancel
          </button>

          {selectedFiles.length > 0 && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1 py-3 bg-stone-700 hover:bg-stone-600 disabled:opacity-50 rounded-lg transition-colors"
            >
              {isUploading ? 'Processing images...' : 'Continue'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
