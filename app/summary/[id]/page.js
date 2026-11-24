import { notFound } from 'next/navigation';
import { SECTIONS, visibleQuestions, numberMap, formatAnswer } from '../../../lib/questions';
import { recommend, TIERS } from '../../../lib/tier';
import { getSubmission } from '../../../lib/store';
import PrintButton from './print-button';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const record = await getSubmission(id);
  return { title: record ? `${record.contact.company} | Website questionnaire summary` : 'Summary not found' };
}

export default async function Summary({ params }) {
  const { id } = await params;
  const record = await getSubmission(id);
  if (!record) notFound();

  const { contact, answers, notes } = record;
  const rec = recommend(answers);
  const numbers = numberMap(answers);
  const date = new Date(record.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Chicago' });
  const noteCount = Object.keys(notes).length + (record.closingNote ? 1 : 0);

  return (
    <main className="summary">
      <div className="wrap wide">
        <header>
          <p className="eyebrow">Website questionnaire summary</p>
          <h1>{contact.company}</h1>
          <p className="meta">
            {contact.name}
            {contact.role ? `, ${contact.role}` : ''} | <a href={`mailto:${contact.email}`}>{contact.email}</a> | Submitted {date}
          </p>
          <div className="actions no-print">
            <PrintButton />
          </div>
        </header>

        <section className="card dark" aria-labelledby="rec">
          <p className="eyebrow" id="rec">
            Recommended tier
          </p>
          <p className="tier-name">{rec.tierInfo.name}</p>
          <p>{rec.tierInfo.summary}</p>
          <ul className="list">
            {rec.tierInfo.includes.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          {rec.tier === 4 && (
            <div className="sub">
              <p className="eyebrow">Creative level within the platform</p>
              <p style={{ marginTop: 6 }}>
                Their design answers match {TIERS[rec.creative].name}. {TIERS[rec.creative].summary}
              </p>
            </div>
          )}
        </section>

        <section className="card" aria-labelledby="addons">
          <div className="card-head">
            <h3 id="addons">Add-ons</h3>
            {rec.addOns.length > 0 && <span className="tag">{rec.addOns.length} outside this tier</span>}
          </div>
          {rec.tier === 4 ? (
            <p>Tier 4 is a custom proposal, so everything they asked for is scoped in its own discovery phase.</p>
          ) : rec.addOns.length === 0 ? (
            <p>Everything they asked for fits within this tier.</p>
          ) : (
            <>
              <p className="meta">These asks go beyond what {rec.tierInfo.name} includes. Scope and price each one separately.</p>
              <ul className="addons">
                {rec.addOns.map((x) => (
                  <li key={x.key}>
                    <div className="addon-head">
                      <strong>{x.title}</strong>
                      <span className={`level level-${x.level.toLowerCase()}`}>{x.level} effort</span>
                    </div>
                    <dl>
                      <div>
                        <dt>The ask</dt>
                        <dd>{x.asked}</dd>
                      </div>
                      <div>
                        <dt>In the tier</dt>
                        <dd>{x.included}</dd>
                      </div>
                      <div>
                        <dt>Extra effort</dt>
                        <dd>{x.effort}</dd>
                      </div>
                      <div>
                        <dt>Stage</dt>
                        <dd>{x.stage}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
              <p className="meta" style={{ marginTop: 14, fontSize: '0.92rem' }}>
                Effort levels are rough guides, not estimates. Confirm each one when scoping.
              </p>
            </>
          )}
        </section>

        <div className="cols">
          <section className="card" aria-labelledby="why">
            <h3 id="why">Why this tier</h3>
            {rec.reasons.length ? (
              <ul className="list">
                {rec.reasons.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            ) : (
              <p style={{ marginTop: 12 }}>Their answers point to a simple, proven approach.</p>
            )}
            <p className="meta" style={{ marginTop: 14, fontSize: '0.92rem' }}>
              The tier is based on creative output and on whether the site works like software. Site size does not change it. This is a starting point for the
              team to confirm.
            </p>
          </section>
          <section className="card" aria-labelledby="scope">
            <h3 id="scope">Things to scope</h3>
            {rec.flags.length ? (
              <ul className="list">
                {rec.flags.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            ) : (
              <p style={{ marginTop: 12 }}>Nothing unusual came up.</p>
            )}
          </section>
        </div>

        <h2 style={{ margin: '20px 0 8px' }}>What they told us</h2>
        <p className="meta" style={{ marginBottom: 20 }}>
          {noteCount === 0 ? 'The client did not add notes.' : noteCount === 1 ? 'The client added 1 note. It is highlighted below.' : `The client added ${noteCount} notes. They are highlighted below.`}
        </p>

        {SECTIONS.map((s) => (
          <section className="card" key={s.id}>
            <div className="card-head">
              <h3>{s.title}</h3>
            </div>
            {visibleQuestions(s, answers).map((q) => {
              const text = formatAnswer(q, answers[q.id]);
              return (
                <div className="qa" key={q.id}>
                  <span className="q">
                    {String(numbers[q.id]).padStart(2, '0')} {q.text}
                  </span>
                  <span className={`a${text ? '' : ' empty'}`}>{text || 'No answer'}</span>
                  {notes[q.id] && (
                    <div className="client-note">
                      <b>Client note</b>
                      {notes[q.id]}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}

        {record.closingNote && (
          <section className="card">
            <h3 style={{ marginBottom: 10 }}>Anything else</h3>
            <div className="client-note" style={{ marginTop: 0 }}>
              <b>Client note</b>
              {record.closingNote}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
