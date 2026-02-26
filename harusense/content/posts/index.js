import morning from './2026-02-25-morning-routine.md'
import saving from './2026-02-25-saving-checklist.md'
import gadgets from './2026-02-25-kitchen-gadgets.md'

export default [
  { slug: '5min-morning-routine', title: morning.title || '5분 아침 루틴', excerpt: morning.excerpt || '', image: '/images/post1.jpg' },
  { slug: 'monthly-saving-checklist', title: saving.title || '월별 지출 절약 체크리스트', excerpt: saving.excerpt || '', image: '/images/post2.jpg' },
  { slug: 'kitchen-gadgets-2026', title: gadgets.title || '가성비 주방 가젯 7선', excerpt: gadgets.excerpt || '', image: '/images/post3.jpg' }
]
