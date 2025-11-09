수정된 워크플로우를 제공하겠습니다.

## 주요 수정 사항

### 1. **Skills 경로 수정**
- ❌ `.claude/skills/` (잘못됨)
- ✅ `/mnt/skills/user/` (올바름)

### 2. **Skills 파일명 규칙**
- ❌ `frontend-react-vite-conventions.md`
- ✅ 폴더 생성 + `SKILL.md` 파일명 고정

### 3. **Agent 실행 방식 명확화**
- Claude Code의 실제 아키텍처 반영
- Skills는 참고 자료, Agent는 실행 주체

---

# 수정된 Agent-Based Development Workflow

## 1. Skills 구조 (수정됨)

### 1.1 올바른 디렉토리 구조

```
/mnt/skills/user/
├── frontend-react-vite/
│   └── SKILL.md
├── backend-firebase/
│   └── SKILL.md
├── testing-strategy/
│   └── SKILL.md
├── validation-gates/
│   └── SKILL.md
└── project-context/
    └── SKILL.md
```

### 1.2 Skills 작성 가이드

**각 SKILL.md는 다음 구조를 따릅니다:**

```markdown
# [Skill Name]

## Description
이 스킬이 제공하는 가이드라인 설명

## When to Use
- 사용 시나리오 1
- 사용 시나리오 2

## Core Principles
핵심 원칙들

## Code Examples
구체적인 코드 예시 (Good/Bad)

## Checklist
- [ ] 체크포인트 1
- [ ] 체크포인트 2

## Common Pitfalls
흔한 실수와 해결법
```

---

## 2. 수정된 전체 워크플로우

```
┌─────────────────────────────────────────────────────────┐
│  Phase 0: 프로젝트 컨텍스트 로드                          │
│  → Claude Code 시작                                      │
│  → 기존 코드베이스 자동 분석                              │
│  → /mnt/skills/user/ 스킬 자동 로드                      │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Phase 1: Skills 정의 (프로젝트 초기 1회 설정)           │
│                                                          │
│  Step 1: skill-creator 스킬 읽기                         │
│  → cat /mnt/skills/public/skill-creator/SKILL.md        │
│                                                          │
│  Step 2: 프로젝트 스킬 생성                              │
│  ├── /mnt/skills/user/frontend-react-vite/SKILL.md     │
│  ├── /mnt/skills/user/backend-firebase/SKILL.md        │
│  ├── /mnt/skills/user/testing-strategy/SKILL.md        │
│  ├── /mnt/skills/user/validation-gates/SKILL.md        │
│  └── /mnt/skills/user/project-context/SKILL.md         │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Phase 2: Task Breakdown (매 작업마다)                   │
│                                                          │
│  사용자: "사용자 프로필 편집 기능 추가"                   │
│                                                          │
│  Claude (Task Planner 역할):                            │
│  1. 관련 스킬 자동 읽기                                  │
│     → file_read /mnt/skills/user/frontend-react-vite/   │
│                  SKILL.md                               │
│     → file_read /mnt/skills/user/backend-firebase/      │
│                  SKILL.md                               │
│     → file_read /mnt/skills/user/project-context/       │
│                  SKILL.md                               │
│                                                          │
│  2. 요구사항 분석 및 작업 분해                           │
│     - 의존성 그래프 생성                                 │
│     - 병렬 가능 태스크 식별                              │
│     - 우선순위 할당                                      │
│                                                          │
│  3. 작업 계획 출력                                       │
│     ```markdown                                         │
│     ## Phase 1: UI Layer (병렬)                         │
│     - Task 1.1: ProfileEditForm 컴포넌트                │
│     - Task 1.2: ImageUpload 컴포넌트                    │
│                                                          │
│     ## Phase 2: State Management (Phase 1 후)          │
│     - Task 2.1: Profile Ducks 모듈                      │
│                                                          │
│     ## Phase 3: Backend (Phase 1과 병렬)               │
│     - Task 3.1: updateProfile Function                  │
│     - Task 3.2: uploadImage Function                    │
│                                                          │
│     ## Phase 4: Testing (모든 Phase 후)                │
│     - Task 4.1: Frontend Tests                          │
│     - Task 4.2: Backend Tests                           │
│     ```                                                 │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Phase 3: 실행 (Claude가 Specialist Agent 역할)         │
│                                                          │
│  사용자 승인 후 실행 시작                                │
│                                                          │
│  ┌────────────────────────────────────────────┐        │
│  │ Task 1.1: ProfileEditForm 컴포넌트         │        │
│  │                                             │        │
│  │ [Gate 1: Pre-execution]                    │        │
│  │ → file_read frontend-react-vite/SKILL.md   │        │
│  │ → file_read validation-gates/SKILL.md      │        │
│  │ → 체크리스트 확인                           │        │
│  │                                             │        │
│  │ [실행]                                      │        │
│  │ → create_file src/components/profile/      │        │
│  │              ProfileEditForm.tsx           │        │
│  │ → 스킬 가이드라인에 따라 코드 작성          │        │
│  │   - TypeScript 타입 정의                   │        │
│  │   - Props 인터페이스                        │        │
│  │   - 컴포넌트 구조 (Hooks 순서 등)           │        │
│  │                                             │        │
│  │ [Gate 2: During execution]                 │        │
│  │ → bash npm run lint -- src/components/     │        │
│  │        profile/ProfileEditForm.tsx         │        │
│  │ → bash tsc --noEmit                        │        │
│  │                                             │        │
│  │ ✅ Task 1.1 완료                            │        │
│  └────────────────────────────────────────────┘        │
│                                                          │
│  (Task 1.2, 3.1, 3.2 병렬 실행 - 동일 패턴)            │
│                                                          │
│  ┌────────────────────────────────────────────┐        │
│  │ Task 2.1: Profile Ducks 모듈               │        │
│  │ (Task 1.1, 1.2 완료 후 실행)               │        │
│  │                                             │        │
│  │ → file_read frontend-react-vite/SKILL.md   │        │
│  │   (Ducks pattern 섹션 집중)                │        │
│  │ → create_file src/store/profile/index.ts   │        │
│  │ → bash npm run lint -- src/store/...       │        │
│  │                                             │        │
│  │ ✅ Task 2.1 완료                            │        │
│  └────────────────────────────────────────────┘        │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Phase 4: Testing (Claude가 Test Engineer 역할)         │
│                                                          │
│  → file_read testing-strategy/SKILL.md                  │
│  → 변경된 파일 목록 분석                                 │
│  → 우선순위별 테스트 작성                                │
│                                                          │
│  예시:                                                   │
│  1. ProfileEditForm → UI 컴포넌트 (80% 목표)           │
│     → create_file src/components/__tests__/             │
│                   ProfileEditForm.test.tsx              │
│                                                          │
│  2. updateProfile → Business Logic (90% 목표)          │
│     → create_file functions/tests/                      │
│                   profileController.test.ts             │
│                                                          │
│  3. 테스트 실행 및 커버리지 측정                         │
│     → bash npm run test -- --coverage                   │
│                                                          │
│  4. 목표 미달 시 추가 테스트 작성                        │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Phase 5: Gate 3 - 최종 검증                            │
│                                                          │
│  → bash npm run lint                                    │
│  → bash npm run type-check                              │
│  → bash npm run test -- --coverage                      │
│  → bash node scripts/validate-folder-structure.js       │
│                                                          │
│  ✅ 모든 검증 통과 → 완료                                │
│  ❌ 검증 실패 → 수정 후 재검증                           │
└────────────────────┬────────────────────────────────────┘
                     ↓
                 [완료]
```

