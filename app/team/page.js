import { cookies } from 'next/headers';
import Link from 'next/link';
import { TEAM_COOKIE, teamToken } from '../../lib/auth';
import { listSubmissions } from '../../lib/store';
import { recommend } from '../../lib/tier';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Questionnaire responses | Black Team' };

export default async function Team({ searchParams }) {
  const sp = await searchParams;
  const token = teamToken();
  const jar = await cookies();
  const authed = token && jar.get(TEAM_COOKIE)?.value === token;

  if (!authed) {
    return (
      <main className="summary">
        <div className="wrap">
          <header>
            <p className="eyebrow">Black Team</p>
            <h1>Questionnaire responses</h1>
          </header>
          {!token ? (
            <div className="alert">The team password has not been set up yet.</div>
          ) : (
            <form className="card" method="post" action="/api/team-login">
              {sp?.error && (
                <div className="alert" role="alert">
                  That password is not right.
                </div>
              )}
              <div className="field">
                <label htmlFor="password">Team password</label>
                <input id="password" name="password" type="password" required autoComplete="current-password" style={{ width: '100%', font: 'inherit', padding: '14px 16px', minHeight: 52, borderRadius: 12, border: '1.5px solid var(--line)' }} />
              </div>
              <div className="actions" style={{ marginTop: 16 }}>
                <button className="btn inline" type="submit">
                  View responses
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    );
  }

  const records = await listSubmissions();

  return (
    <main className="summary">
      <div className="wrap">
        <header>
          <p className="eyebrow">Black Team</p>
          <h1>Questionnaire responses</h1>
          <p className="meta">
            {records.length === 0 ? 'No responses yet.' : records.length === 1 ? '1 response' : `${records.length} responses`}. Each summary has its own link
            that you can share with anyone.
          </p>
        </header>
        {records.length > 0 && (
          <div className="card">
            <ul className="table-list">
              {records.map((r) => {
                const rec = recommend(r.answers);
                const date = new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'America/Chicago' });
                return (
                  <li key={r.id}>
                    <Link href={`/summary/${r.id}`}>
                      <span className="who">{r.contact.company}</span>
                      <span className="meta">
                        {r.contact.name} | {date}
                      </span>
                      <span className="tag">
                        {rec.tierInfo.name}
                        {rec.addOns.length > 0 ? ` + ${rec.addOns.length} add-on${rec.addOns.length === 1 ? '' : 's'}` : ''}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
