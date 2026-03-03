# YouTube 업로드 자동화 (로컬 Mac mini + cron)

## 0) 준비
- Node.js 설치됨
- `brew install ffmpeg` (영상 제작 단계에서 필요)

## 1) OAuth Client 생성 (Google Cloud)
- Credentials → Create Credentials → OAuth client ID
- Application type: **Desktop app**
- 생성 후 **Client ID / Client Secret** 확보

## 2) 환경변수 파일 생성
`harusense/tools/youtube/.env`

```bash
YOUTUBE_CLIENT_ID="..."
YOUTUBE_CLIENT_SECRET="..."
# 아래는 auth 실행 후 채워짐
YOUTUBE_REFRESH_TOKEN=""
```

## 3) Refresh Token 발급(1회)
```bash
cd harusense
node tools/youtube/auth.mjs
```
브라우저가 열리면 Google 로그인 → 권한 승인.
콘솔에 Refresh Token이 출력되면 `.env`에 붙여넣기.

## 4) 업로드 테스트
```bash
cd harusense
node tools/youtube/upload.mjs \
  --file ./shorts/sample.mp4 \
  --title "테스트 쇼츠" \
  --description "자동 업로드 테스트" \
  --tags "harusense,shorts,science" \
  --privacy unlisted
```

## 5) cron 등록
예: 매일 09:00에 실행
```bash
crontab -e
```

```cron
0 9 * * * /usr/bin/env bash -lc 'cd /Users/sj/.openclaw/workspace/harusense && node tools/shorts/run_daily.mjs >> /Users/sj/.openclaw/workspace/harusense/tools/youtube/cron.log 2>&1'
```
