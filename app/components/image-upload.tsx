'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

interface ImageUploadProps {
  onUpload: (files: FileList) => void;
  isDisabled?: boolean;
  multiple?: boolean;
  currentImageCount: number;
  maxImages?: number;
  onError?: (message: string) => void;
}

export function ImageUpload({
  onUpload,
  isDisabled,
  multiple,
  currentImageCount,
  maxImages = 5,
  onError,
}: ImageUploadProps) {
  const hasReachedLimit = currentImageCount >= maxImages;
  const effectivelyDisabled = isDisabled || hasReachedLimit;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Check file sizes
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > MAX_FILE_SIZE
      );
      if (oversizedFiles.length > 0) {
        onError?.('Images must be less than 5MB');
        return;
      }

      // Create a hash of each file using name + size + lastModified
      const fileHash = (file: File) =>
        `${file.name}-${file.size}-${file.lastModified}`;

      // Remove duplicates from the newly dropped files themselves
      const uniqueFiles = acceptedFiles.reduce((acc: File[], file) => {
        const hash = fileHash(file);
        const isDuplicate = acc.some((f) => fileHash(f) === hash);
        if (!isDuplicate) acc.push(file);
        return acc;
      }, []);

      if (uniqueFiles.length < acceptedFiles.length) {
        // Optional: Notify user that duplicates were skipped
        console.log('Duplicate files were skipped');
      }

      // Convert unique File[] to FileList
      const dataTransfer = new DataTransfer();
      uniqueFiles.forEach((file) => dataTransfer.items.add(file));
      onUpload(dataTransfer.files);
    },
    [onUpload, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    disabled: effectivelyDisabled,
    multiple,
    maxSize: MAX_FILE_SIZE, // Add maxSize to dropzone config
    onDropRejected: (fileRejections) => {
      const isSizeError = fileRejections.some((rejection) =>
        rejection.errors.some((error) => error.code === 'file-too-large')
      );
      if (isSizeError) {
        onError?.('Images must be less than 5MB');
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center 
              transition-colors cursor-pointer relative
              ${
                isDragActive
                  ? 'border-text-secondary bg-surface-hover'
                  : 'border-accent-muted'
              }
              ${
                effectivelyDisabled
                  ? 'opacity-50 cursor-not-allowed bg-gray-50'
                  : 'hover:border-accent'
              }`}
    >
      <input {...getInputProps()} />
      <Upload
        className={`w-6 h-6 mx-auto mb-2 ${
          hasReachedLimit ? 'text-red-400' : 'text-text-muted'
        }`}
      />
      <p
        className={`${
          hasReachedLimit ? 'text-red-500 font-medium' : 'text-text-muted'
        }`}
      >
        {hasReachedLimit
          ? `Maximum ${maxImages} images reached`
          : isDragActive
          ? 'Drop images here'
          : 'Drop images or click to select'}
      </p>
      <div className="mt-1 space-y-0.5">
        {!hasReachedLimit && (
          <p className="text-sm text-text-muted">
            {currentImageCount} of {maxImages} images uploaded
          </p>
        )}
        <p className="text-xs text-text-muted">
          Maximum file size: 5MB per image
        </p>
      </div>
    </div>
  );
}
