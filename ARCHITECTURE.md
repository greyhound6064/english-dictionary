# 영어사전 웹앱 아키텍처

## 프로젝트 개요
Next.js 14 (App Router) + Supabase + Tailwind CSS 기반 영어 학습 사전 웹앱

## 기술 스택
- **프론트엔드**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **백엔드**: Supabase (PostgreSQL + Storage)
- **배포**: Cloudflare Pages

## 프로젝트 구조

```
english-dictionary/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 메인 페이지 (리스트)
│   ├── globals.css              # 전역 스타일
│   └── entry/
│       ├── new/
│       │   └── page.tsx        # 새 항목 입력 페이지
│       └── [id]/
│           ├── page.tsx        # 상세 페이지
│           └── edit/
│               └── page.tsx    # 수정 페이지
├── components/                   # React 컴포넌트
│   ├── EntryCard.tsx            # 항목 카드 (리스트용)
│   ├── SearchBar.tsx            # 검색 바
│   ├── SortDropdown.tsx         # 정렬 드롭다운
│   ├── MediaUploader.tsx        # 미디어 업로드
│   ├── EntryForm.tsx            # 항목 입력/수정 폼
│   └── ui/                      # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       └── select.tsx
├── lib/
│   ├── utils.ts                 # 유틸리티 함수
│   └── supabase/
│       ├── client.ts            # Supabase 클라이언트
│       └── queries.ts           # DB 쿼리 함수
└── types/
    └── entry.ts                 # TypeScript 타입 정의

## 데이터베이스 스키마

### english_dic_entries 테이블
```sql
CREATE TABLE english_dic_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  term TEXT NOT NULL,                    -- 단어/숙어/표현
  description TEXT NOT NULL,             -- 설명
  source TEXT,                           -- 출처/원문
  media_urls TEXT[],                     -- 이미지/영상 URL 배열
  user_id UUID REFERENCES auth.users(id) NOT NULL, -- 사용자 ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 인덱스
- `idx_english_dic_term_search`: 검색 최적화 (GIN 인덱스)
- `idx_english_dic_created_at`: 최신순 정렬
- `idx_english_dic_term_alphabetical`: 알파벳순 정렬
- `idx_english_dic_entries_user_id`: 사용자별 조회 최적화

### RLS (Row Level Security)
- 사용자는 자신이 생성한 항목만 조회/수정/삭제 가능
- 인증된 사용자만 데이터 접근 가능

### Storage 버킷
- **버킷명**: `entry-media`
- **용도**: 이미지/영상 파일 저장
- **접근**: Public

## 주요 기능

### 1. 메인 페이지 (`app/page.tsx`)
- 항목 리스트 표시 (카드 형태)
- 실시간 검색 (클라이언트 필터링)
- 정렬 (최신순/알파벳순)
- 플로팅 추가 버튼

### 2. 새 항목 추가 (`app/entry/new/page.tsx`)
- 단어/숙어/표현 입력 (필수)
- 설명 입력 (필수)
- 이미지/영상 업로드 (선택)
- 출처/원문 입력 (선택)

### 3. 상세 페이지 (`app/entry/[id]/page.tsx`)
- 항목 정보 표시
- 미디어 표시 (이미지/영상)
- 수정/삭제 버튼

### 4. 수정 페이지 (`app/entry/[id]/edit/page.tsx`)
- 기존 항목 수정
- EntryForm 재사용

## 핵심 함수 위치

### Supabase 쿼리 (`lib/supabase/queries.ts`)
- `getEntries()`: 모든 항목 조회 (검색/정렬)
- `getEntry()`: 단일 항목 조회
- `createEntry()`: 항목 생성
- `updateEntry()`: 항목 수정
- `deleteEntry()`: 항목 삭제
- `uploadMedia()`: 미디어 업로드
- `deleteMedia()`: 미디어 삭제

### 유틸리티 (`lib/utils.ts`)
- `cn()`: Tailwind 클래스 병합
- `truncateText()`: 텍스트 자르기
- `formatDate()`: 날짜 포맷팅

## 타입 정의 (`types/entry.ts`)
```typescript
interface Entry {
  id: string;
  term: string;
  description: string;
  source?: string;
  media_urls?: string[];
  created_at: string;
  updated_at: string;
}

type CreateEntryInput = Omit<Entry, 'id' | 'created_at' | 'updated_at'>;
type UpdateEntryInput = Partial<CreateEntryInput>;
type SortOption = 'latest' | 'alphabetical';
```

## 모바일 반응형

### Tailwind 브레이크포인트
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### 모바일 최적화
- 모바일 first 디자인
- 터치 친화적 UI (최소 44x44px)
- 반응형 그리드 (grid-cols-2 md:grid-cols-3)
- 플로팅 버튼 (fixed bottom-8 right-8)

## 환경 변수

`.env.local` 파일:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 수정 시 주의사항

### 1. 컴포넌트 수정
- 모든 페이지 컴포넌트는 `'use client'` 디렉티브 필요 (상태 관리 사용)
- EntryForm은 create/edit 모드 모두 지원

### 2. 데이터베이스 수정
- Supabase 대시보드에서 SQL 실행
- RLS(Row Level Security) 활성화 (사용자별 데이터 격리)
- 인증된 사용자만 데이터 접근 가능

### 3. 스타일 수정
- Tailwind CSS 사용
- shadcn/ui 컴포넌트 커스터마이징 가능
- 전역 스타일은 `app/globals.css`

### 4. 라우팅
- 파일 기반 라우팅 (App Router)
- 동적 라우트: `[id]` 폴더

## 배포

### Vercel (권장)
1. https://vercel.com 접속
2. GitHub 저장소 연결
3. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 자동 배포 완료

### 대안: Cloudflare Pages
- Next.js 일부 기능 제한
- Static export 필요
- Vercel 사용 권장

## 향후 확장

- 사용자 인증 (Supabase Auth)
- 태그/카테고리 시스템
- 즐겨찾기 기능
- 다크 모드
- PWA 지원
