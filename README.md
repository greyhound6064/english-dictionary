# 영어 학습 사전

나만의 영어 단어/숙어/표현을 기록하고 관리하는 웹 애플리케이션입니다.

## 기능

- ✅ 단어/숙어/표현 등록
- ✅ 설명 및 예문 입력
- ✅ 이미지/영상 첨부
- ✅ 출처/원문 기록
- ✅ 실시간 검색
- ✅ 정렬 (최신순/알파벳순)
- ✅ 모바일 반응형 디자인

## 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **UI**: shadcn/ui
- **Deploy**: Cloudflare Pages

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase 설정

Supabase 대시보드에서 다음 SQL 실행:

```sql
-- entries 테이블 생성
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  term TEXT NOT NULL,
  description TEXT NOT NULL,
  source TEXT,
  media_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_term_search ON entries USING gin(to_tsvector('english', term));
CREATE INDEX idx_created_at ON entries(created_at DESC);
CREATE INDEX idx_term_alphabetical ON entries(term);

-- 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_entries_updated_at 
BEFORE UPDATE ON entries 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
```

Storage 버킷 생성:
- 버킷 이름: `entry-media`
- Public 접근 허용

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

## 배포

### Vercel (권장)

1. GitHub에 코드 푸시
2. https://vercel.com 접속 및 로그인
3. **New Project** 클릭
4. GitHub 저장소 선택
5. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. **Deploy** 클릭

배포 완료 후 자동으로 URL 제공 (예: `your-project.vercel.app`)

## 프로젝트 구조

자세한 내용은 [ARCHITECTURE.md](./ARCHITECTURE.md) 참조

## 라이선스

MIT
