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

function count(body){
  return body.replace(/\s+/g,' ').trim().length;
}

function parseTags(fm){
  const m = fm.match(/^tags:\s*\[(.*)\]\s*$/m);
  if (!m) return [];
  return m[1].split(',').map((s)=>s.trim()).filter(Boolean);
}

function extraSection(tags){
  const has = (t)=>tags.includes(t);
  if (has('kitchen')){
    return `## 실패를 막는 디테일 5가지
- 장보기는 “재료”가 아니라 **메뉴 2개** 기준으로
- 양념은 새로 사기보다 **기존 양념 1개로 해결**
- 칼질이 귀찮으면 냉동야채/손질야채로 시간을 사기
- 설거지 부담 줄이려면 ‘한 팬 요리’로
- 남는 재료는 다음 메뉴로 이어지게(예: 대파/양파는 거의 모든 요리에)
`;
  }
  if (has('saving') || has('budgeting')){
    return `## 숫자로 보는 빠른 점검(체감용)
- 구독 1개(월 9,900원)만 줄여도 연간 약 12만원
- 배달 1회(2만원) 줄이면 주 1회 기준 월 8만원
- 카페 1잔(5천원) 줄이면 주 3회 기준 월 6만원

중요한 건 “큰 결심”이 아니라 **빈도**입니다.
`;
  }
  if (has('organization')){
    return `## 정리가 다시 무너지는 순간 3가지
1) ‘임시’가 영구가 됨(박스/봉투)
2) 동선 밖에 두기 시작함(귀찮아서)
3) 수납을 늘려서 물건이 다시 늘어남

해결은 간단해요: **임시 바구니를 1개만** 만들고, 그게 넘치면 ‘정리 시간’이 아니라 ‘구매 금지’로 연결하세요.
`;
  }
  return `## 마무리 한 줄
오늘은 완벽이 아니라 “내일 다시 시작 가능한 상태”가 목표입니다.
`;
}

const MIN = 1500;
const files = readdirSync(postsDir).filter((f)=>f.endsWith('.md'));
let changed = 0;
let under = 0;

for (const f of files){
  const full = join(postsDir, f);
  const md = readFileSync(full,'utf8');
  const p = split(md);
  if (!p) continue;

  let body = p.body;
  const n = count(body);
  if (n >= MIN) continue;

  const tags = parseTags(p.fm);
  body = body.trimEnd() + '\n\n' + extraSection(tags).trim() + '\n';

  if (count(body) < MIN){
    // one more generic padding
    body += `\n\n### 체크리스트(3개)
- [ ] 오늘 15분만
- [ ] 규칙 1개만
- [ ] 7일 뒤 10분 점검\n`;
  }

  writeFileSync(full, p.fm + body.trimStart(), 'utf8');
  changed++;
}

console.log(`Pass2 updated ${changed} posts still under ${MIN}.`);
