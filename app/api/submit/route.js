import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { ALL_QUESTIONS, SECTIONS, visibleQuestions, isAnswered } from '../../../lib/questions';
import { saveSubmission } from '../../../lib/store';

export const runtime = 'nodejs';

const clip = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(request) {
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 100000) return NextResponse.json({ error: 'Too large' }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Honeypot: real people never fill this field.
  if (body.website) return NextResponse.json({ ok: true });

  const contact = {
    name: clip(body.contact?.name, 120),
    company: clip(body.contact?.company, 160),
    email: clip(body.contact?.email, 200),
    role: clip(body.contact?.role, 120),
  };
  if (!contact.name || !contact.company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    return NextResponse.json({ error: 'Please add your name, company and a valid email.' }, { status: 400 });
  }

  // Keep only known questions and valid option values.
  const answers = {};
  const notes = {};
  for (const q of ALL_QUESTIONS) {
    const v = body.answers?.[q.id];
    if (q.type === 'single') {
      if (q.options.some((o) => o.value === v)) answers[q.id] = v;
    } else if (q.type === 'multi') {
      if (Array.isArray(v)) {
        const ok = v.filter((x) => q.options.some((o) => o.value === x));
        if (ok.length) answers[q.id] = ok;
      }
    } else {
      const t = clip(v, 4000);
      if (t) answers[q.id] = t;
    }
    const n = clip(body.notes?.[q.id], 2000);
    if (n) notes[q.id] = n;
  }

  const missing = SECTIONS.flatMap((s) => visibleQuestions(s, answers)).filter(
    (q) => q.required && !isAnswered(q, answers[q.id])
  );
  if (missing.length) {
    return NextResponse.json({ error: 'Some required questions are not answered.' }, { status: 400 });
  }

  const record = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    contact,
    answers,
    notes,
    closingNote: clip(body.closingNote, 4000),
  };

  try {
    await saveSubmission(record);
  } catch (e) {
    console.error('Save failed', e);
    return NextResponse.json({ error: 'We could not save your answers. Please try again.' }, { status: 500 });
  }

  // The summary link is not returned to the client. The team opens it from the team page.
  return NextResponse.json({ ok: true });
}
