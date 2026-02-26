async function loadJSON(url){ try{ const r = await fetch(url); if(!r.ok) throw new Error('fetch failed'); return await r.json(); }catch(e){ console.error(e); return null }}
function renderPosts(posts){ const container = document.getElementById('posts'); if(!container) return; container.innerHTML = posts.map(p=>`<div class="post-card"><h2><a href="/post.html?id=${encodeURIComponent(p.id)}">${p.title}</a></h2><p>${p.date} • ${p.tag}</p><p>${p.desc||''}</p></div>`).join('\n'); }
async function showIndex(){ const posts = await loadJSON('/posts.json'); if(posts) renderPosts(posts); }
function getQuery(){ return Object.fromEntries(new URLSearchParams(location.search)); }
async function showPost(){ const q = getQuery(); const id = q.id; if(!id) return; const posts = await loadJSON('/posts.json'); const postMeta = posts && posts.find(p=>p.id===id); const article = document.getElementById('post'); if(!article) return; if(!postMeta){ article.innerHTML = '<p>포스트를 찾을 수 없습니다.</p>'; return; }
 const md = await fetch('/posts/'+postMeta.file).then(r=>r.text()); article.innerHTML = `<h1>${postMeta.title}</h1><p>${postMeta.date}</p><div>${marked.parse(md)}</div>`; }
// entry
if(location.pathname.endsWith('/index.html') || location.pathname === '/' ) showIndex();
if(location.pathname.endsWith('/post.html')) showPost();
