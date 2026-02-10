export interface Entry {
  id: string;
  term: string;
  description: string;
  source?: string;
  media_urls?: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type CreateEntryInput = Omit<Entry, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type UpdateEntryInput = Partial<CreateEntryInput>;
export type SortOption = 'latest' | 'alphabetical';