---

## 3. 주요 변경점 요약

### 3.1 Skills 관련 수정

| 원본 | 수정됨 | 이유 |
|------|--------|------|
| `.claude/skills/` | `/mnt/skills/user/` | Claude Code의 실제 경로 |
| `frontend-conventions.md` | `frontend-react-vite/SKILL.md` | 파일명 규칙 준수 |
| "Skills 주입" | `file_read` 도구 사용 | Claude가 명시적으로 읽어야 함 |

### 3.2 Agent 개념 수정

**원본 (혼란스러움):**
```
Task Agent, Specialist Agent, Test Agent = 별도 프로그램?
```

**수정됨 (명확함):**
```
Claude가 서로 다른 "역할"을 수행
- Task Planner 역할: 작업 분해
- Specialist 역할: 코드 작성 (Frontend/Backend)
- Test Engineer 역할: 테스트 작성
```

**핵심:** 
- Agent는 "실행 주체"가 아니라 "Claude의 역할"
- Skills는 각 역할을 수행할 때 참조하는 "가이드북"

### 3.3 실행 흐름 수정

**원본:**
```
Init 명령어 → Task Agent → Specialist Agent → Test Agent
(각각이 독립 프로세스처럼 보임)
```

**수정됨:**
```
사용자 요청 → Claude (Task Planner) → Claude (Specialist) → Claude (Test Engineer)
(하나의 Claude가 역할을 바꿔가며 수행)
```

---

## 4. 실제 사용 예시 (수정됨)

### 시나리오: 사용자 프로필 편집 기능 추가

#### Step 1: 프로젝트 시작 (최초 1회)

