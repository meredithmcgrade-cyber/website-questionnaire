'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { SECTIONS, visibleQuestions, numberMap, isAnswered, formatAnswer } from '../lib/questions';

const STORAGE_KEY = 'st-website-questionnaire-v1';
const REVIEW = SECTIONS.length + 1;
const emptyState = {
  step: 0,
  contact: { name: '', role: '', company: '', email: '' },
  answers: {},
  notes: {},
  closingNote: '',
};

export default function Questionnaire() {
  const [state, setState] = useState(emptyState);
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [done, setDone] = useState(false);
  const [hp, setHp] = useState('');
  const headingRef = useRef(null);

  // Restore saved progress so a client can stop and come back.
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && typeof saved === 'object') setState({ ...emptyState, ...saved });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || done) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, loaded, done]);

  const { step, contact, answers, notes } = state;
  const numbers = useMemo(() => numberMap(answers), [answers]);
  const section = step >= 1 && step <= SECTIONS.length ? SECTIONS[step - 1] : null;

  const goTo = (next) => {
    setErrors({});
    setSendError('');
    setState((s) => ({ ...s, step: next }));
    window.scrollTo(0, 0);
    setTimeout(() => headingRef.current?.focus(), 50);
  };

  const setAnswer = (id, value) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [id]: value } }));
    setErrors((e) => (e[id] ? { ...e, [id]: undefined } : e));
  };
  const setNote = (id, value) => setState((s) => ({ ...s, notes: { ...s.notes, [id]: value } }));
  const setContact = (key, value) => {
    setState((s) => ({ ...s, contact: { ...s.contact, [key]: value } }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const validate = () => {
    const found = {};
    if (step === 0) {
      if (!contact.name.trim()) found.name = 'Add your name.';
      if (!contact.company.trim()) found.company = 'Add your company or brand.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) found.email = 'Add a valid email address.';
    } else if (section) {
      for (const q of visibleQuestions(section, answers)) {
        if (q.required && !isAnswered(q, answers[q.id])) {
          found[q.id] = q.type === 'multi' ? 'Choose at least one option.' : q.type === 'single' ? 'Choose an option.' : 'Add an answer.';
        }
      }
    }
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      const el = document.getElementById(`field-${first}`);
      el?.scrollIntoView({ block: 'center' });
      el?.querySelector('input, textarea')?.focus({ preventScroll: true });
    }
    return !first;
  };

  const next = () => {
    if (validate()) goTo(step + 1);
  };

  const submit = async () => {
    setSending(true);
    setSendError('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, answers, notes, closingNote: state.closingNote, website: hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
      setDone(true);
      window.scrollTo(0, 0);
    } catch (e) {
      setSendError(e.message);
    } finally {
      setSending(false);
    }
  };

  if (!loaded) return null;

  const total = REVIEW + 1;
  const progress = done ? 100 : Math.round((step / (total - 1)) * 100);
  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <div className="topbar-inner">
            <span className="brand">Signal Theory</span>
            <span className="eyebrow" aria-live="polite">
              {done ? 'Sent' : step === 0 ? 'Start' : step === REVIEW ? 'Review' : `Step ${step} of ${SECTIONS.length}`}
            </span>
          </div>
        </div>
        <div className="progress" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <main className="form">
        <div className="wrap">
          {done ? (
            <Done contact={contact} answers={answers} notes={notes} numbers={numbers} closingNote={state.closingNote} />
          ) : (
            <>
              {errorCount > 0 && (
                <div className="alert" role="alert">
                  {errorCount === 1 ? 'One answer is missing.' : `${errorCount} answers are missing.`} They are marked below.
                </div>
              )}

              {step === 0 && (
                <>
                  <div className="section-head">
                    <p className="eyebrow">Website questionnaire</p>
                    <h1 ref={headingRef} tabIndex={-1}>Tell us about your website project</h1>
                    <p className="lead">
                      Your answers help us recommend the right approach before we talk. It takes about 10 minutes, your progress is saved on this device and
                      you can add a note to any question.
                    </p>
                  </div>
                  <div className="card">
                    <div className="fields">
                      <Field id="name" label="Your name" value={contact.name} onChange={(v) => setContact('name', v)} error={errors.name} autoComplete="name" />
                      <Field id="role" label="Your role" optional value={contact.role} onChange={(v) => setContact('role', v)} autoComplete="organization-title" />
                      <Field id="company" label="Company or brand" value={contact.company} onChange={(v) => setContact('company', v)} error={errors.company} autoComplete="organization" />
                      <Field id="email" type="email" label="Email" value={contact.email} onChange={(v) => setContact('email', v)} error={errors.email} autoComplete="email" inputMode="email" />
                      <div className="hp" aria-hidden="true">
                        <label htmlFor="website">Website</label>
                        <input id="website" type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {section && (
                <>
                  <div className="section-head">
                    <p className="eyebrow">
                      Part {step} of {SECTIONS.length}
                    </p>
                    <h2 ref={headingRef} tabIndex={-1}>{section.title}</h2>
                    <p>{section.intro}</p>
                  </div>
                  {visibleQuestions(section, answers).map((q) => (
                    <Question
                      key={q.id}
                      q={q}
                      number={numbers[q.id]}
                      value={answers[q.id]}
                      note={notes[q.id] || ''}
                      error={errors[q.id]}
                      onChange={(v) => setAnswer(q.id, v)}
                      onNote={(v) => setNote(q.id, v)}
                    />
                  ))}
                </>
              )}

              {step === REVIEW && (
                <>
                  <div className="section-head">
                    <p className="eyebrow">Review</p>
                    <h2 ref={headingRef} tabIndex={-1}>Check your answers</h2>
                    <p>Change anything you like, then send it to us.</p>
                  </div>
                  {sendError && (
                    <div className="alert" role="alert">
                      {sendError}
                    </div>
                  )}
                  <Recap answers={answers} notes={notes} numbers={numbers} onEdit={goTo} />
                  <div className="card">
                    <label htmlFor="closing" style={{ fontWeight: 500 }}>
                      Anything else we should know? <span className="q-optional">Optional</span>
                    </label>
                    <textarea id="closing" value={state.closingNote} onChange={(e) => setState((s) => ({ ...s, closingNote: e.target.value }))} />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

      {!done && (
        <div className="nav">
          <div className="wrap">
            <div className="nav-inner">
              {step > 0 && (
                <button type="button" className="btn ghost" onClick={() => goTo(step - 1)}>
                  Back
                </button>
              )}
              {step < REVIEW ? (
                <button type="button" className="btn" onClick={next}>
                  {step === 0 ? 'Start' : step === SECTIONS.length ? 'Review answers' : 'Next'}
                </button>
              ) : (
                <button type="button" className="btn" onClick={submit} disabled={sending}>
                  {sending ? 'Sending' : 'Send answers'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ id, label, value, onChange, error, optional, type = 'text', ...rest }) {
  return (
    <div className="field" id={`field-${id}`}>
      <label htmlFor={id}>
        {label} {optional && <span className="q-optional">Optional</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        required={!optional}
        {...rest}
      />
      {error && (
        <p className="q-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

function Question({ q, number, value, note, error, onChange, onNote }) {
  const [open, setOpen] = useState(Boolean(note));
  const isChoice = q.type === 'single' || q.type === 'multi';
  const num = String(number).padStart(2, '0');
  const describedBy = [q.help ? `${q.id}-help` : null, error ? `${q.id}-error` : null].filter(Boolean).join(' ') || undefined;

  const toggle = (opt) => {
    const current = Array.isArray(value) ? value : [];
    if (current.includes(opt.value)) return onChange(current.filter((v) => v !== opt.value));
    if (opt.exclusive) return onChange([opt.value]);
    const exclusive = q.options.filter((o) => o.exclusive).map((o) => o.value);
    onChange([...current.filter((v) => !exclusive.includes(v)), opt.value]);
  };

  const title = (
    <>
      <span className="q-num" aria-hidden="true">
        {num}
      </span>
      <span>
        {q.text} {!q.required && <span className="q-optional">Optional</span>}
      </span>
    </>
  );

  return (
    <fieldset className={`question${error ? ' invalid' : ''}`} id={`field-${q.id}`} aria-describedby={isChoice ? describedBy : undefined}>
      {isChoice ? (
        <legend className="q-title">{title}</legend>
      ) : (
        <label className="q-title" htmlFor={q.id}>
          {title}
        </label>
      )}
      {q.help && (
        <p className="q-help" id={`${q.id}-help`}>
          {q.help}
        </p>
      )}

      {isChoice && (
        <div className="options">
          {q.options.map((opt) => {
            const checked = q.type === 'single' ? value === opt.value : Array.isArray(value) && value.includes(opt.value);
            return (
              <label className="option" key={opt.value}>
                <input
                  type={q.type === 'single' ? 'radio' : 'checkbox'}
                  name={q.id}
                  value={opt.value}
                  checked={checked}
                  onChange={() => (q.type === 'single' ? onChange(opt.value) : toggle(opt))}
                />
                <span className="box">
                  <span className="mark" aria-hidden="true" />
                  <span className="text">
                    <span>{opt.label}</span>
                    {opt.detail && <span className="detail">{opt.detail}</span>}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      )}

      {q.type === 'long' && (
        <textarea id={q.id} value={value || ''} placeholder={q.placeholder} onChange={(e) => onChange(e.target.value)} aria-describedby={describedBy} aria-invalid={error ? 'true' : undefined} />
      )}
      {q.type === 'text' && (
        <input id={q.id} type="text" style={{ marginTop: 14 }} value={value || ''} placeholder={q.placeholder} onChange={(e) => onChange(e.target.value)} aria-describedby={describedBy} />
      )}

      {error && (
        <p className="q-error" id={`${q.id}-error`}>
          {error}
        </p>
      )}

      {isChoice &&
        (open ? (
          <div className="note">
            <label htmlFor={`${q.id}-note`}>Your note</label>
            <textarea id={`${q.id}-note`} value={note} onChange={(e) => onNote(e.target.value)} />
          </div>
        ) : (
          <button type="button" className="note-toggle" onClick={() => setOpen(true)}>
            Add a note
          </button>
        ))}
    </fieldset>
  );
}

function Recap({ answers, notes, numbers, onEdit }) {
  return SECTIONS.map((s, i) => (
    <div className="card" key={s.id}>
      <div className="card-head">
        <h3>{s.title}</h3>
        {onEdit && (
          <button type="button" className="edit" onClick={() => onEdit(i + 1)} aria-label={`Edit ${s.title}`}>
            Edit
          </button>
        )}
      </div>
      {visibleQuestions(s, answers).map((q) => {
        const text = formatAnswer(q, answers[q.id]);
        return (
          <div className="qa" key={q.id}>
            <span className="q">
              {String(numbers[q.id]).padStart(2, '0')} {q.text}
            </span>
            <span className={`a${text ? '' : ' empty'}`}>{text || 'No answer'}</span>
            {notes[q.id]?.trim() && (
              <div className="client-note">
                <b>Your note</b>
                {notes[q.id].trim()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  ));
}

function Done({ contact, answers, notes, numbers, closingNote }) {
  return (
    <>
      <div className="section-head">
        <p className="eyebrow">Thank you</p>
        <h1 tabIndex={-1}>We have your answers, {contact.name.trim().split(' ')[0]}</h1>
        <p className="lead">Our team will review them and reach out to set up a call to walk through what we recommend. A copy of what you sent is below.</p>
        <div className="actions no-print">
          <button type="button" className="btn inline ghost" onClick={() => window.print()}>
            Print or save a copy
          </button>
        </div>
      </div>
      <Recap answers={answers} notes={notes} numbers={numbers} />
      {closingNote?.trim() && (
        <div className="card">
          <h3 style={{ marginBottom: 10 }}>Anything else</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{closingNote.trim()}</p>
        </div>
      )}
    </>
  );
}
