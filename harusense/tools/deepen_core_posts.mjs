import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = new URL('../src/content/posts/', import.meta.url).pathname;

const core = [
  '2026-02-25-morning-routine.md',
  '2026-02-25-saving-checklist.md',
  '2026-03-02-budget-reset.md',
  '2026-03-02-kitchen-mealprep.md',
  '2026-03-03-declutter-entry.md',
  '2026-03-10-cleaning-weekly.md',
  '2026-03-09-subscription-audit.md',
  '2026-03-05-smart-shopping-rules.md',
  '2026-03-14-kitchen-freezer.md',
  '2026-03-21-routine-sunday.md',
];

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

const addendum = {
  '2026-02-25-morning-routine.md': {
    marker: '## 실패 확률을 낮추는 “전날 20초”',
    section: `## 실패 확률을 낮추는 “전날 20초”

아침 루틴은 아침에 이기려 하면 져요. 전날 20초가 승부입니다.

- 물컵/텀블러를 **싱크대 말고 침대 옆**
- 메모지는 “책상 위”가 아니라 **핸드폰 옆**
- 알람 끄고 폰을 잡는 순간을 막기 위해 **홈화면에서 SNS 폴더를 2페이지 뒤로**

### 초보용 2분 버전(진짜 바쁠 때)
- 물 1컵 + 오늘 할 일 1개만 적기

이 2분 버전을 “실패한 날의 백업”으로 두면 루틴이 끊기지 않습니다.
`
  },
  '2026-02-25-saving-checklist.md': {
    marker: '## 월말에 돈이 남는 사람들의 ‘딱 1개 규칙’',
    section: `## 월말에 돈이 남는 사람들의 ‘딱 1개 규칙’

**“결제내역을 보기 전에는 결심하지 않는다.”**

대부분은 “다음 달부터 아껴야지”라고 말하지만, 실제 결제내역을 보면 방향이 바뀝니다.

### 15분 점검 순서(현실)
1) 구독(해지 후보 표시)
2) 배달/카페 횟수(횟수만 세도 충분)
3) 카드 혜택/연회비(손익)

### 오늘의 미션
- 결제내역에서 ‘정기결제’ 3개만 찾아서 메모하기
`
  },
  '2026-03-02-budget-reset.md': {
    marker: '## 예산 리셋이 “먹히는” 최소 공식',
    section: `## 예산 리셋이 “먹히는” 최소 공식

예산은 복잡하면 망합니다. 이 정도만 잡으면 유지됩니다.

- 고정비(잠그기) + 변동비(4바구니) + 목표지출(1개)

### 변동비 4바구니(다시)
1) 식비
2) 생활
3) 이동
4) 즐거움

### 오늘의 미션
- 이번 달 ‘목표지출’ 1개만 정해서 자동이체 걸기(작게)
`
  },
  '2026-03-02-kitchen-mealprep.md': {
    marker: '## 밀프렙이 실패하는 진짜 이유(현실)',
    section: `## 밀프렙이 실패하는 진짜 이유(현실)

밀프렙은 요리 실력 문제가 아니라 “과함” 때문에 망합니다.

- 메뉴를 6개씩 짠다 → 지침
- 용기가 너무 많다 → 설거지 지옥
- 맛이 질린다 → 배달 버튼

### 가장 현실적인 구성
- 단백질 1종 + 야채 1종 + 소스 1종
이 조합만 있어도 3~4일은 커버돼요.

### 오늘의 미션
- 다음 장보기에서 단백질/야채/소스 1개씩만 정해서 사기
`
  },
  '2026-03-03-declutter-entry.md': {
    marker: '## 현관이 정리 시작점으로 좋은 이유',
    section: `## 현관이 정리 시작점으로 좋은 이유

현관은 “매일 반복되는 동선”이라서, 정리 효과가 바로 체감됩니다.

- 신발/택배/우편/가방이 모이면서 집이 흐트러지는 시작점
- 여기를 잡으면 집 전체가 ‘안정된 느낌’이 납니다.

### 오늘의 미션
- 신발 5켤레만 남기고 나머지는 ‘보류 박스’로
`
  },
  '2026-03-10-cleaning-weekly.md': {
    marker: '## 주간 청소를 “30분”으로 끝내는 분할법',
    section: `## 주간 청소를 “30분”으로 끝내는 분할법

청소는 ‘완벽’이 아니라 ‘재발 방지’가 핵심입니다.

- 10분: 눈에 보이는 것 치우기
- 10분: 욕실/싱크대 표면
- 10분: 바닥(먼지/머리카락)

### 오늘의 미션
- 타이머 10분만 켜고 “표면”만 닦기(완벽 금지)
`
  },
  '2026-03-09-subscription-audit.md': {
    marker: '## 해지 못 하는 구독을 끊는 2단계',
    section: `## 해지 못 하는 구독을 끊는 2단계

1) **일단 해지**(언제든 다시 결제 가능)
2) “대체 행동” 하나 만들기
- 예: 음악 앱 해지 → 유튜브 한 시간만

### 오늘의 미션
- 30일 미사용 구독 1개만 해지
`
  },
  '2026-03-05-smart-shopping-rules.md': {
    marker: '## 충동구매를 진짜로 막는 “마찰”',
    section: `## 충동구매를 진짜로 막는 “마찰”

충동구매는 “참기”로 안 막히고, **결제까지 가는 길을 길게** 만들면 막힙니다.

- 쇼핑앱 로그아웃
- 결제 비밀번호 재설정
- 장바구니 24시간 숙성

### 오늘의 미션
- 쇼핑앱 1개 로그아웃만 하기
`
  },
  '2026-03-14-kitchen-freezer.md': {
    marker: '## 냉동실 재고가 집을 살리는 순간',
    section: `## 냉동실 재고가 집을 살리는 순간

퇴근 후 체력이 0%일 때는 “의사결정”이 가장 큰 적입니다.
냉동실에 ‘그냥 먹는 옵션’이 있으면 배달 버튼이 줄어들어요.

### 오늘의 미션
- 냉동실에 비상식 2개만 채우기(냉동밥/만두/냉동야채 중 택2)
`
  },
  '2026-03-21-routine-sunday.md': {
    marker: '## 월요일이 쉬워지는 45분 구성(현실)',
    section: `## 월요일이 쉬워지는 45분 구성(현실)

- 15분: 빨래/설거지 ‘하나만’ 끝내기
- 15분: 다음 주 일정 한 번 보기(큰 것만)
- 15분: 장보기/식사 계획 ‘대충’ 세팅

### 오늘의 미션
- 다음 주 가장 힘든 날 1개만 찾고, 그날 저녁 계획만 미리 정하기
`
  },
};

let changed = 0;
for (const file of core){
  const full = join(dir, file);
  const md = readFileSync(full, 'utf8');
  const p = split(md);
  if (!p) continue;
  const add = addendum[file];
  if (!add) continue;
  const newBody = addIfMissing(p.body, add.marker, add.section);
  if (newBody !== p.body){
    writeFileSync(full, p.fm + newBody.trimStart(), 'utf8');
    changed++;
  }
}

console.log(`Deepened ${changed} core posts.`);
