# Dothome / FileZilla Upload Guide

## 먼저 확인할 것

이 사이트는 Next.js 앱입니다. 화면뿐 아니라 Admin 저장, 이미지 업로드, PDF 업로드가 아래 서버 API를 사용합니다.

- `/api/admin-login`
- `/api/admin-logout`
- `/api/portfolio`
- `/api/upload`

그래서 닷홈 계정이 일반 FTP/PHP 웹호스팅만 지원하면 현재 Admin 기능은 그대로 동작하지 않습니다. Admin까지 서버에서 수정하려면 Node.js 실행이 가능한 호스팅이어야 합니다.

## FileZilla 위치

현재 FileZilla 화면 기준 원격 사이트의 `/html` 폴더가 웹 루트입니다.

메인 도메인에 바로 보여줄 경우:

```text
/html
```

별도 폴더로 테스트하고 싶을 경우:

```text
/html/my_site
```

다만 Next.js 서버 실행형 배포에서는 단순히 `/html`에 파일을 올리는 것만으로는 부족하고, 서버에서 `npm install`, `npm run build`, `npm start` 같은 실행 과정이 필요합니다.

## 현재 닷홈 계정 확인 결과

마이닷홈 화면 기준 현재 계정은 아래 상태입니다.

```text
서비스: 무료호스팅
기본 제공 도메인: juwwkd.dothome.co.kr
웹서버: Apache 2.4
PHP: 8.4
웹 루트 디렉터리: /hosting/juwwkd/html
FTP 아이디: juwwkd
FTP 접속: 접속허용
SSH 접속: 접속제한, 포트 2022
```

이 정보만 보면 현재 계정은 Node.js 서버 실행형 호스팅이 아니라 Apache/PHP 웹호스팅입니다. 따라서 현재 Next.js 서버 앱을 그대로 올려서 `/api/*`와 Admin 저장 기능까지 실행하는 방식은 맞지 않습니다.

현재 계정에 맞는 방향은 아래 둘 중 하나입니다.

```text
1. 정적 사이트로 빌드해서 /hosting/juwwkd/html 에 업로드
2. Admin 저장/업로드 기능은 PHP 방식으로 전환
```

## Node.js 지원 호스팅일 때 올릴 파일

FileZilla로 아래 항목을 업로드합니다.

```text
app/
components/
data/
lib/
public/
scripts/
middleware.ts
next-env.d.ts
next.config.js
package.json
package-lock.json
postcss.config.js
tailwind.config.js
tsconfig.json
```

올리지 않아도 되는 것:

```text
node_modules/
.next/
.git/
CoverLetter/
.env.local
.DS_Store
```

서버에서 설정할 환경변수:

```bash
ADMIN_PASSWORD=원하는_관리자_비밀번호
NEXT_PUBLIC_SITE_URL=https://juwwkd.dothome.co.kr
```

서버에서 실행:

```bash
npm install
npm run build
npm start
```

## Admin까지 수정 가능하게 하려면

서버에서 아래 경로가 쓰기 가능해야 합니다.

```text
data/portfolio.json
public/uploads/
```

권한 예시:

```bash
chmod 664 data/portfolio.json
chmod 775 public/uploads
```

Admin에서 이미지를 올리면 `public/uploads/`에 파일이 저장되고, 글/프로젝트 내용은 `data/portfolio.json`에 저장됩니다.

## 일반 닷홈 FTP/PHP 호스팅일 때

일반 FTP/PHP 호스팅이면 정적 화면 업로드는 가능하지만, 현재 Next.js Admin API는 실행되지 않습니다.

가능한 선택지는 둘 중 하나입니다.

1. Admin은 로컬에서만 사용하고, 수정 후 다시 배포하기
2. Admin 저장/업로드 API를 PHP 버전으로 새로 만들어 닷홈 PHP 호스팅에 맞추기

2번으로 가면 FileZilla만으로도 서버에서 수정 가능하게 만들 수 있지만, 현재 Next.js API 구조를 PHP 저장 방식으로 바꾸는 추가 작업이 필요합니다.

## 자동 반영 방식

로컬에서 Codex가 코드를 수정했을 때 서버까지 자동 반영하는 방법은 세 가지입니다.

### 1. FTP 자동 업로드

