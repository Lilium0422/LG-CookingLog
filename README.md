# 🍳 CookingLog (쿠킹로그)
> **요리 레시피 공유 및 기록 플랫폼**

## 📌 프로젝트 개요
**쿠킹로그**는 사용자가 직접 레시피를 공유하고
다른 사용자가 별점과 후기를 남겨 **검증된 레시피를 축적하는 요리 커뮤니티 플랫폼**입니다.
본 프로젝트는
**LG U+ 유레카 3기 프론트엔드 비대면반 미니프로젝트 2**로 진행되었으며,
프론트엔드 중심의 서비스 기획·구현 및 팀 협업 경험을 목표로 제작되었습니다.

## ⚙️ 포팅 매뉴얼 (실행 방법)
### 1️⃣ 프로젝트 설치
```bash
npm install
```

### 2️⃣ AI 기능 사용을 위한 라이브러리 설치
```bash
npm i react-markdown
npm install @google-cloud/vision
```

* `react-markdown`
  → AI 챗봇 응답을 마크다운 형식으로 렌더링
* `@google-cloud/vision`
  → 음식 이미지 인식을 위한 Google Cloud Vision API 연동

### 3️⃣ 환경 변수 설정 (.env.local)
프로젝트 루트에 `.env.local` 파일을 생성 후 아래 값을 추가합니다.
```env
GOOGLE_VISION_CREDENTIALS=...
GROQ_API_KEY=...
NEXT_PUBLIC_KAKAO_JS_KEY=...
```
> ⚠️ `.env.local` 파일은 Git에 커밋하지 않습니다.

### 4️⃣ 실행
```bash
npm run dev
```

## 🎯 프로젝트 목표
* Next.js, TypeScript 기반 프론트엔드 개발 경험
* 실제 사용자 흐름을 고려한 UI/UX 구현
* REST API 연동 및 협업 경험
* 기능 단위 브랜치 전략을 통한 팀 개발


## 🛠 기술 스택
### Frontend

* TypeScript
* Next.js
* CSS / CSS Module

### Backend
* **Kotlin**
* **Spring Boot**
* Spring Security + JWT
* RESTful API

### Database
* MySQL

### AI & External API
* Groq LLM (LLaMA 계열)
* Google Cloud Vision API

---

## ✨ 핵심 기능
### 회원
* 회원가입 / 로그인
* 회원정보 수정
* 내가 작성한 레시피·댓글 마이페이지 조회

### 레시피
* 레시피 등록 / 조회 / 수정 / 삭제
* 최신순 · 인기순 · 별점순 정렬
* 카테고리 및 재료 필터링
* 좋아요 기능

### 별점 & 댓글
* 1~5점 별점 등록
* 댓글 CRUD
* 별점 평균 자동 계산

### AI 기능
* 음식 사진 업로드 시 음식 추정 및 칼로리 분석
* 레시피·요리 관련 질문 응답 AI 쿠킹봇 제공

---

## 🌱 브랜치 전략

```
main
 └─ develop
     └─ feature/*
```

* 기능 단위 `feature` 브랜치 개발
* `develop` 병합 후 `main` 반영

---

## 🖤 커밋 메시지 컨벤션

```
feat: 기능 요약

- 변경 내용 요약
```

**타입**
등`feat`, `fix`, `docs`, `design`, `refactor`, `chore`

---

## 📅 개발 일정

**2025.12.09 ~ 2025.12.22**

| 주차  | 주요 내용                      |
| --- | -------------------------- |
| 1주차 | 기획, UI/UX 설계, 기본 기능 구현     |
| 2주차 | API 연동, AI 기능 구현, 테스트 및 정리 |

---

## 👥 역할 분담

| 이름       | 담당                                     |
| -------- | -------------------------------------- |
| 김예린 (팀장) | 홈, 로그인/가입, 이벤트 페이지, AI 쿠킹봇             |
| 류종현      | 마이페이지, 관리자 페이지, QA, 문서화                |

| 이동연      | **Kotlin 기반 백엔드 API 개발, DB 설계, 보안 설정** |
| 이혁준      | 레시피 게시판, 댓글·별점 기능 구현, 발표                 |

---

## ✅ 프로젝트 결과
<img width="1913" height="871" alt="image" src="https://github.com/user-attachments/assets/baba0d16-826f-40db-bc17-97583f3709a6" />
**GitHub:** https://github.com/yerroong/LG-CookingLog
**Notion:** https://www.notion.so/yerin1412/2-1-2-2c3389b3e03980f59fe8e2e81e321dcb
**vercel:** https://lg-cooking-log-q9bu.vercel.app/home
**Figma:** https://www.figma.com/design/GkoiAayV0ldboQNDI2mGX1/%EC%BF%A0%ED%82%B9%EB%A1%9C%EA%B7%B8?node-id=0-1&p=f&t=1kSNb9kNcjQyaGIt-0

* 사용자 참여 기반 레시피 커뮤니티 구현
* Kotlin + Spring Boot 기반 안정적인 백엔드 API 구축
* AI를 활용한 음식 분석 및 요리 보조 기능 제공
* 프론트엔드 중심 팀 협업 및 실무 흐름 경험

### ✨ 한 줄 요약> **“Kotlin 백엔드와 AI 요리 도우미를 결합한 사용자 참여형 레시피 플랫폼”**

�허브 공개용으로 딱 좋은 상태**야 👍
