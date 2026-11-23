// Submission storage.
// On Vercel this uses a private Blob store. Without a token (local development)
// it falls back to JSON files in .data so the app can be tested offline.

import { promises as fs } from 'fs';
import path from 'path';

const PREFIX = 'submissions/';
const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const localDir = path.join(process.cwd(), '.data');
const validId = (id) => /^[0-9a-f-]{36}$/.test(id);

export async function saveSubmission(record) {
  const body = JSON.stringify(record);
  if (useBlob()) {
    const { put } = await import('@vercel/blob');
    await put(`${PREFIX}${record.id}.json`, body, {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
    });
    return;
  }
  await fs.mkdir(localDir, { recursive: true });
  await fs.writeFile(path.join(localDir, `${record.id}.json`), body);
}

export async function getSubmission(id) {
  if (!validId(id)) return null;
  try {
    if (useBlob()) {
      const { get } = await import('@vercel/blob');
      const res = await get(`${PREFIX}${id}.json`, { access: 'private', useCache: false });
      if (!res || res.statusCode !== 200) return null;
      return JSON.parse(await new Response(res.stream).text());
    }
    return JSON.parse(await fs.readFile(path.join(localDir, `${id}.json`), 'utf8'));
  } catch {
    return null;
  }
}

export async function listSubmissions() {
  let ids = [];
  if (useBlob()) {
    const { list } = await import('@vercel/blob');
    let cursor;
    do {
      const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
      ids.push(...page.blobs.map((b) => b.pathname.slice(PREFIX.length).replace(/\.json$/, '')));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
  } else {
    try {
      ids = (await fs.readdir(localDir)).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));
    } catch {
      ids = [];
    }
  }
  const records = (await Promise.all(ids.map((id) => getSubmission(id)))).filter(Boolean);
  return records.sort((x, y) => (x.createdAt < y.createdAt ? 1 : -1));
}
