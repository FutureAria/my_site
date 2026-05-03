# 배포/운영 기록

## 2026-05-03

### Oracle 배포 전환

- 포트폴리오 사이트를 Oracle 서버에 Next.js 실행형으로 배포했습니다.
- 최종 주소는 `https://juyoung-portfolio.duckdns.org`입니다.
- Caddy가 `juyoung-portfolio.duckdns.org`를 받아 `127.0.0.1:3000`의 Next.js 서버로 연결합니다.
- `my-site` systemd 서비스로 서버 재시작 후에도 자동 실행되게 설정했습니다.

### 모바일 앱/PWA

- `manifest.webmanifest`를 추가해 휴대폰에서 홈 화면 앱처럼 설치할 수 있게 했습니다.
- `sw.js` 서비스워커를 추가해 기본 페이지 캐시를 지원합니다.
- HTTPS 인증서를 Caddy/Let's Encrypt로 발급받았습니다.

### 업로드 용량 최적화

- Admin에서 JPG/PNG/WebP 이미지를 올리면 서버에서 WebP로 자동 압축 저장하도록 변경했습니다.
- 기존 업로드 이미지 53장을 WebP로 변환했습니다.
- `public/uploads` 용량이 약 `71MB`에서 약 `18MB`로 줄었습니다.
- PDF 1개가 약 `15MB`라서, 실제 이미지 용량은 약 `3MB` 수준입니다.

### 속도 개선

- Caddy에 `zstd/gzip` 압축을 적용했습니다.
- `/_next/static/*`, `/uploads/*`에는 장기 캐시 헤더를 적용했습니다.
- `/uploads/*`는 Next.js를 거치지 않고 Caddy가 직접 파일을 제공하도록 변경했습니다.
- Caddy가 `/home/ubuntu/my_site/public/uploads`를 읽을 수 있도록 `/home/ubuntu`에 통과 권한만 추가하도록 설정했습니다.

### 프로젝트 외부 자료

- 프로젝트별로 서버/Demo 주소, GitHub 주소, PDF 설명서 경로를 관리할 수 있게 했습니다.
- 프로젝트 상세 페이지에서 값이 있는 버튼만 노출합니다.
- PDF는 Admin에서 업로드하거나 `/uploads/...pdf` 경로를 직접 입력할 수 있습니다.

### UI/UX 정리

- 한글 큰 제목에 `word-break: keep-all` 기반 클래스를 적용해 어색한 글자 단위 줄바꿈을 줄였습니다.
- About 큰 제목은 의도적인 들여쓰기 구조로 정리했습니다.
- 이미지가 없는 프로젝트는 빈 박스 대신 `PREPARING` 플레이스홀더로 보이게 했습니다.
- 프로젝트 Admin 입력 영역을 `BASIC`, `IMAGES`, `LINKS`, `DETAIL` 순서로 구분했습니다.

### 자주 쓰는 명령어

```bash
npm run deploy:oracle
npm run watch:oracle
npm run check:oracle
npm run optimize:uploads
```

### 주의

- `.env.oracle`, `.env.local`, `.env.dothome`은 GitHub에 올리지 않습니다.
- 서버 Admin에서 수정한 `data/portfolio.json`, `public/uploads`는 배포 시 기본적으로 덮어쓰지 않게 했습니다.
- 사이트 주소는 HTTPS 주소를 기준으로 사용합니다.
