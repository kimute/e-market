# Footer 버튼 가림 문제 - 대안 해결 방법

## 현재 적용된 방법
```tsx
<div className="p-5 flex flex-col gap-5 pb-24">
```
- 하단 패딩 추가 (pb-24 = 6rem = 96px)
- 가장 간단하고 효과적

## 대안 1: Sticky 버튼
```tsx
<button className="sticky bottom-20 z-10 ...">
  Load More
</button>
```
- 스크롤해도 버튼이 항상 보임
- Footer 위에 고정

## 대안 2: Safe Area 사용
```tsx
<div className="pb-[calc(env(safe-area-inset-bottom)+5rem)]">
```
- 모바일 Safe Area 고려
- iOS notch 등에 대응

## 대안 3: Footer 높이 동적 계산
```tsx
const footerHeight = document.querySelector('footer')?.offsetHeight;
<div style={{ paddingBottom: `${footerHeight + 20}px` }}>
```
- Footer 높이가 변경되어도 대응
- 클라이언트 사이드 계산 필요
