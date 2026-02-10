'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EntryCard } from '@/components/EntryCard';
import { SearchBar } from '@/components/SearchBar';
import { SortDropdown } from '@/components/SortDropdown';
import { getEntries } from '@/lib/supabase/queries';
import type { Entry, SortOption } from '@/types/entry';

export default function HomePage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, [sortBy]);

  const loadEntries = async () => {
    try {
      const data = await getEntries('', sortBy);
      setEntries(data);
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    if (!searchTerm) return entries;
    return entries.filter(entry =>
      entry.term.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [entries, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">영어 학습 사전</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            resultCount={filteredEntries.length}
          />
        </div>
        <div>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? '검색 결과가 없습니다.' : '등록된 항목이 없습니다.'}
            </p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <EntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>

      <Button
        onClick={() => router.push('/entry/new')}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
