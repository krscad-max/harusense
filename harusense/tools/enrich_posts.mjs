import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = new URL('../src/content/posts/', import.meta.url).pathname;

function split(md) {
  if (!md.startsWith('---')) return null;
  const idx = md.indexOf('\n---', 3);
  if (idx === -1) return null;
  const end = md.indexOf('\n', idx + 4);
  const fm = md.slice(0, end + 1);
  const body = md.slice(end + 1);
  return { fm, body };
}

function parseTags(fm) {
  const m = fm.match(/^tags:\s*\[(.*)\]\s*$/m);
  if (!m) return [];
  return m[1].split(',').map((s) => s.trim()).filter(Boolean);
}

function parseTitle(fm) {
  const m = fm.match(/^title:\s*"(.+)"\s*$/m);
  return m ? m[1] : null;
}

function addIfMissing(body, marker, content) {
  if (body.includes(marker)) return body;
  return body.trimEnd() + `\n\n${content.trim()}\n`;
}

function section({ title, tags }) {
  const has = (t) => tags.includes(t);
  const theme = has('kitchen')
    ? 'kitchen'
    : has('organization')
      ? 'organization'
      : has('budgeting')
        ? 'budgeting'
        : has('saving')
          ? 'saving'
          : has('consumption')
            ? 'consumption'
            : 'routine';

  const examples = {
    kitchen: `## 실전 예시(바로 따라하기)\n- **퇴근 후 0% 체력일 때:** 냉동밥 + 계란 + 김 + 간장(3분)\n- **주 1회 밀프렙:** 단백질 1종 + 야채 1종만 미리 만들어두기\n- **배달 눌렀을 때 대체 행동:** 물 한 컵 마시고 5분만 ‘집에 있는 재료’ 확인\n`,
    organization: `## 실전 예시(바로 따라하기)\n- **현관 리셋:** 신발 5켤레만 남기고 나머지는 ‘보류 박스’로\n- **테이블 리셋:** 서류/충전기/리모컨을 한 바구니로 통일\n- **정리 유지 규칙:** “새 물건 1개 들어오면 1개 나가기(1-in-1-out)”\n`,
    budgeting: `## 실전 예시(바로 따라하기)\n- **카드 결제일 통일:** 결제일을 월급날 직후로 맞추면 체감 난이도가 내려감\n- **변동비 봉투 4개:** 식비/생활/이동/즐거움만 관리(세분화 금지)\n- **월 1회 리셋:** 구독/통신/보험만 점검해도 새는 돈이 줄어듦\n`,
    saving: `## 실전 예시(바로 따라하기)\n- **구독 정리 5분:** 결제 내역에서 ‘정기결제’만 모아 해지 후보 체크\n- **장바구니 24시간:** 급하게 사고 싶은 건 하루만 묵히기\n- **지출 브레이크 1개:** 배달 ‘주 2회’처럼 단순한 제한부터\n`,
    consumption: `## 실전 예시(바로 따라하기)\n- **충동구매 트리거:** 피곤/스트레스/심심함 중 무엇인지 먼저 라벨링\n- **마찰 올리기:** 쇼핑앱 로그아웃 + 결제 비밀번호 재설정\n- **대체 행동:** 위시리스트에 적고, 다음 날 다시 보기\n`,
    routine: `## 실전 예시(바로 따라하기)\n- **15분 루틴:** 타이머 켜고 ‘눈에 보이는 것 10개만’ 처리\n- **규칙은 1개만:** “일요일 15분 점검” 같은 최소 유지 장치\n- **실패해도 축소:** 10분 버전으로라도 ‘끊기지 않게’ 유지\n`,
  };

  const faq = `## 자주 묻는 질문(FAQ)\n**Q. 시간이 없어서 못 하겠어요.**\nA. 그래서 15~30분 버전으로 설계했습니다. ‘완성’이 아니라 ‘재시작 가능한 상태’를 만드는 게 목표예요.\n\n**Q. 며칠 하다가 다시 무너져요.**\nA. 정상입니다. 무너지는 지점이 곧 ‘시스템을 고칠 포인트’예요. 7일차 점검에서 규칙을 추가하기보다 **규칙을 더 쉽게** 바꾸는 게 핵심입니다.\n`;

  const closer = `---\n\n### 다음 글 추천\n- 비슷한 주제 글을 2~3개 골라 연속으로 적용하면 체감이 더 큽니다.\n`;

  return { examples: examples[theme], faq, closer, title };
}

const files = readdirSync(postsDir).filter((f) => f.endsWith('.md'));
let touched = 0;

for (const file of files) {
  const full = join(postsDir, file);
  const md = readFileSync(full, 'utf8');
  const parts = split(md);
  if (!parts) continue;

  const title = parseTitle(parts.fm) ?? file;
  const tags = parseTags(parts.fm);

  // If already long enough, skip
  if (parts.body.length > 2600) continue;

  const s = section({ title, tags });
  let body = parts.body;
  body = addIfMissing(body, '## 실전 예시(바로 따라하기)', s.examples);
  body = addIfMissing(body, '## 자주 묻는 질문(FAQ)', s.faq);
  body = addIfMissing(body, '### 다음 글 추천', s.closer);

  writeFileSync(full, parts.fm + body.trimStart(), 'utf8');
  touched++;
}

console.log(`Enriched ${touched} posts.`);
