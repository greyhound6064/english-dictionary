'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEntry, deleteEntry } from '@/lib/supabase/queries';
import { formatDate } from '@/lib/utils';
import type { Entry } from '@/types/entry';

export default function EntryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadEntry();
  }, [params.id]);

  const loadEntry = async () => {
    try {
      const data = await getEntry(params.id);
      setEntry(data);
    } catch (error) {
      console.error('Failed to load entry:', error);
      alert('항목을 불러올 수 없습니다.');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setDeleting(true);
    try {
      await deleteEntry(params.id);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('삭제에 실패했습니다.');
      setDeleting(false);
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5 mr-2" />
          뒤로
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/entry/${entry.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            수정
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="h-4 w-4 mr-2" />
            {deleting ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-4xl">{entry.term}</CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            등록일: {formatDate(entry.created_at)}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">설명</h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed">
              {entry.description}
            </p>
          </div>

          {entry.media_urls && entry.media_urls.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">첨부 파일</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entry.media_urls.map((url, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={url}
                        alt=""
                        className="w-full h-auto object-contain"
                      />
                    ) : (
                      <video
                        src={url}
                        controls
                        className="w-full h-auto"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {entry.source && (
            <div>
              <h2 className="text-lg font-semibold mb-2">출처/원문</h2>
              <p className="whitespace-pre-wrap text-base bg-gray-50 p-4 rounded-lg">
                {entry.source}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
