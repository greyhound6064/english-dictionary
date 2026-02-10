import { supabase } from './client';
import type { Entry, CreateEntryInput, UpdateEntryInput, SortOption } from '@/types/entry';

// 모든 항목 조회 (검색 + 정렬)
export async function getEntries(searchTerm: string = '', sortBy: SortOption = 'latest') {
  let query = supabase
    .from('english_dic_entries')
    .select('*');
  
  if (searchTerm) {
    query = query.ilike('term', `%${searchTerm}%`);
  }
  
  if (sortBy === 'latest') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('term', { ascending: true });
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as Entry[];
}

// 단일 항목 조회
export async function getEntry(id: string) {
  const { data, error } = await supabase
    .from('english_dic_entries')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Entry;
}

// 항목 생성
export async function createEntry(entry: CreateEntryInput) {
  // 현재 로그인한 사용자 ID 가져오기
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const { data, error } = await supabase
    .from('english_dic_entries')
    .insert({
      ...entry,
      user_id: user.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as Entry;
}

// 항목 수정
export async function updateEntry(id: string, updates: UpdateEntryInput) {
  const { data, error } = await supabase
    .from('english_dic_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Entry;
}

// 항목 삭제
export async function deleteEntry(id: string) {
  const { error } = await supabase
    .from('english_dic_entries')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// 미디어 업로드
export async function uploadMedia(file: File): Promise<string> {
  // 인증 확인
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('entry-media')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error(`업로드 실패: ${uploadError.message}`);
  }
  
  const { data } = supabase.storage
    .from('entry-media')
    .getPublicUrl(fileName);
  
  return data.publicUrl;
}

// 미디어 삭제
export async function deleteMedia(url: string) {
  const fileName = url.split('/').pop();
  if (!fileName) return;
  
  const { error } = await supabase.storage
    .from('entry-media')
    .remove([fileName]);
  
  if (error) throw error;
}
