'use client';

import { useState } from 'react';

export default function PrintButton() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <>
      <button type="button" className="btn inline" onClick={copy}>
        {copied ? 'Link copied' : 'Copy share link'}
      </button>
      <button type="button" className="btn inline ghost" onClick={() => window.print()}>
        Print or save as PDF
      </button>
    </>
  );
}
