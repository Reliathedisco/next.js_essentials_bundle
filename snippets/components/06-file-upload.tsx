// Component: File upload with preview and progress
'use client';

import { useState, useRef } from 'react';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  onUpload: (file: File) => Promise<{ url: string }>;
}

export function FileUpload({
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  onUpload,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) return;
    
    if (selectedFile.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);
      
      const result = await onUpload(file);
      
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setProgress(0);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }, 1000);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        
        {preview ? (
          <img src={preview} alt="Preview" className="mb-4 h-40 w-40 object-cover rounded" />
        ) : (
          <svg
            className="mb-4 h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        )}
        
        <label
          htmlFor="file-upload"
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Choose File
        </label>
        
        {file && (
          <p className="mt-2 text-sm text-gray-600">{file.name}</p>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {file && !uploading && (
        <button
          onClick={handleUpload}
          className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Upload
        </button>
      )}
      
      {uploading && (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600">{progress}%</p>
        </div>
      )}
    </div>
  );
}
