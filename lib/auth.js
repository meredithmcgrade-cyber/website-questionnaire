import { createHash } from 'crypto';

export const TEAM_COOKIE = 'st_team';

export function teamToken() {
  const pw = process.env.TEAM_PASSWORD;
  if (!pw) return null;
  return createHash('sha256').update(`st-team:${pw}`).digest('hex');
}
