'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MediaUploader } from './MediaUploader';
import { createEntry, updateEntry } from '@/lib/supabase/queries';
import type { Entry, CreateEntryInput } from '@/types/entry';

interface EntryFormProps {
  entry?: Entry;
  mode: 'create' | 'edit';
}

export function EntryForm({ entry, mode }: EntryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateEntryInput>({
    term: entry?.term || '',
    description: entry?.description || '',
    source: entry?.source || '',
    media_urls: entry?.media_urls || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.term.trim() || !formData.description.trim()) {
      alert('단어/숙어/표현과 설명은 필수입니다.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create') {
        await createEntry(formData);
      } else if (entry) {
        await updateEntry(entry.id, formData);
      }
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Save failed:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          단어/숙어/표현 <span className="text-red-500">*</span>
        </label>
        <Input
          value={formData.term}
          onChange={(e) => setFormData({ ...formData, term: e.target.value })}
          placeholder="예: break the ice"
          className="text-base"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          설명 <span className="text-red-500">*</span>
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="의미, 사용법, 예문 등을 입력하세요..."
          className="min-h-[200px] text-base"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">이미지/영상</label>
        <MediaUploader
          mediaUrls={formData.media_urls || []}
          onMediaChange={(urls) => setFormData({ ...formData, media_urls: urls })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">출처/원문</label>
        <Textarea
          value={formData.source || ''}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          placeholder="예: Friends S01E01 - 'Let's break the ice...'"
          className="min-h-[100px] text-base"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? '저장 중...' : mode === 'create' ? '등록' : '수정'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          취소
        </Button>
      </div>
    </form>
  );
}
