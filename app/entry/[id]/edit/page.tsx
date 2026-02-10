'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EntryForm } from '@/components/EntryForm';
import { getEntry } from '@/lib/supabase/queries';
import type { Entry } from '@/types/entry';
import { use } from 'react';

export default function EditEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntry();
  }, [id]);

  const loadEntry = async () => {
    try {
      const data = await getEntry(id);
      setEntry(data);
    } catch (error) {
      console.error('Failed to load entry:', error);
      alert('항목을 불러올 수 없습니다.');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!entry) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">항목 수정</h1>
      <EntryForm entry={entry} mode="edit" />
    </div>
  );
}
