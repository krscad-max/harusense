import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = new URL('../src/content/posts/', import.meta.url).pathname;

function splitFrontmatter(md) {
  if (!md.startsWith('---')) return { fm: '', body: md };
  const idx = md.indexOf('\n---', 3);
  if (idx === -1) return { fm: '', body: md };
  const end = md.indexOf('\n', idx + 4);
  const fm = md.slice(0, end + 1);
  const body = md.slice(end + 1);
  return { fm, body };
}

function parseSimpleField(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!m) return null;
  return m[1].trim().replace(/^"|"$/g, '');
}

function parseTags(fm) {
  const m = fm.match(/^tags:\s*\[(.*)\]\s*$/m);
  if (!m) return [];
  return m[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function longArticle({ title, tags }) {
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
            : has('morning')
              ? 'morning'
              : has('productivity')
                ? 'productivity'
                : 'routine';

  const blocks = {
    kitchen: {
      why: '주방 문제는 “요리 실력”이 아니라 **동선/재고/결정 피로**에서 터집니다. 그래서 이 글은 레시피보다 ‘시스템’을 먼저 잡습니다.',
      mistakes: ['수납을 먼저 사는 것(비우기 전 구매)', '재료를 다양하게 사서 결국 버리는 것', '도구를 늘리지만 루틴이 없는 것'],
      tools: ['자석 타이머(냉장고)', '규격 통일 밀폐용기', '냉동야채/냉동밥 같은 “시간 절약 재고”'],
    },
    organization: {
      why: '정리는 의지 게임이 아니라 **마찰(귀찮음)을 낮추는 설계**입니다. 한 번에 완벽히 하려는 마음이 실패 원인 1위예요.',
      mistakes: ['한 구역을 “끝까지” 하려고 시작', '보관함부터 구매', '가족/룸메이트 규칙 없이 혼자만 규칙을 지키려 함'],
      tools: ['라벨지/테이프', '임시 바구니 2개(보관/보류)', '타이머 15분'],
    },
    budgeting: {
      why: '가계부가 안 되는 이유는 기록이 귀찮아서가 아니라, **결제/출금 흐름이 복잡해서**입니다. 흐름을 단순화하면 관리가 됩니다.',
      mistakes: ['카드를 너무 많이 쓰기', '결제일이 제각각', '변동비를 세분화해 오히려 포기'],
      tools: ['자동이체 계좌 1개', '카드 2장 원칙', '월 1회 예산 리셋(30분)'],
    },
    saving: {
      why: '절약은 “참기”가 아니라 **새는 구멍을 막는 작업**입니다. 특히 구독/고정비/배달이 큰 구멍입니다.',
      mistakes: ['큰 절약만 찾다가 포기', '할인/쿠폰 때문에 불필요한 구매', '절약 목표를 ‘의지’로만 세팅'],
      tools: ['구독 점검일 캘린더', '장바구니 24시간 룰', '지출 알림(카드 앱)'],
    },
    consumption: {
      why: '소비 습관은 도덕 문제가 아니라 **트리거(피곤/스트레스/심심함)** 반응입니다. 그래서 트리거를 바꾸면 결제가 줄어듭니다.',
      mistakes: ['“안 사야지”만 반복', '쇼핑앱을 홈화면에 둠', '결제수단이 너무 편함(원클릭)'],
      tools: ['장바구니 숙성 24시간', '결제 비밀번호 재설정(마찰 올리기)', '위시리스트(대체 행동)'],
    },
    morning: {
      why: '아침 루틴의 핵심은 “대단한 루틴”이 아니라 **첫 5분의 흐름**입니다. 시작이 쉬우면 지속됩니다.',
      mistakes: ['아침에 폰부터 보기', '루틴을 과하게 설계', '전날 준비(20초)를 무시'],
      tools: ['침대 옆 물', '메모지/펜', '방해 금지 모드'],
    },
    productivity: {
      why: '생산성은 시간 관리가 아니라 **집중력 누수**를 줄이는 게임입니다. 누수를 막으면 같은 시간에 더 합니다.',
      mistakes: ['알림/배지 그대로', '할 일을 너무 세분화', '쉬는 시간을 죄책감으로 채움'],
      tools: ['25분 타이머', '알림 최소화', '하루 3우선순위'],
    },
    routine: {
      why: '루틴은 “해야 할 일”이 아니라 **반복되는 문제를 자동으로 처리하는 장치**입니다. 작게 만들어 오래 가게 하세요.',
      mistakes: ['처음부터 100%로 시작', '체크리스트가 너무 김', '보상/피드백이 없음'],
      tools: ['주간 반복 캘린더', '체크박스 3개', '타이머'],
    },
  };

  const b = blocks[theme];

  return `
${b.why}

## 이 글의 목표(오늘 바로 체감)
- **15~30분 안에 끝나는 버전**으로 시작
- 내일부터 유지되는 **규칙 1~2개**만 남기기
- “완벽한 결과”가 아니라 **재발 방지 장치** 만들기

## 시작하기 전에(3분 점검)
아래 질문에 ‘예’가 많으면, 오늘 이 글이 특히 도움돼.
- 요즘 집/돈/시간이 “흐트러졌다”는 느낌이 있다
- 해야 할 건 많은데, 시작이 어렵다
- 한 번 정리/절약/루틴을 해도 금방 무너진다

## 실행 루틴(단계별)

### 1) 범위를 한 줄로 제한하기
범위를 줄이는 게 실력이다.
- 오늘 범위: **한 구역/한 항목/한 행동**만
- 예: “현관 바닥만”, “구독 결제만”, “냉장고 문칸만”

### 2) ‘버리기’보다 ‘이동’부터
초반엔 판단이 피곤해서 망한다. 그래서 이렇게 해.
- 임시 바구니 2개
  - **보관(확실히 쓰는 것)**
  - **보류(지금 판단 어려운 것)**

> 판단을 뒤로 미루면 속도가 나온다.

### 3) 체크리스트(현실적으로 끝내기)
- [ ] 눈에 보이는 장애물 10개 제거(쓰레기/포장지/빈병)
- [ ] 자주 쓰는 것 5개를 손 닿는 곳으로
- [ ] ‘다음 행동’을 쉽게 만드는 1개만 설치

### 4) 유지 장치 1개만 남기기
유지는 규칙이 아니라 **동선**이다.
- 예: “여기엔 이것만”, “이 바구니 넘치면 구매 금지”, “일요일 15분 점검”

## 자주 실패하는 이유 3가지(그리고 해결)
${b.mistakes.map((m, i) => `${i + 1}) ${m}`).join('\n')}

해결 원칙:
- “더 열심히”가 아니라 **더 쉽게**
- “더 많이”가 아니라 **더 자주(짧게)**

## 추천 도구/재고(돈보다 시간 아끼는 것)
${b.tools.map((t) => `- ${t}`).join('\n')}

## 7일 유지 플랜(현실 버전)
- **1일차:** 오늘 글의 체크리스트 그대로
- **3일차:** 무너진 지점 1개만 수정(규칙 추가 금지)
- **7일차:** 15분 점검 + “없애도 되는 규칙” 하나 제거

## 한 줄 결론
완벽하게 하려는 순간, 유지가 깨진다.
**작게 만들고, 계속 돌아가게 만들면** 삶이 바뀐다.
`;
}

const files = readdirSync(postsDir).filter((f) => f.endsWith('.md'));
let changed = 0;
let expanded = 0;

for (const file of files) {
  const full = join(postsDir, file);
  const md = readFileSync(full, 'utf8');
  const { fm, body } = splitFrontmatter(md);
  const title = parseSimpleField(fm, 'title') ?? file;
  const tags = parseTags(fm);

  // Expand only generated short templates
  if (!body.includes('이 글은 HaruSense의 생활 실험 기록입니다.')) continue;

  const newBody = `\n${longArticle({ title, tags })}`
    .replace(/\n{3,}/g, '\n\n');

  // Replace entire body with long article that is tied to the title/tags
  const out = fm + newBody.trimStart();
  writeFileSync(full, out, 'utf8');
  changed++;
  expanded++;
}

console.log(`Expanded ${expanded} posts.`);
