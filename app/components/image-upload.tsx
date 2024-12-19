'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (files: FileList) => void;
  isDisabled?: boolean;
  multiple?: boolean;
}

export function ImageUpload({
  onUpload,
  isDisabled,
  multiple,
}: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Convert File[] to FileList
      const dataTransfer = new DataTransfer();
      acceptedFiles.forEach((file) => dataTransfer.items.add(file));
      onUpload(dataTransfer.files);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    disabled: isDisabled,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center 
                 transition-colors cursor-pointer
                 ${
                   isDragActive
                     ? 'border-stone-400 bg-stone-800/50'
                     : 'border-stone-700'
                 }
                 ${
                   isDisabled
                     ? 'opacity-50 cursor-not-allowed'
                     : 'hover:border-stone-500'
                 }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-6 h-6 mx-auto mb-2 text-stone-400" />
      <p className="text-stone-400">
        {isDragActive ? 'Drop images here' : 'Drop images or click to select'}
      </p>
    </div>
  );
}
