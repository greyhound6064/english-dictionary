'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadMedia } from '@/lib/supabase/queries';

interface MediaUploaderProps {
  mediaUrls: string[];
  onMediaChange: (urls: string[]) => void;
}

export function MediaUploader({ mediaUrls, onMediaChange }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadMedia(file));
      const newUrls = await Promise.all(uploadPromises);
      onMediaChange([...mediaUrls, ...newUrls]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (url: string) => {
    onMediaChange(mediaUrls.filter(u => u !== url));
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="media-upload" className="cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                {uploading ? '업로드 중...' : '이미지 또는 영상 업로드'}
              </p>
            </div>
          </div>
        </label>
        <input
          id="media-upload"
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mediaUrls.map((url, index) => (
            <div key={index} className="relative group">
              {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img src={url} alt="" className="w-full h-32 object-cover rounded-lg" />
              ) : (
                <video src={url} className="w-full h-32 object-cover rounded-lg" />
              )}
              <button
                onClick={() => handleRemove(url)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
