// Tier recommendation.
// Tiers are set by creative output and by whether the site works like software.
// Site size never changes the tier. Size and complexity show up as scoping flags.

export const TIERS = {
  1: {
    name: 'Tier 1 Lightweight',
    summary: 'A polished site on proven layouts with the brand applied.',
    includes: [
      'Starter layouts with the brand applied',
      'Page preview of the homepage and one inner page',
      'One review round per stage',
    ],
  },
  2: {
    name: 'Tier 2 Standard',
    summary: 'A custom design direction chosen from two concepts.',
    includes: [
      'Two creative concepts with a living style guide',
      'Page preview of three templates, checked with 3 to 5 users',
      'Two review rounds per stage',
    ],
  },
  3: {
    name: 'Tier 3 Custom',
    summary: 'A signature experience with deeper research and prototyping.',
    includes: [
      'Two creative concepts and a signature interaction',
      'Templates and prototypes of key flows, tested with users',
      'Full five-phase user research',
      'Three review rounds per stage',
    ],
  },
  4: {
    name: 'Tier 4 Platform',
    summary: 'A site that works like software, where people sign in and use it.',
    includes: [
      'Its own discovery phase with a technical plan',
      'A standalone design system',
      'Accounts, custom systems and a security review',
      'Review rounds set per phase',
    ],
  },
};

const has = (v, x) => Array.isArray(v) && v.includes(x);

export function recommend(a = {}) {
  const reasons = [];
  const flags = [];
  let score = 0;

  // Creative output
  if (a.qd === 'standout') {
    score += 4;
    reasons.push('They want a standout experience people remember.');
  } else if (a.qd === 'tailored') {
    score += 2;
    reasons.push('They want a custom look built around their brand.');
  } else if (a.qd === 'clean') {
    reasons.push('They want a clean site built on proven patterns.');
  }

  if (a.q16 === 'core') {
    score += 2;
    reasons.push('Motion is a core part of the experience.');
  } else if (a.q16 === 'nice') {
    score += 1;
    reasons.push('Motion is a nice-to-have.');
  }

  const newAssets = ['photo', 'video', 'illustration', 'icons'].filter((x) => has(a.q17, x));
  if (has(a.q17, 'illustration') || has(a.q17, 'icons')) {
    score += 1;
    reasons.push('They need new illustration or iconography.');
  }
  if (has(a.q17, 'photo') || has(a.q17, 'video')) {
    flags.push('New photography or video is needed. Scope it as a production cost.');
  }

  if (a.q14 === 'outdated' || a.q14 === 'none') {
    score += 1;
    reasons.push('Brand guidelines are outdated or missing, so the direction stage carries more of the brand work.');
  }
  if (a.q14 === 'rebrand' || has(a.q3, 'rebrand')) {
    flags.push('A rebrand is in play. Confirm timing and whether brand work is a separate scope.');
  }

  let creative = 1;
  if (score >= 5) creative = 3;
  else if (score >= 2) creative = 2;

  // Platform signals: the site works like software
  const platform = [];
  if (has(a.q22, 'accounts')) platform.push('user accounts');
  if (has(a.q22, 'roles')) platform.push('role-based permissions');
  if (has(a.q18, 'login')) platform.push('login');
  if (has(a.q18, 'ecommerce')) platform.push('an online store');

  let tier = creative;
  if (platform.length > 0) {
    tier = 4;
    reasons.unshift(`The site works like software. They need ${listWords(platform)}.`);
  }

  // Scoping flags. These affect the build, not the tier.
  if (a.q9 === '11-15' || a.q9 === '16+') flags.push('Many page types. Plan extra template time in build-out.');
  if (a.q9 === 'unsure') flags.push('Page types are unknown. Settle the page list in discovery.');
  if (a.q13 && a.q13 !== 'no') flags.push('Multiple languages or regions. Plan the content structure early.');
  if (a.q10 === 'st' || a.q10 === 'mix') flags.push('Signal Theory is writing some or all of the copy.');
  if (a.q10 === 'unsure') flags.push('Copy ownership is undecided. Resolve before direction starts.');
  if (has(a.q11, 'none')) flags.push('No content is ready. Content is the biggest schedule risk.');
  if (a.q5 === 'none' || a.q5 === 'analytics') flags.push('Little or no audience research exists. Plan user research in discovery.');
  if (a.q5 === 'recent') flags.push('Recent research exists. Start discovery from it.');
  const systems = (a.q19 || []).filter((x) => x !== 'none' && x !== 'unsure');
  if (systems.length >= 3) flags.push(`${systems.length} systems to connect. Involve development in discovery.`);
  if (has(a.q19, 'unsure')) flags.push('Integrations are unknown. Confirm them in discovery.');
  if (has(a.q22, 'gated') && tier !== 4) flags.push('Gated content is needed without full accounts. Confirm how access works.');
  if (a.q20 === 'client-nontech') flags.push('Non-technical editors will run the site. Editing has to be simple. Consider Framer.');
  if (a.q21 === 'preferred' || a.q21 === 'contract') flags.push('They have a CMS, host or vendor preference. Check the note before choosing the build path.');
  if (a.q23 === 'yes') flags.push('Accessibility or legal requirements go beyond WCAG 2.2 AA.');
  if (a.q25 === 'critical') flags.push('Search is critical to the business. Include a full search audit and redirect plan.');
  if (a.q27 === 'yes') flags.push('Tracking, consent or privacy requirements apply.');
  if (a.q31 === 'yes') flags.push('There is a hard launch date. Check it against the tier timeline.');
  if (a.q1 === 'move') flags.push('This is a platform move. Plan content migration and redirects.');
  if (a.q1 === 'refresh') flags.push('This is a partial refresh. Confirm which pages are in scope.');
  if (has(a.q3, 'merger')) flags.push('A merger or acquisition is involved. Expect ownership and access questions.');

  return {
    tier,
    tierInfo: TIERS[tier],
    creative,
    creativeInfo: TIERS[creative],
    score,
    reasons,
    flags,
    newAssets,
  };
}

function listWords(items) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}
