import http from 'node:http';
import { google } from 'googleapis';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

function readEnv() {
  const envPath = join(new URL('.', import.meta.url).pathname, '.env');
  if (!existsSync(envPath)) {
    throw new Error(`.env not found at ${envPath}. Create it (see README.md).`);
  }
  const txt = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
    if (!m) continue;
    env[m[1]] = m[2];
  }
  return env;
}

const { YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET } = readEnv();
if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET) {
  throw new Error('Missing YOUTUBE_CLIENT_ID or YOUTUBE_CLIENT_SECRET in .env');
}

const redirectUri = 'http://127.0.0.1:42813/oauth2callback';
const oauth2Client = new google.auth.OAuth2(
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  redirectUri,
);

const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent',
});

console.log('\n1) 브라우저에서 아래 URL을 열어 승인하세요:');
console.log(authUrl);

// Try to open browser on macOS
try {
  execSync(`open "${authUrl}"`);
} catch {}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url?.startsWith('/oauth2callback')) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const u = new URL(req.url, 'http://127.0.0.1:42813');
    const code = u.searchParams.get('code');
    if (!code) {
      res.writeHead(400);
      res.end('Missing code');
      return;
    }

    const { tokens } = await oauth2Client.getToken(code);
    const refresh = tokens.refresh_token;

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('OK. You can close this tab and return to the terminal.');

    console.log('\n2) 아래 refresh token을 .env의 YOUTUBE_REFRESH_TOKEN에 저장하세요:\n');
    console.log(refresh || '(no refresh_token returned — try again; ensure prompt=consent and new grant)');

    server.close();
  } catch (e) {
    res.writeHead(500);
    res.end('Error');
    console.error(e);
    server.close();
  }
});

server.listen(42813, '127.0.0.1', () => {
  console.log('\n(로컬 콜백 서버 시작: http://127.0.0.1:42813)');
});
