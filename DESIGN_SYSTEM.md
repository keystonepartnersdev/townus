# 🎨 타운어스 디자인 시스템

## 색상 팔레트

### 주요 색상
```css
--color-primary: #1A3A52      /* 다크 네이비 */
--color-secondary: #2563EB    /* 강렬한 블루 */  
--color-accent: #10B981       /* 에메랄드 그린 */
```

### Tailwind 사용법
```jsx
<div className="bg-primary text-white">Primary</div>
<div className="bg-secondary text-white">Secondary</div>
<div className="bg-accent text-white">Accent</div>
```

## 버튼 시스템

### 기본 버튼
```jsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-ghost">Ghost Button</button>
```

### Tailwind 클래스
```jsx
<button className="bg-secondary hover:bg-primary text-white px-6 py-3 rounded-lg">
  Custom Button
</button>
```

## 카드 컴포넌트

### 기본 카드
```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

### 강조된 카드
```jsx
<div className="card-elevated">
  <h3>Elevated Card</h3>
  <p>더 강한 그림자 효과</p>
</div>
```

## 레이아웃 시스템

### 섹션
```jsx
<section className="section">        {/* py-16 lg:py-24 */}
<section className="section-sm">     {/* py-12 lg:py-16 */}
<section className="section-lg">     {/* py-20 lg:py-32 */}
```

### 컨테이너
```jsx
<div className="container">          {/* max-w-7xl */}
<div className="container-sm">       {/* max-w-4xl */}
<div className="container-xs">       {/* max-w-2xl */}
```

## 타이포그래피

### 제목
```jsx
<h1 className="heading-1">Main Title</h1>
<h2 className="heading-2">Section Title</h2>  
<h3 className="heading-3">Subsection</h3>
<h4 className="heading-4">Small Heading</h4>
```

### 본문
```jsx
<p className="text-body">기본 본문 텍스트</p>
<p className="text-muted">보조 텍스트</p>
```

## 간격 시스템

### CSS 변수
```css
--spacing-xs: 4px
--spacing-sm: 8px  
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 40px
--spacing-3xl: 60px
--spacing-4xl: 80px
```

### Tailwind 클래스
```jsx
<div className="p-xs">4px padding</div>
<div className="m-md">16px margin</div>
<div className="gap-lg">24px gap</div>
```

## 그림자 효과

### CSS 변수
```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.05)
--shadow-md: 0 2px 8px rgba(0,0,0,0.06)  
--shadow-lg: 0 10px 25px rgba(0,0,0,0.1)
--shadow-xl: 0 20px 40px rgba(0,0,0,0.15)
```

### Tailwind 클래스
```jsx
<div className="shadow-sm">작은 그림자</div>
<div className="shadow-md">중간 그림자</div>
<div className="shadow-lg">큰 그림자</div>
```

## 애니메이션

### 기본 애니메이션
```jsx
<div className="animate-fade-in">페이드 인 효과</div>
<div className="animate-slide-up">슬라이드 업 효과</div>
<div className="animate-scale-in">스케일 인 효과</div>
```

### Tailwind 애니메이션 클래스
```jsx
<div className="animate-fade-in">
<div className="animate-slide-in">
<div className="animate-bounce-slow">
```

## 폼 요소

### 입력 필드
```jsx
<input className="input" placeholder="Enter text..." />
```

### 배지
```jsx
<span className="badge">Default</span>
<span className="badge-primary">Primary</span>
<span className="badge-accent">Accent</span>
```

## 사용 예시

### 섹션 구성
```jsx
<section className="section bg-neutral-light">
  <div className="container">
    <h2 className="heading-2 text-center mb-4xl">섹션 제목</h2>
    <div className="grid md:grid-cols-2 gap-3xl">
      <div className="card">
        <h3 className="heading-4 mb-md">카드 제목</h3>
        <p className="text-body">카드 내용</p>
        <button className="btn-primary mt-lg">버튼</button>
      </div>
    </div>
  </div>
</section>
```

### 반응형 디자인
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
  <div className="card hover:shadow-lg transition-shadow">
    <!-- 카드 내용 -->
  </div>
</div>
```

## 다크 모드 지원

CSS 변수를 사용하므로 다크 모드 구현이 쉽습니다:

```css
[data-theme="dark"] {
  --color-primary: #2563EB;
  --color-neutral-dark: #E5E7EB;
  --color-neutral-light: #1F2937;
}
```

## 접근성

- 모든 상호작용 요소에 포커스 스타일 적용
- `prefers-reduced-motion` 미디어 쿼리 지원
- 시맨틱 HTML 구조 사용 권장
- 충분한 색상 대비 보장

## 성능 최적화

- CSS 변수 사용으로 런타임 테마 변경 최적화
- Tailwind의 JIT 모드로 사용되지 않는 스타일 자동 제거
- 애니메이션 최적화 (GPU 가속 사용)