현재 닷홈 웹호스팅에 가장 현실적인 방식입니다.

흐름:

```text
Codex가 로컬 코드 수정
-> npm run build 또는 정적 파일 생성
-> npm run deploy:dothome
-> /html 로 자동 FTP 업로드
```

장점:

- FileZilla로 직접 드래그하지 않아도 됩니다.
- 코드, CSS, 이미지, 정적 파일 수정 반영이 빠릅니다.

주의:

- 현재 Next.js 서버 API는 FTP 업로드만으로 실행되지 않습니다.
- Admin 저장 기능까지 서버에서 쓰려면 PHP 방식으로 바꾸거나 Node.js 서버가 필요합니다.

### 2. PHP Admin 방식으로 전환

닷홈 웹호스팅이 PHP를 지원하므로, Admin 저장/업로드 API를 PHP로 바꾸는 방식입니다.

흐름:

```text
/admin 접속
-> 내용 수정
-> PHP가 data/portfolio.json 저장
-> PHP가 public/uploads 에 이미지 저장
-> 사이트에 바로 반영
```

장점:

- 닷홈 웹호스팅에 잘 맞습니다.
- 서버에서 직접 프로젝트/이미지/자기소개서 PDF를 수정할 수 있습니다.
- FileZilla는 처음 배포할 때만 쓰면 됩니다.

주의:

- 현재 Next.js API를 PHP API로 바꾸는 리팩터링이 필요합니다.
- 화면 데이터도 빌드 시점 고정이 아니라 JSON을 읽어 반영하는 구조로 바꾸는 것이 좋습니다.

### 3. Node.js 서버 또는 VPS 사용

닷홈 서버호스팅이나 다른 Node.js 지원 호스팅을 쓰는 방식입니다.

흐름:

```text
GitHub push 또는 SSH deploy
-> 서버에서 npm install / npm run build
-> npm start 또는 PM2 실행
```

장점:

- 지금 만든 Next.js 구조를 거의 그대로 사용할 수 있습니다.
- Admin API도 그대로 유지할 수 있습니다.

주의:

- 일반 웹호스팅보다 서버 관리가 필요합니다.
- 닷홈 일반 웹호스팅의 `/html`에 파일만 올리는 방식과 다릅니다.

## 추천 결론

지금 FileZilla 화면처럼 `/html`에 업로드하는 닷홈 웹호스팅을 계속 쓸 거라면 추천은 아래 조합입니다.

```text
코드/디자인 수정 자동 반영: FTP 자동 업로드 스크립트
Admin에서 글/이미지 수정: PHP Admin 방식
```

이렇게 바꾸면 Codex가 수정한 코드는 명령어 한 번으로 닷홈에 올라가고, 포트폴리오 내용/이미지/PDF는 서버 Admin에서 직접 바꿀 수 있습니다.

## 현재 추가된 자동 업로드 명령어

1차로 코드/디자인 수정분을 닷홈에 자동 업로드할 수 있는 명령어를 추가했습니다.

```bash
npm run build:dothome
npm run deploy:dothome
```

한 번에 하려면:

```bash
npm run publish:dothome
```

`build:dothome`은 로컬 Next 사이트를 정적 HTML 파일로 묶어서 아래 폴더에 만듭니다.

```text
dist/dothome
```

`deploy:dothome`은 `dist/dothome` 안의 파일을 닷홈 FTP `/html`로 업로드합니다.

## 처음 한 번 해야 할 설정

`.env.dothome.example` 파일을 복사해서 `.env.dothome` 파일을 만듭니다.

```bash
cp .env.dothome.example .env.dothome
```

그 다음 `.env.dothome` 안의 FTP 비밀번호만 실제 값으로 바꿉니다.

```text
DOTHOME_FTP_HOST=juwwkd.dothome.co.kr
DOTHOME_FTP_USER=juwwkd
DOTHOME_FTP_PASSWORD=여기에_FTP_비밀번호
DOTHOME_REMOTE_DIR=/html
DOTHOME_LOCAL_DIR=dist/dothome
DOTHOME_FTP_CLEAN=false
NEXT_PUBLIC_SITE_URL=https://juwwkd.dothome.co.kr
```

주의: `.env.dothome`에는 비밀번호가 들어가므로 GitHub나 공개 저장소에 올리면 안 됩니다.

