'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="단어, 숙어, 표현 검색..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>
      <p className="text-sm text-gray-600">{resultCount}개 항목</p>
    </div>
  );
}
