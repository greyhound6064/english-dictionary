'use client';

import { EntryForm } from '@/components/EntryForm';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function NewEntryPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">새 항목 추가</h1>
        <EntryForm mode="create" />
      </div>
    </ProtectedRoute>
  );
}