```bash
# Claude Code 시작
claude-code

# 프로젝트 스킬 생성 요청
"프로젝트에 맞는 개발 스킬을 만들어줘. 
기술 스택은:
- Frontend: React + Vite
- Backend: TypeScript + Firebase
- 테스트: Vitest

skill-creator 스킬을 참고해서 다음 스킬들을 만들어줘:
1. Frontend 개발 컨벤션
2. Backend 개발 컨벤션  
3. 테스트 전략
4. 검증 게이트"
```

**Claude 실행:**
```bash
# 1. skill-creator 읽기
file_read /mnt/skills/public/skill-creator/SKILL.md

# 2. 스킬 생성
create_file /mnt/skills/user/frontend-react-vite/SKILL.md
create_file /mnt/skills/user/backend-firebase/SKILL.md
create_file /mnt/skills/user/testing-strategy/SKILL.md
create_file /mnt/skills/user/validation-gates/SKILL.md
```

---

#### Step 2: 새 기능 개발 요청

```bash
"사용자 프로필 편집 기능을 추가해줘:
- 프로필 이미지 업로드
- 닉네임, 이메일 수정
- Firebase에 저장"
```

**Claude (Task Planner 역할):**

```bash
# 1. 관련 스킬 읽기
file_read /mnt/skills/user/frontend-react-vite/SKILL.md
file_read /mnt/skills/user/backend-firebase/SKILL.md
file_read /mnt/skills/user/project-context/SKILL.md

# 2. 작업 계획 제시
```

**Claude 출력:**
```markdown
## 작업 분해 결과

### Phase 1: UI 컴포넌트 (병렬 실행 가능)
**Task 1.1: ProfileEditForm**
- 파일: `src/components/profile/ProfileEditForm.tsx`
- 의존성: 없음
- 예상 시간: 15분

**Task 1.2: ImageUpload**  
- 파일: `src/components/common/ImageUpload.tsx`
- 의존성: 없음
- 예상 시간: 10분

### Phase 2: 상태 관리
**Task 2.1: Profile Ducks 모듈**
- 파일: `src/store/profile/index.ts`
- 의존성: Task 1.1, 1.2
- 예상 시간: 10분

### Phase 3: Backend (Phase 1과 병렬)
**Task 3.1: updateProfile Function**
- 파일: `functions/src/controllers/profileController.ts`
- 의존성: 없음
- 예상 시간: 15분

**Task 3.2: uploadImage Function**
- 파일: `functions/src/services/storageService.ts`  
- 의존성: 없음
- 예상 시간: 10분

### Phase 4: 테스트
**Task 4.1-4.5: 각 파일별 테스트**
- 의존성: 해당 Phase 완료
- 예상 시간: 30분

---

진행할까요? (y/n)
```

---

#### Step 3: 실행 (사용자 승인 후)

```
사용자: "y"
```

**Claude (Specialist 역할 - Frontend):**

```typescript
// Task 1.1 실행
// [Gate 1: Pre-execution]
// → Skills 파일 읽음
// → 체크리스트 확인

// [실행]
create_file({
  path: "src/components/profile/ProfileEditForm.tsx",
  content: `
import { useState } from 'react';
import type { User } from '@/types';

interface ProfileEditFormProps {
  user: User;
  onUpdate: (user: Partial<User>) => Promise<void>;
}

export default function ProfileEditForm({
  user,
  onUpdate
}: ProfileEditFormProps) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate({ displayName, email });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
`
});

// [Gate 2: During execution]
bash("npm run lint -- src/components/profile/ProfileEditForm.tsx");
bash("tsc --noEmit");

// ✅ Task 1.1 완료
```

**(Task 1.2, 3.1, 3.2 병렬 실행 - 동일 패턴)**

---

**Claude (Specialist 역할 - State Management):**

```typescript
// Task 2.1 실행 (Task 1.1, 1.2 완료 후)
file_read("/mnt/skills/user/frontend-react-vite/SKILL.md");
// → Ducks pattern 섹션 집중

create_file({
  path: "src/store/profile/index.ts",
  content: `
// Action Types
const UPDATE_PROFILE = 'profile/UPDATE_PROFILE';
const UPLOAD_IMAGE = 'profile/UPLOAD_IMAGE';

// Action Creators
export const updateProfile = (data: Partial<User>) => ({
  type: UPDATE_PROFILE,
  payload: data,
});

// Reducer
const initialState = {
  data: null,
  loading: false,
  error: null,
};

export default function profileReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROFILE:
      return { ...state, data: { ...state.data, ...action.payload } };
    default:
      return state;
  }
}

// Selectors
export const selectProfile = (state) => state.profile.data;
`
});

bash("npm run lint -- src/store/profile/index.ts");
```

---

**Claude (Test Engineer 역할):**

