'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';
import { NailIcon } from './NailIcon';
import { Button } from './Button';

interface ImageUploadProps {
  value?: string; // Base64 string
  onChange: (base64: string | undefined) => void;
  maxSizeMB?: number;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  maxSizeMB = 2,
  className = '',
  disabled = false,
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Solo se permiten archivos de imagen';
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `El archivo debe ser menor a ${maxSizeMB}MB`;
    }

    return null;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      onChange(base64);
    } catch (error) {
      setError('Error al procesar la imagen');
      console.error('Error converting to base64:', error);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleRemoveImage = () => {
    onChange(undefined);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  if (value) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <Image
            src={value}
            alt="Imagen del servicio"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute -top-2 -right-2 bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <X size={16} />
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors h-40 flex flex-col items-center justify-center
          ${
            isDragOver
              ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20'
              : 'border-pink-300 hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleUploadClick}
      >
        <NailIcon className="mx-auto h-16 w-16 text-pink-600 dark:text-pink-400 mb-3" />
        <p className="text-pink-600 hover:text-pink-500 font-medium text-sm mb-1">
          Subir imagen del servicio
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          PNG, JPG hasta {maxSizeMB}MB
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className="text-pink-600 border-pink-300 hover:bg-pink-50 text-xs px-3 py-1"
        >
          <Upload size={14} className="mr-1" />
          Seleccionar
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}
