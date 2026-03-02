import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = new URL('../src/content/posts/', import.meta.url).pathname;

function split(md){
  if (!md.startsWith('---')) return null;
  const idx = md.indexOf('\n---', 3);
  if (idx === -1) return null;
  const end = md.indexOf('\n', idx + 4);
  return { fm: md.slice(0, end + 1), body: md.slice(end + 1) };
}

function addIfMissing(body, marker, section){
  if (body.includes(marker)) return body;
  return body.trimEnd() + `\n\n${section.trim()}\n`;
}

function detectLang(fm){
  if (/tags:\s*\[[^\]]*english/.test(fm)) return 'en';
  if (/tags:\s*\[[^\]]*japanese/.test(fm)) return 'jp';
  return null;
}

function englishDeepen(){
  return {
    marker: '## 실전 대화(진짜 자주 쓰는 3턴)',
    section: `## 실전 대화(진짜 자주 쓰는 3턴)

아래 3턴만 자연스럽게 나오면, “영어 잘한다”가 아니라 **실제로 일이 진행**됩니다.

- **A:** Hi, I’m calling about (___). 
- **B:** Sure. How can I help?
- **A:** Could you please (___)?

### 상황별로 빈칸 채우기
- calling about: *my reservation / my order / my account*
- could you please: *check the status / send me an email / repeat that*

## 한국인이 자주 하는 실수(그리고 대안)
1) 너무 길게 말하려고 함 → **짧게 끊고 질문**하세요.
2) 못 알아들었는데 “OK” 해버림 → *Could you repeat that?*가 안전합니다.
3) 부탁이 명령처럼 들림 → 문장 앞에 **Could you please**를 붙이면 톤이 정리됩니다.

## 자연스럽게 들리는 마무리 2개
- Thanks for your help. Have a good day.
- Great, I appreciate it. Bye.
`
  };
}

function japaneseDeepen(){
  return {
    marker: '## 실전 패턴(짧게, 정확하게)',
    section: `## 실전 패턴(짧게, 정확하게)

일본어는 길게 말하려고 하면 바로 막혀요. 여행자는 **짧은 패턴 + 제스처**가 정답입니다.

### 1) 요청 패턴
- すみません。(실례합니다)
- これ、お願いします。(이거 부탁해요)

### 2) 확인 패턴
- ここでいいですか？(여기 맞나요?)
- だいじょうぶですか？(괜찮나요?)

## 여행자가 자주 겪는 3가지 상황
1) 질문을 못 알아듣는 경우
- **대답:** もう一度お願いします。(한 번 더 부탁합니다)

2) 거절을 부드럽게 해야 하는 경우
- **대답:** 大丈夫です。ありがとうございます。(괜찮아요, 감사합니다)

3) 계산/마무리
- **대답:** お会計お願いします。(계산 부탁합니다)

## 오늘의 미션(20초)
- 위 패턴 중 하나를 골라서, 소리 내서 3번만 말해보기
`
  };
}

const files = readdirSync(dir)
  .filter((f) => f.startsWith('2026-03-02-english-') || f.startsWith('2026-03-02-japanese-'));

let changed = 0;
for (const f of files){
  const full = join(dir, f);
  const md = readFileSync(full, 'utf8');
  const p = split(md);
  if (!p) continue;

  const lang = detectLang(p.fm);
  if (!lang) continue;

  let body = p.body;
  if (lang === 'en'){
    const s = englishDeepen();
    body = addIfMissing(body, s.marker, s.section);
  } else {
    const s = japaneseDeepen();
    body = addIfMissing(body, s.marker, s.section);
  }

  if (body !== p.body){
    writeFileSync(full, p.fm + body.trimStart(), 'utf8');
    changed++;
  }
}

console.log(`Deepened ${changed} language posts.`);