## 지금 자동화로 되는 것과 안 되는 것

되는 것:

- Codex가 코드/디자인 수정
- `npm run publish:dothome`
- 닷홈 `/html`에 자동 업로드
- 공개 사이트 화면 반영

추가된 것:

- 닷홈용 `/admin`, `/admin/login` 정적 페이지 포함
- 닷홈용 PHP 로그인 API: `/api/admin-login.php`
- 닷홈용 PHP 로그아웃 API: `/api/admin-logout.php`
- 닷홈용 PHP 데이터 저장 API: `/api/portfolio.php`
- 닷홈용 PHP 이미지/PDF 업로드 API: `/api/upload.php`
- 서버 저장 데이터: `/data/portfolio.json`
- 서버 업로드 위치: `/uploads`
- 홈, 소개, 프로젝트 목록, 프로젝트 상세, Journal, Contact 페이지의 클라이언트 최신 데이터 자동 로드

현재 공개 페이지는 정적 HTML로 먼저 열리고, 브라우저에서 `/api/portfolio.php`를 다시 읽어 최신 서버 데이터로 갱신됩니다. 그래서 Admin에서 저장한 뒤 공개 페이지를 새로고침하면 주요 화면이 최신 `data/portfolio.json` 기준으로 반영됩니다.

따라서 운영 흐름은 아래처럼 쓰는 것이 안정적입니다.

```text
코드/디자인 수정 -> npm run publish:dothome
문구/프로젝트/Journal/PDF/이미지 수정 -> 서버 /admin 사용
공개 화면 확인 -> 새로고침
```

## 완전 자동 감시 모드

매번 `npm run publish:dothome`을 직접 치지 않으려면 감시 모드를 켭니다.

```bash
npm run watch:dothome
```

이 명령어를 켜둔 상태에서 아래 파일들이 바뀌면 자동으로 닷홈에 다시 업로드합니다.

```text
app/
components/
data/
dothome/
lib/
public/
설정 파일들
```

흐름:

```text
Codex가 코드 수정
-> watch:dothome 이 변경 감지
-> build:dothome 자동 실행
-> deploy:dothome 자동 실행
-> 닷홈 /html 자동 반영
```

주의:

- `.env.dothome`에 FTP 비밀번호가 있어야 동작합니다.
- 감시 모드는 켜져 있는 동안만 자동 반영됩니다.
- 여러 파일이 연속으로 바뀌면 2.5초 정도 기다렸다가 한 번만 업로드합니다.
- 큰 수정 중에는 여러 번 업로드될 수 있으니, 작업량이 많을 때는 잠깐 꺼두고 마지막에 `npm run publish:dothome`을 실행해도 됩니다.

## 용량 관리

닷홈 무료호스팅은 디스크가 500MB로 제한되어 있습니다. 현재 계정은 약 273MB를 사용 중이라, 배포 파일은 최대한 작게 유지해야 합니다.

현재 배포 과정에는 이미지 최적화가 포함되어 있습니다.

```bash
npm run optimize:dothome
```

`npm run publish:dothome`을 실행하면 자동으로 아래 순서가 실행됩니다.

```text
build:dothome
-> optimize:dothome
-> deploy:dothome
```

최적화 결과:

```text
기존 dist/dothome: 약 73MB
최적화 후 dist/dothome: 약 20MB
```

이미지는 배포 폴더에서 WebP로 변환되고, HTML/JS/JSON 안의 이미지 경로도 자동으로 `.webp`로 바뀝니다. 원본 `public/uploads` 파일은 유지됩니다.

서버 Admin 업로드 제한:

```text
이미지: 최대 3MB
PDF: 최대 8MB
```

용량이 부족해지면 먼저 확인할 곳:

```text
uploads/
PDF 파일
오래된 admin-* 이미지
```

제한:

- Admin에서 프로젝트를 완전히 새로 추가하면 `/projects/6` 같은 새 상세 페이지 경로는 기존 정적 빌드에 없을 수 있습니다. 이 경우 `npm run publish:dothome`을 한 번 다시 실행해야 새 상세 경로까지 생깁니다.
- 기존 프로젝트/문구/이미지/PDF/Journal 수정은 새로고침으로 반영됩니다.