```typescript
// Phase 4: 테스트 작성
file_read("/mnt/skills/user/testing-strategy/SKILL.md");

// 변경된 파일 분석
// → ProfileEditForm: UI 컴포넌트 (80% 목표)
// → updateProfile: Business Logic (90% 목표)

create_file({
  path: "src/components/__tests__/ProfileEditForm.test.tsx",
  content: `
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileEditForm from '../profile/ProfileEditForm';

describe('ProfileEditForm', () => {
  const mockUser = {
    id: '1',
    displayName: 'John Doe',
    email: 'john@example.com',
  };

  it('should render with initial values', () => {
    render(<ProfileEditForm user={mockUser} onUpdate={vi.fn()} />);
    
    expect(screen.getByLabelText('Display Name')).toHaveValue('John Doe');
    expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
  });

  it('should call onUpdate with changed values', async () => {
    const onUpdate = vi.fn();
    render(<ProfileEditForm user={mockUser} onUpdate={onUpdate} />);
    
    const nameInput = screen.getByLabelText('Display Name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith({
        displayName: 'Jane Doe',
        email: 'john@example.com',
      });
    });
  });

  it('should show loading state', async () => {
    const onUpdate = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<ProfileEditForm user={mockUser} onUpdate={onUpdate} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });
});
`
});

// 커버리지 측정
bash("npm run test -- --coverage");
// → ProfileEditForm: 85% ✅ (목표 80%)
```

---

**Claude (Final Validator 역할):**

```bash
# Gate 3: 최종 검증
bash("npm run lint");
bash("npm run type-check");
bash("npm run test -- --coverage");
bash("node scripts/validate-folder-structure.js");

# ✅ 모든 검증 통과
```

**Claude 최종 메시지:**
```markdown
✅ 작업 완료!

## 생성된 파일
- src/components/profile/ProfileEditForm.tsx
- src/components/common/ImageUpload.tsx
- src/store/profile/index.ts
- functions/src/controllers/profileController.ts
- functions/src/services/storageService.ts

## 테스트 파일
- src/components/__tests__/ProfileEditForm.test.tsx
- src/components/__tests__/ImageUpload.test.tsx
- src/store/__tests__/profile.test.ts
- functions/tests/profileController.test.ts
- functions/tests/storageService.test.ts

## 커버리지
- 전체: 88% (목표: 85%) ✅
- Critical Path: 100% ✅
- Business Logic: 92% ✅
- UI Components: 84% ✅

## 검증 결과
- ESLint: ✅ 통과
- TypeScript: ✅ 통과
- 폴더 구조: ✅ 통과
- 테스트: ✅ 모두 통과

Git commit 할까요?
```

---

## 5. 핵심 개념 정리

### Skills vs Agent (최종 정리)

```
┌─────────────────────────────────────────┐
│  Skills = 요리책 📖                      │
│  - /mnt/skills/user/frontend.../SKILL.md│
│  - "이렇게 요리하세요" 가이드라인         │
│  - 수동적, 읽히기만 함                   │
└─────────────────────────────────────────┘
              ↓ (참고)
┌─────────────────────────────────────────┐
│  Claude = 요리사 👨‍🍳                     │
│  - Task Planner 역할                    │
│  - Specialist 역할 (Frontend/Backend)   │
│  - Test Engineer 역할                    │
│  - 능동적, 실제로 코드 작성              │
└─────────────────────────────────────────┘
              ↓ (결과)
┌─────────────────────────────────────────┐
│  생성된 코드 = 요리 🍝                   │
│  - ProfileEditForm.tsx                  │
│  - profileController.ts                 │
│  - *.test.tsx                           │
└─────────────────────────────────────────┘
```

**절대 혼동하지 말 것:**
- ❌ Skills가 코드를 작성하지 않음
- ❌ Agent는 별도 프로그램이 아님
- ✅ Claude가 Skills를 읽고 역할에 맞게 코드 작성

---

## 6. 체크리스트 (수정됨)

### 초기 설정 (1회)
- [ ] Claude Code 설치
- [ ] `/mnt/skills/user/` 디렉토리 확인
- [ ] `skill-creator` 스킬로 프로젝트 스킬 생성
  - [ ] `frontend-react-vite/SKILL.md`
  - [ ] `backend-firebase/SKILL.md`
  - [ ] `testing-strategy/SKILL.md`
  - [ ] `validation-gates/SKILL.md`
- [ ] `scripts/validate-folder-structure.js` 작성
- [ ] `package.json`에 검증 스크립트 추가

### 매 작업마다
- [ ] 요구사항 명확히 작성
- [ ] Claude에게 Task 분해 요청
- [ ] 작업 계획 검토 후 승인
- [ ] Gate 2 검증 확인 (실행 중)
- [ ] Gate 3 검증 통과 (실행 후)
- [ ] Git commit

---

이제 원본 문서의 혼란스러운 부분들이 명확해졌습니다. 추가 질문 있으신가요?