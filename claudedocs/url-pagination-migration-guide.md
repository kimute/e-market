# URL 기반 페이지네이션 전환 가이드

> 클라이언트 상태 관리 방식에서 URL 쿼리 파라미터 기반 페이지네이션으로 전환하는 완전 가이드

## 목차
1. [개요](#개요)
2. [방식 비교](#방식-비교)
3. [전환 순서](#전환-순서)
4. [코드 예시](#코드-예시)
5. [장단점 분석](#장단점-분석)
6. [체크리스트](#체크리스트)

---

## 개요

### 현재 구조 (Client Component + Server Actions)
```
사용자 클릭 → useState 업데이트 → Server Action 호출 → 데이터 추가 → 화면 업데이트
```

### URL 기반 구조 (Server Component)
```
URL 변경 → 페이지 리렌더 → searchParams 읽기 → 서버에서 데이터 가져오기 → 화면 렌더
```

---

## 방식 비교

| 항목 | 현재 방식 (Client) | URL 기반 (Server) |
|------|-------------------|-------------------|
| **상태 관리** | `useState`, `setPage` | URL `searchParams` |
| **데이터 로딩** | `loadMoreProducts()` Server Action | `getProducts(page)` 직접 호출 |
| **네비게이션** | `onClick` 이벤트 + state 변경 | `<Link href="?page=N">` |
| **컴포넌트 타입** | `"use client"` 필수 | Server Component (기본) |
| **페이지 전환 방식** | 부분 업데이트 (데이터 누적) | 전체 리렌더 (페이지 교체) |
| **URL 공유** | ❌ 불가능 | ✅ 가능 |
| **브라우저 히스토리** | ❌ 없음 | ✅ 뒤로가기/앞으로가기 동작 |
| **새로고침 시** | ❌ 상태 초기화 | ✅ 상태 유지 |
| **SEO** | ⚠️ 제한적 | ✅ 완전 지원 |
| **인터랙션 속도** | ✅ 빠름 (부분 업데이트) | ⚠️ 보통 (전체 리렌더) |
| **데이터 누적** | ✅ 무한스크롤 가능 | ❌ 페이지마다 독립적 |

---

## 전환 순서

### Step 1: 데이터 레이어 수정
**파일:** `src/lib/data/products.ts`

**변경 전:**
```typescript
export async function getProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      description: true,
      price: true,
      createdAt: true,
      photo: true,
      id: true,
    },
    take: 3,
    orderBy: {
      createdAt: "desc"
    }
  });
  return products;
}
```

**변경 후:**
```typescript
export async function getProducts(page: number = 0) {
  const products = await db.product.findMany({
    select: {
      title: true,
      description: true,
      price: true,
      createdAt: true,
      photo: true,
      id: true,
    },
    skip: page * 5,  // 페이지 * 페이지당 개수
    take: 5,         // 페이지당 개수
    orderBy: {
      createdAt: "desc"
    }
  });
  return products;
}
```

**변경 사항:**
- ✅ `page` 파라미터 추가 (기본값 0)
- ✅ `skip: page * 5` 계산식 추가
- ✅ `take` 값 설정

---

### Step 2: 페이지 컴포넌트를 Server Component로 전환
**파일:** `src/app/(tabs)/home/page.tsx`

**변경 전:**
```typescript
import ProductListPaginationByClick from "@/components/product-list-pagination-by-click";
import { getProducts } from "@/lib/data/products";

export default async function Products() {
  const initialProducts = await getProducts();
  return (
    <div className="p-5 flex flex-col gap-5">
      <ProductListPaginationByClick initialProducts={initialProducts}/>
    </div>
  );
}
```

**변경 후:**
```typescript
import ListProduct from "@/components/list-product";
import { getProducts } from "@/lib/data/products";
import Link from "next/link";

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 0;

  const products = await getProducts(currentPage);

  return (
    <div className="p-5 flex flex-col gap-5 pb-24">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}

      {/* 다음 단계에서 페이지네이션 UI 추가 */}
    </div>
  );
}
```

**변경 사항:**
- ✅ `searchParams` prop 추가
- ✅ `page` 값 추출 및 숫자로 변환
- ✅ `getProducts(currentPage)` 호출
- ✅ 클라이언트 컴포넌트 제거
- ✅ 직접 렌더링

---

### Step 3: 페이지네이션 UI 추가
**파일:** `src/app/(tabs)/home/page.tsx`

**기본 구현 (이전/다음 버튼):**
```typescript
import ListProduct from "@/components/list-product";
import { getProducts } from "@/lib/data/products";
import Link from "next/link";

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 0;

  const products = await getProducts(currentPage);
  const hasProducts = products.length > 0;
  const isFirstPage = currentPage === 0;

  return (
    <div className="p-5 flex flex-col gap-5 pb-24">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}

      {/* 페이지네이션 UI */}
      <div className="flex gap-3 justify-center items-center">
        {!isFirstPage && (
          <Link
            href={`/home?page=${currentPage - 1}`}
            className="text-sm font-semibold bg-orange-500 text-white px-4 py-2 rounded-md hover:opacity-90"
          >
            Previous
          </Link>
        )}

        <span className="text-sm text-neutral-500">
          Page {currentPage + 1}
        </span>

        {hasProducts && products.length === 5 && (
          <Link
            href={`/home?page=${currentPage + 1}`}
            className="text-sm font-semibold bg-orange-500 text-white px-4 py-2 rounded-md hover:opacity-90"
          >
            Next
          </Link>
        )}
      </div>

      {!hasProducts && (
        <p className="text-center text-neutral-500">No more items</p>
      )}
    </div>
  );
}
```

**고급 구현 (페이지 번호):**
```typescript
import db from "@/lib/db";

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 0;

  // 총 개수 조회
  const totalCount = await db.product.count();
  const totalPages = Math.ceil(totalCount / 5);

  const products = await getProducts(currentPage);

  // 페이지 번호 배열 생성 (현재 페이지 ±2)
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, i) => {
      const start = Math.max(0, currentPage - 2);
      return start + i;
    }
  ).filter(p => p < totalPages);

  return (
    <div className="p-5 flex flex-col gap-5 pb-24">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}

      {/* 페이지 번호 네비게이션 */}
      <div className="flex gap-2 justify-center items-center flex-wrap">
        {currentPage > 0 && (
          <Link
            href={`/home?page=${currentPage - 1}`}
            className="px-3 py-1 rounded bg-neutral-200 hover:bg-neutral-300"
          >
            ←
          </Link>
        )}

        {pageNumbers.map((pageNum) => (
          <Link
            key={pageNum}
            href={`/home?page=${pageNum}`}
            className={`px-3 py-1 rounded ${
              pageNum === currentPage
                ? "bg-orange-500 text-white"
                : "bg-neutral-200 hover:bg-neutral-300"
            }`}
          >
            {pageNum + 1}
          </Link>
        ))}

        {currentPage < totalPages - 1 && (
          <Link
            href={`/home?page=${currentPage + 1}`}
            className="px-3 py-1 rounded bg-neutral-200 hover:bg-neutral-300"
          >
            →
          </Link>
        )}
      </div>
    </div>
  );
}
```

---

### Step 4: 불필요한 파일 정리

**제거 대상:**
- ❌ `src/components/product-list-pagination-by-click.tsx`
- ❌ `src/app/(tabs)/home/actions.ts`

**보관 옵션:**
```bash
# 완전 삭제
rm src/components/product-list-pagination-by-click.tsx
rm src/app/(tabs)/home/actions.ts

# 백업 후 삭제
mkdir -p backup/old-pagination
mv src/components/product-list-pagination-by-click.tsx backup/old-pagination/
mv src/app/(tabs)/home/actions.ts backup/old-pagination/
```

---

### Step 5: 고급 기능 추가 (선택사항)

#### 5-1. Loading UI 추가
**파일:** `src/app/(tabs)/home/loading.tsx` (생성)

```typescript
export default function Loading() {
  return (
    <div className="p-5 flex flex-col gap-5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border border-neutral-300 rounded-md p-4 animate-pulse">
          <div className="h-48 bg-neutral-200 rounded-md mb-3"></div>
          <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
```

#### 5-2. 에러 처리
**파일:** `src/app/(tabs)/home/error.tsx` (생성)

```typescript
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-5 text-center">
      <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
      <button
        onClick={reset}
        className="bg-orange-500 text-white px-4 py-2 rounded-md"
      >
        Try again
      </button>
    </div>
  );
}
```

#### 5-3. 메타데이터 동적 생성
**파일:** `src/app/(tabs)/home/page.tsx`

```typescript
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page } = await searchParams;
  const currentPage = Number(page) || 0;

  return {
    title: `Products - Page ${currentPage + 1}`,
    description: `Browse our product catalog, page ${currentPage + 1}`,
  };
}
```

---

## 코드 예시

### 완전한 구현 예시

**`src/lib/data/products.ts`**
```typescript
import db from "@/lib/db";

export async function getProducts(page: number = 0) {
  const products = await db.product.findMany({
    select: {
      title: true,
      description: true,
      price: true,
      createdAt: true,
      photo: true,
      id: true,
    },
    skip: page * 5,
    take: 5,
    orderBy: {
      createdAt: "desc"
    }
  });
  return products;
}

export async function getProductCount() {
  return await db.product.count();
}
```

**`src/app/(tabs)/home/page.tsx`**
```typescript
import ListProduct from "@/components/list-product";
import { getProducts, getProductCount } from "@/lib/data/products";
import Link from "next/link";

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 0;

  const [products, totalCount] = await Promise.all([
    getProducts(currentPage),
    getProductCount(),
  ]);

  const totalPages = Math.ceil(totalCount / 5);
  const hasProducts = products.length > 0;
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 1;

  return (
    <div className="p-5 flex flex-col gap-5 pb-24">
      {/* 제품 목록 */}
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}

      {/* 페이지네이션 */}
      {hasProducts && (
        <div className="flex gap-3 justify-center items-center">
          {!isFirstPage && (
            <Link
              href={`/home?page=${currentPage - 1}`}
              className="text-sm font-semibold bg-orange-500 text-white px-4 py-2 rounded-md hover:opacity-90"
            >
              Previous
            </Link>
          )}

          <span className="text-sm text-neutral-500">
            Page {currentPage + 1} of {totalPages}
          </span>

          {!isLastPage && (
            <Link
              href={`/home?page=${currentPage + 1}`}
              className="text-sm font-semibold bg-orange-500 text-white px-4 py-2 rounded-md hover:opacity-90"
            >
              Next
            </Link>
          )}
        </div>
      )}

      {!hasProducts && (
        <p className="text-center text-neutral-500">No products found</p>
      )}
    </div>
  );
}
```

---

## 장단점 분석

### URL 기반 페이지네이션

#### 장점 ✅
1. **상태 지속성**
   - 새로고침해도 현재 페이지 유지
   - 브라우저 뒤로가기/앞으로가기 동작
   - URL 북마크 가능

2. **공유 가능성**
   - URL을 다른 사람에게 공유 가능
   - 특정 페이지 직접 링크
   - 소셜 미디어 공유 최적화

3. **SEO 최적화**
   - 검색 엔진이 모든 페이지 크롤링 가능
   - 각 페이지별 메타데이터 설정 가능
   - 구조화된 데이터 적용 용이

4. **서버 컴포넌트 활용**
   - 초기 로딩 속도 향상
   - 클라이언트 번들 크기 감소
   - 서버 사이드 데이터 처리

5. **간단한 구조**
   - 상태 관리 불필요
   - 코드 복잡도 감소
   - 디버깅 용이

#### 단점 ❌
1. **페이지 전체 리렌더**
   - 클라이언트 업데이트보다 느릴 수 있음
   - 네트워크 요청 필수

2. **데이터 누적 불가**
   - 무한스크롤 구현 어려움
   - 이전 페이지 데이터 사라짐

3. **스크롤 위치**
   - 페이지 변경 시 상단으로 이동
   - 추가 처리 필요 (스크롤 위치 저장)

---

### 클라이언트 상태 기반 페이지네이션

#### 장점 ✅
1. **빠른 인터랙션**
   - 부분 업데이트만 발생
   - 네트워크 요청 최소화

2. **무한스크롤 가능**
   - 데이터 누적
   - 부드러운 UX

3. **스크롤 위치 유지**
   - 자연스러운 사용자 경험

#### 단점 ❌
1. **상태 초기화**
   - 새로고침 시 처음부터 시작
   - 브라우저 히스토리 없음

2. **공유 불가**
   - URL로 특정 상태 공유 불가
   - 북마크 의미 없음

3. **SEO 제한**
   - 검색 엔진 크롤링 어려움
   - 초기 페이지만 인덱싱

---

## 사용 사례별 추천

### URL 기반 사용 추천 ✅
- 📚 검색 결과 페이지
- 🛍️ 상품 카탈로그 (필터/정렬)
- 📰 블로그 포스트 목록
- 📊 데이터 테이블
- 🔍 SEO가 중요한 페이지
- 🔗 URL 공유가 필요한 경우

### 클라이언트 상태 사용 추천 ✅
- 📱 소셜 미디어 피드
- 💬 댓글 "더보기"
- 🔄 실시간 업데이트 목록
- 🎯 UX 부드러움이 중요한 경우
- 📜 무한스크롤 필요 시

---

## 체크리스트

### 전환 전 체크리스트
- [ ] 현재 페이지네이션 방식 확인
- [ ] 요구사항 분석 (SEO, URL 공유 필요성)
- [ ] 사용자 경험 우선순위 결정
- [ ] 백업 계획 수립

### Step 1: 데이터 레이어
- [ ] `getProducts()` 함수에 `page` 파라미터 추가
- [ ] `skip` 계산식 추가: `page * itemsPerPage`
- [ ] `take` 값 설정
- [ ] 함수 테스트

### Step 2: 페이지 컴포넌트
- [ ] `searchParams` prop 추가
- [ ] `page` 값 추출 및 숫자 변환
- [ ] `getProducts(currentPage)` 호출
- [ ] 클라이언트 컴포넌트 제거
- [ ] 직접 렌더링 확인

### Step 3: UI 구현
- [ ] Next.js `Link` import
- [ ] 이전/다음 버튼 추가
- [ ] 현재 페이지 표시
- [ ] 첫/마지막 페이지 처리
- [ ] 스타일링 적용

### Step 4: 정리
- [ ] 클라이언트 컴포넌트 파일 제거/백업
- [ ] Server Actions 파일 제거/백업
- [ ] import 문 정리
- [ ] 사용하지 않는 코드 제거

### Step 5: 고급 기능 (선택)
- [ ] `loading.tsx` 추가
- [ ] `error.tsx` 추가
- [ ] 총 페이지 수 표시
- [ ] 페이지 번호 네비게이션
- [ ] 메타데이터 동적 생성
- [ ] 접근성 개선 (ARIA 라벨)

### 테스트
- [ ] 첫 페이지 접근 (`/home`)
- [ ] 다음 페이지 이동 (`/home?page=1`)
- [ ] 이전 페이지 이동
- [ ] 마지막 페이지 처리
- [ ] 잘못된 페이지 번호 (음수, 범위 초과)
- [ ] 새로고침 시 상태 유지
- [ ] 브라우저 뒤로가기/앞으로가기
- [ ] URL 복사 및 공유
- [ ] 모바일 반응형

---

## 예상 결과

### URL 구조
```
/home              → Page 1 (items 0-4)
/home?page=1       → Page 2 (items 5-9)
/home?page=2       → Page 3 (items 10-14)
/home?page=3       → Page 4 (items 15-19)
```

### 사용자 경험
1. **페이지 이동**: Link 클릭 → URL 변경 → 서버에서 새 데이터 가져오기
2. **새로고침**: 현재 페이지 유지
3. **뒤로가기**: 이전 페이지로 정확히 이동
4. **URL 공유**: 친구에게 링크 공유 시 동일한 페이지 표시
5. **북마크**: 특정 페이지 북마크 가능

---

## 트러블슈팅

### 문제: 페이지 번호가 음수일 때
```typescript
const currentPage = Math.max(0, Number(page) || 0);
```

### 문제: 페이지 번호가 범위를 초과할 때
```typescript
const totalPages = Math.ceil(totalCount / 5);
const currentPage = Math.min(Math.max(0, Number(page) || 0), totalPages - 1);
```

### 문제: 스크롤 위치가 상단으로 이동
```typescript
// 클라이언트 컴포넌트 래퍼 사용
"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ScrollRestoration() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollPos = sessionStorage.getItem("scrollPos");
    if (scrollPos) {
      window.scrollTo(0, parseInt(scrollPos));
      sessionStorage.removeItem("scrollPos");
    }
  }, [searchParams]);

  return null;
}
```

---

## 추가 참고 자료

### Next.js 공식 문서
- [Dynamic Routes with searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)

### 관련 파일
- `src/lib/data/products.ts` - 데이터 레이어
- `src/app/(tabs)/home/page.tsx` - 메인 페이지
- `src/components/list-product.tsx` - 제품 아이템 컴포넌트

---

## 버전 히스토리

| 버전 | 날짜 | 변경 사항 |
|------|------|-----------|
| 1.0 | 2025-10-22 | 초기 문서 작성 |

---

**작성일**: 2025-10-22
**작성자**: Claude Code
**프로젝트**: e-market
