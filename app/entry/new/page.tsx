import { EntryForm } from '@/components/EntryForm';

export default function NewEntryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">새 항목 추가</h1>
      <EntryForm mode="create" />
    </div>
  );
}
