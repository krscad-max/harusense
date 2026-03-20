from pathlib import Path
from datetime import datetime, timezone
import re

ROOT = Path(__file__).resolve().parents[1]
POSTS = ROOT / 'src' / 'content' / 'posts'

# Run in UTC; compare against post frontmatter date.
today = datetime.now(timezone.utc).date().isoformat()
changed = []

for path in POSTS.glob('*.md'):
    text = path.read_text()
    if 'draft: true' not in text:
        continue
    m = re.search(r'^date:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})\s*$', text, flags=re.M)
    if not m:
        continue
    post_date = m.group(1)
    if post_date <= today:
        text = re.sub(r'\ndraft:\s*true\s*\n', '\n', text, count=1)
        path.write_text(text)
        changed.append(path.name)

if changed:
    print('Published:')
    for name in changed:
        print(name)
else:
    print('No posts to publish today.')
