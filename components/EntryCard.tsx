import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { truncateText } from '@/lib/utils';
import type { Entry } from '@/types/entry';

interface EntryCardProps {
  entry: Entry;
}

export function EntryCard({ entry }: EntryCardProps) {
  return (
    <Link href={`/entry/${entry.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="text-xl">{entry.term}</CardTitle>
          <CardDescription className="text-base mt-2">
            {truncateText(entry.description, 100)}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
