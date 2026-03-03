import { google } from 'googleapis';
import fs from 'node:fs';
import { join } from 'node:path';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--file') out.file = args[++i];
    else if (a === '--title') out.title = args[++i];
    else if (a === '--description') out.description = args[++i];
    else if (a === '--tags') out.tags = args[++i];
    else if (a === '--privacy') out.privacy = args[++i];
  }
  return out;
}

function readEnv() {
  const envPath = join(new URL('.', import.meta.url).pathname, '.env');
  const txt = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
    if (!m) continue;
    env[m[1]] = m[2];
  }
  return env;
}

const { file, title, description, tags, privacy } = parseArgs();
if (!file || !title) {
  console.error('Usage: node upload.mjs --file <mp4> --title <title> [--description ...] [--tags a,b,c] [--privacy public|unlisted|private]');
  process.exit(1);
}

const env = readEnv();
const { YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN } = env;
if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET || !YOUTUBE_REFRESH_TOKEN) {
  throw new Error('Missing YOUTUBE_CLIENT_ID/YOUTUBE_CLIENT_SECRET/YOUTUBE_REFRESH_TOKEN in .env');
}

const oauth2Client = new google.auth.OAuth2(
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
);

oauth2Client.setCredentials({ refresh_token: YOUTUBE_REFRESH_TOKEN });

const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

const stat = fs.statSync(file);
console.log(`Uploading ${file} (${Math.round(stat.size / 1024 / 1024)}MB)...`);

const res = await youtube.videos.insert({
  part: ['snippet', 'status'],
  requestBody: {
    snippet: {
      title,
      description: description ?? '',
      tags: tags ? tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
      categoryId: '27', // Education
    },
    status: {
      privacyStatus: privacy || 'unlisted',
      selfDeclaredMadeForKids: false,
    },
  },
  media: {
    body: fs.createReadStream(file),
  },
});

const id = res?.data?.id;
console.log('Upload complete:', id);
console.log('URL:', `https://www.youtube.com/watch?v=${id}`);
