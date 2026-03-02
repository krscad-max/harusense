import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = new URL('../src/content/posts/', import.meta.url).pathname;

function split(md){
  if (!md.startsWith('---')) return null;
  const idx = md.indexOf('\n---', 3);
  if (idx === -1) return null;
  const end = md.indexOf('\n', idx + 4);
  return { fm: md.slice(0, end + 1), body: md.slice(end + 1) };
}

function parseTags(fm){
  const m = fm.match(/^tags:\s*\[(.*)\]\s*$/m);
  if (!m) return [];
  return m[1].split(',').map((s)=>s.trim()).filter(Boolean);
}

function parseTitle(fm){
  const m = fm.match(/^title:\s*"(.+)"\s*$/m);
  return m ? m[1] : '';
}

function charCount(body){
  return body.replace(/\s+/g,' ').trim().length;
}

function blockFor(tags, title){
  const has = (t)=>tags.includes(t);

  if (has('english') || has('phone') || has('work') || has('rent') || has('bank') || has('hospital') || has('airport')){
    return `
## 실전 확장(조금 더 ‘사람 말’처럼)

같은 내용도 톤이 달라지면 결과가 달라져요. 아래는 “딱딱한 문장”을 **대화체로 부드럽게** 만드는 확장입니다.

### 1) 완충 한 마디 붙이기
- **Quick question:** …
- **Just to confirm:** …
- **If you don’t mind:** …

이 한 마디가 붙으면 상대가 ‘요구’가 아니라 ‘협조 요청’으로 받아들여요.

### 2) 정보가 부족할 때(대충 말하지 않기)
- I’m not sure, but I think …
- I might be wrong, but …
- Let me check and get back to you.

### 3) 못 알아들었을 때(당황하지 않는 문장)
- Could you say that again, a bit slower?
- Could you spell that?
- Sorry, the line is breaking up.

### 4) 오늘의 미니 연습(1분)
아래를 소리 내서 3번만 읽어도 입이 풀려요.

> Hi, I’m calling about ${title || 'this'}. Just to confirm, could you please email me the details?
`;
  }

  if (has('japanese') || has('travel') || has('restaurant') || has('station') || has('hotel') || has('convenience')){
    return `
## 실전 확장(여행자 톤)

일본어는 “정확한 문법”보다 **짧게 말하고, 천천히, 예의 있게**가 체감이 큽니다.

### 1) 3단 콤보(가장 안전)
- すみません。(실례합니다)
- これ、お願いします。(이거 부탁해요)
- ありがとうございます。(감사합니다)

### 2) 못 알아들었을 때(이 문장 하나면 됨)
- もう一度お願いします。(한 번 더 부탁합니다)
- ゆっくりお願いします。(천천히 부탁합니다)

### 3) 표정/제스처 팁
- 메뉴판/표지판을 **가리키면서 말하면** 성공률이 급상승합니다.

### 4) 오늘의 미니 연습(30초)
- すみません、これお願いします。
- ありがとうございます。
`;
  }

  // 생활 글
  return `
## 한 단계 더 깊게(유지되는 방법)

좋은 팁은 많지만, 유지되는 팁은 드뭅니다. 유지의 핵심은 **규칙을 늘리는 게 아니라 ‘실패했을 때 돌아오는 길’을 만들어두는 것**이에요.

### 실패했을 때 복구 규칙(추천)
- 100% 못 하면 **60% 버전**으로
- 60%도 못 하면 **10분 버전**으로

### 오늘의 체크(10초)
- “내가 오늘 가장 줄이고 싶은 마찰(귀찮음)은 무엇인가?”
- 그 마찰을 1개만 낮추는 장치를 설치하기
`;
}

const MIN = 1500;
const files = readdirSync(postsDir).filter((f)=>f.endsWith('.md'));
let changed = 0;

for (const f of files){
  const full = join(postsDir, f);
  const md = readFileSync(full, 'utf8');
  const p = split(md);
  if (!p) continue;

  const tags = parseTags(p.fm);
  const title = parseTitle(p.fm);

  let body = p.body;
  let n = charCount(body);

  // Keep adding until min chars
  let guard = 0;
  while (n < MIN && guard < 3){
    body = body.trimEnd() + '\n\n' + blockFor(tags, title).trim() + '\n';
    n = charCount(body);
    guard++;
  }

  if (body !== p.body){
    writeFileSync(full, p.fm + body.trimStart(), 'utf8');
    changed++;
  }
}

console.log(`Updated ${changed} posts to reach >=${MIN} chars (best-effort).`);
