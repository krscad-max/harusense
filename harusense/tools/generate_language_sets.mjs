import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const outDir = new URL('../src/content/posts/', import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });

const coverPool = [
  { img: '/images/unsplash2/b1.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b2.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b3.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b4.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b5.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b6.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b7.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b8.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b9.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
  { img: '/images/unsplash2/b10.jpg', credit: 'Unsplash', url: 'https://unsplash.com' },
];

const englishThemes = [
  { topic: 'phone', label: '전화', scenarios: ['예약 전화', '반품 문의', '고객센터 통화', '전화 연결 요청', '통화 마무리'] },
  { topic: 'work', label: '직장', scenarios: ['업무 요청', '마감 조정', '회의', '상태 공유', '감사/팔로업'] },
  { topic: 'rent', label: '렌트', scenarios: ['집주인 문의', '수리 요청', '입주/퇴거', '계약', '소음/이웃'] },
  { topic: 'bank', label: '은행', scenarios: ['계좌/카드', '수수료', '한도/결제', '대출/이자', '방문 예약'] },
  { topic: 'hospital', label: '병원', scenarios: ['예약', '증상 설명', '보험', '약국', '응급'] },
  { topic: 'airport', label: '공항', scenarios: ['체크인', '수하물', '탑승', '지연', '환승'] },
];

const japaneseThemes = [
  { topic: 'travel', label: '여행', scenarios: ['길 묻기', '사진 부탁', '표 사기', '시간 확인', '감사/사과'] },
  { topic: 'restaurant', label: '식당', scenarios: ['주문', '추천', '알레르기', '계산', '포장'] },
  { topic: 'convenience', label: '편의점', scenarios: ['봉투/젓가락', '전자레인지', '결제', '영수증', '충전'] },
  { topic: 'station', label: '역', scenarios: ['노선', '승강장', '환승', '막차', 'IC카드'] },
  { topic: 'hotel', label: '숙소', scenarios: ['체크인', '체크아웃', '어메니티', '짐 보관', '불편/요청'] },
];

function pad2(n){ return String(n).padStart(2,'0'); }

function pickCover(i){
  const c = coverPool[i % coverPool.length];
  return c;
}

function ensureUnique(path){
  if (!existsSync(path)) return path;
  const ext = path.endsWith('.md') ? '.md' : '';
  const base = path.replace(/\.md$/, '');
  let i=2;
  while (existsSync(base + '-' + i + ext)) i++;
  return base + '-' + i + ext;
}

function englishPost({ idx, theme, scenario }){
  const phraseOptions = [
    { phrase: 'Could you please...', meaning: '정중하게 부탁할 때', tip: '부탁은 please로 부드럽게.' },
    { phrase: 'Just to confirm, ...', meaning: '확인할 때(재확인)', tip: '실수 줄이는 만능 문장.' },
    { phrase: 'Would it be possible to...?', meaning: '가능 여부 물을 때', tip: '거절 가능성 있을 때 특히 좋음.' },
    { phrase: 'I’m calling about...', meaning: '전화로 용건 시작', tip: '전화 첫 문장으로 안정감.' },
    { phrase: 'I’d like to...', meaning: '의사 표현/요청', tip: '직설적이지만 공손.' },
    { phrase: 'Thanks for your help.', meaning: '마무리 감사', tip: '마지막 5초가 인상을 만듦.' },
    { phrase: 'I’m not sure, but...', meaning: '확실하지 않을 때', tip: '모르면 이렇게 안전하게 시작.' },
    { phrase: 'Could you repeat that?', meaning: '다시 말해달라', tip: '못 알아들었을 때 가장 자연스러움.' },
  ];
  const p = phraseOptions[idx % phraseOptions.length];

  const title = `오늘의 영어(${theme.label}): “${p.phrase}” — ${scenario}`;
  const desc = `${theme.label} 상황에서 바로 쓸 수 있는 문장. 짧은 예문 + 대체 표현 + 실전 미션.`;
  const cover = pickCover(idx);

  return {
    filename: `2026-03-02-english-${theme.topic}-${pad2(idx+1)}.md`,
    md: `---\n`+
      `title: "${title}"\n`+
      `date: 2026-03-02\n`+
      `tags: [english, ${theme.topic}, routine]\n`+
      `description: "${desc}"\n`+
      `coverImage: "${cover.img}"\n`+
      `coverCredit: "${cover.credit}"\n`+
      `coverCreditUrl: "${cover.url}"\n`+
      `---\n\n`+
      `영어는 단어를 많이 아는 것보다 **자주 쓰는 문장 뼈대**를 익히는 게 훨씬 빨라요. 오늘은 ${theme.label} 상황에서 특히 유용한 표현 하나를 잡습니다.\n\n`+
      `![](${cover.img})\n\n`+
      `## 오늘의 문장\n`+
      `**${p.phrase}**\n\n`+
      `- 의미: ${p.meaning}\n`+
      `- 팁: ${p.tip}\n\n`+
      `## ${theme.label} 실전 예문\n`+
      `1) **${scenario}**\n`+
      `   - ${p.phrase} check the status?\n`+
      `   - ${p.phrase} send it by email?\n\n`+
      `2) 짧게 마무리\n`+
      `   - Thanks for your help.\n\n`+
      `## 대체 표현(느낌만 바꾸기)\n`+
      `- Could you…? (조금 더 직설)\n`+
      `- Would you mind…? (더 부드럽게)\n`+
      `- Is it okay if I…? (내가 해도 되는지)\n\n`+
      `![](${pickCover(idx+3).img})\n\n`+
      `## 오늘의 미션(30초)\n`+
      `오늘 한 번만 소리 내서 말해보자:\n`+
      `- ${p.phrase} send me the details?\n\n`+
      `---\n\n`+
      `### 다음 글 추천\n`+
      `- 오늘의 일본어(여행/식당/편의점)\n`+
      `- 알림 다이어트(집중력 회복)\n`
  };
}

function japanesePost({ idx, theme, scenario }){
  const phraseOptions = [
    { jp: 'すみません', kana: '스미마센', meaning: '실례합니다/죄송합니다(호출)', usage: '먼저 말을 걸 때 거의 만능' },
    { jp: 'お願いします', kana: '오네가이시마스', meaning: '부탁합니다', usage: '요청/주문/계산 전부 커버' },
    { jp: '大丈夫です', kana: '다이죠부 데스', meaning: '괜찮아요', usage: '사양/상태확인/거절에 사용' },
    { jp: 'これは何ですか', kana: '코레와 난데스카', meaning: '이건 뭐예요?', usage: '메뉴/물건 질문에 최고' },
    { jp: 'どこですか', kana: '도코데스카', meaning: '어디예요?', usage: '길/장소 질문' },
    { jp: 'ありがとうございます', kana: '아리가토 고자이마스', meaning: '감사합니다', usage: '마무리 예의' },
  ];
  const p = phraseOptions[idx % phraseOptions.length];
  const title = `오늘의 일본어(${theme.label}): “${p.jp}” — ${scenario}`;
  const desc = `${theme.label}에서 자주 쓰는 표현 1개. 뜻/상황별 활용/예문/단어까지.`;
  const cover = pickCover(idx + 10);

  return {
    filename: `2026-03-02-japanese-${theme.topic}-${pad2(idx+1)}.md`,
    md: `---\n`+
      `title: "${title}"\n`+
      `date: 2026-03-02\n`+
      `tags: [japanese, ${theme.topic}, routine]\n`+
      `description: "${desc}"\n`+
      `coverImage: "${cover.img}"\n`+
      `coverCredit: "${cover.credit}"\n`+
      `coverCreditUrl: "${cover.url}"\n`+
      `---\n\n`+
      `일본어는 짧은 표현을 몇 개만 제대로 익혀도 여행이 훨씬 편해져요. 오늘은 ${theme.label}에서 제일 자주 듣고 쓰는 표현 하나로 갑니다.\n\n`+
      `![](${cover.img})\n\n`+
      `## 오늘의 표현\n`+
      `**${p.jp}** (${p.kana})\n\n`+
      `- 뜻: ${p.meaning}\n`+
      `- 언제 쓰나: ${p.usage}\n\n`+
      `## ${theme.label} 실전 예문\n`+
      `- ${scenario} 상황에서:\n`+
      `  - ${p.jp}。\n`+
      `  - ${p.jp}、お願いします。\n\n`+
      `## 같이 외우면 좋은 단어 2개\n`+
      `- これ (코레): 이것\n`+
      `- ちょっと (쵸또): 잠깐/조금 (거절/완충에 자주)\n\n`+
      `![](${pickCover(idx + 13).img})\n\n`+
      `## 오늘의 미션(20초)\n`+
      `소리 내서 3번:\n`+
      `- ${p.jp}、ありがとうございます。\n\n`+
      `---\n\n`+
      `### 다음 글 추천\n`+
      `- 오늘의 영어(전화/직장/렌트)\n`+
      `- 여행 소비 실수 줄이는 구매 규칙\n`
  };
}

// Build 30 English + 30 Japanese
const englishPosts = [];
const japanesePosts = [];

let eIdx = 0;
for (const theme of englishThemes){
  for (const scenario of theme.scenarios){
    englishPosts.push(englishPost({ idx: eIdx, theme, scenario }));
    eIdx++;
  }
}
// if less than 30, pad by repeating scenarios
while (englishPosts.length < 30){
  const theme = englishThemes[englishPosts.length % englishThemes.length];
  englishPosts.push(englishPost({ idx: englishPosts.length, theme, scenario: '기본 상황' }));
}
englishPosts.length = 30;

let jIdx = 0;
for (const theme of japaneseThemes){
  for (const scenario of theme.scenarios){
    japanesePosts.push(japanesePost({ idx: jIdx, theme, scenario }));
    jIdx++;
  }
}
while (japanesePosts.length < 30){
  const theme = japaneseThemes[japanesePosts.length % japaneseThemes.length];
  japanesePosts.push(japanesePost({ idx: japanesePosts.length, theme, scenario: '기본 상황' }));
}
japanesePosts.length = 30;

let written = 0;
for (const p of [...englishPosts, ...japanesePosts]){
  const target = ensureUnique(join(outDir, p.filename));
  writeFileSync(target, p.md);
  written++;
}

console.log(`Generated ${written} language posts.`);
