# Oracle 자동 배포 가이드

오라클 서버는 현재 아래 정도의 용량이 남아 있습니다.

```text
/dev/sda1 45G 중 4.8G 사용, 41G 남음
```

닷홈 무료호스팅 500MB보다 훨씬 여유가 있어서, 포트폴리오 사이트를 올리기에는 오라클이 더 안정적입니다.

## 방식

오라클은 Next.js 앱을 그대로 실행하는 방식입니다.

```text
로컬 코드 수정
-> GitHub push
-> rsync로 오라클 서버에 코드 업로드
-> 서버에서 npm ci
-> 서버에서 npm run build
-> systemd 서비스 재시작
-> Caddy가 80번 포트로 연결
```

## 처음 한 번만 설정

`.env.oracle.example`을 복사해서 `.env.oracle`을 만듭니다.

```bash
cp .env.oracle.example .env.oracle
```

그 다음 `.env.oracle`에서 관리자 비밀번호만 실제 값으로 바꿉니다.

```env
ADMIN_PASSWORD=021111
```

`.env.oracle`은 GitHub에 올라가지 않도록 `.gitignore`에 등록되어 있습니다.

## 서버 초기 설정

처음 한 번만 실행합니다.

```bash
npm run setup:oracle
```

이 명령은 오라클 서버에 아래 설정을 준비합니다.

- Node.js 설치
- `/home/ubuntu/my_site` 배포 폴더 생성
- `my-site` systemd 서비스 생성
- Caddy에 `http://132.145.186.82` reverse proxy 추가

## 수동 배포

```bash
npm run deploy:oracle
```

이 명령은 코드를 오라클 서버로 올리고 서버에서 빌드한 뒤 서비스를 재시작합니다.

## 자동 배포

작업하는 동안 아래 명령을 켜두면 됩니다.

```bash
npm run watch:oracle
```

이 상태에서 Codex가 코드를 수정하면 변경을 감지해서 자동으로 오라클 서버에 다시 배포합니다.

## 용량 관리

오라클 자동 배포는 아래 파일을 올리지 않습니다.

```text
node_modules/
.next/
dist/
CoverLetter/
.env*
public/uploads/*.pdf
```

또한 서버에서 Admin으로 수정한 `data/portfolio.json`과 `public/uploads/`는 기본적으로 덮어쓰지 않습니다. 처음 없는 파일만 채우고, 이후 서버에서 수정한 내용은 보존합니다.

## 용량 확인

```bash
npm run check:oracle
```

## 현재 추천

용량과 Admin 기능까지 생각하면 추천은 오라클입니다.

닷홈은 500MB 제한이 있고 PHP/정적 배포 중심이라 가볍게 보여주는 데 좋습니다. 오라클은 41GB 정도 여유가 있고 Next.js 서버를 실행할 수 있어서 Admin 저장, 이미지 업로드, PDF 다운로드 같은 기능까지 유지하기 좋습니다.
