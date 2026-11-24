// Add-ons: things the client asked for or needs that the recommended tier does not include.
// What each tier includes follows the deliverables in the website process deck.
// Effort levels are rough guides for the team to confirm when scoping. They are not estimates.

const has = (v, x) => Array.isArray(v) && v.includes(x);

const listWords = (items) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

const SYSTEMS = {
  crm: 'a CRM',
  email: 'an email platform',
  payments: 'payments',
  erp: 'product or inventory data',
  scheduling: 'scheduling',
  api: 'other systems',
};

const FEATURES = {
  search: 'site search',
  filtering: 'filtering',
  booking: 'booking or scheduling',
  calculators: 'calculators or product finders',
  maps: 'maps or a location finder',
};

const PAGE_TYPES = { '6-10': '6 to 10', '11-15': '11 to 15', '16+': 'more than 15' };
const SUPPORT = { 1: '30 days of bug support', 2: '60 days of support', 3: '90 days of support and a 30-day review' };

export function findAddOns(a = {}, tier) {
  // Tier 4 is a custom proposal, so nothing sits outside it.
  if (tier === 4) return [];
  const out = [];
  const add = (item) => out.push(item);

  // Integrations
  const systems = (a.q19 || []).filter((x) => SYSTEMS[x]);
  if (tier === 1 && systems.length) {
    add({
      key: 'systems',
      title: 'Integrations beyond forms and analytics',
      asked: `They need to connect ${listWords(systems.map((x) => SYSTEMS[x]))}.`,
      included: 'Tier 1 covers forms and analytics only.',
      effort:
        'Each connection means mapping fields, building the link, testing it end to end and handling errors. We need access to each system and a contact on the client side.',
      stage: 'Discovery and build-out',
      level: systems.length >= 2 ? 'Heavy' : 'Moderate',
    });
  }
  if (tier === 2) {
    const firstSimple = systems.find((x) => x === 'crm' || x === 'email');
    const extra = systems.filter((x) => x !== firstSimple);
    if (extra.length) {
      add({
        key: 'systems',
        title: 'Additional integrations',
        asked: `Beyond the one included, they need to connect ${listWords(extra.map((x) => SYSTEMS[x]))}.`,
        included: 'Tier 2 covers one CRM or email platform.',
        effort:
          'Each extra connection means mapping fields, building the link, testing it end to end and handling errors. Payments and product data also need a security and data review.',
        stage: 'Discovery and build-out',
        level: extra.length >= 2 ? 'Heavy' : 'Moderate',
      });
    }
  }

  // Interactive features
  const featureKeys = tier === 1 ? ['search', 'filtering', 'booking', 'calculators', 'maps'] : tier === 2 ? ['booking', 'calculators', 'maps'] : [];
  const features = featureKeys.filter((x) => has(a.q18, x));
  if (features.length) {
    add({
      key: 'features',
      title: tier === 1 ? 'Interactive features beyond a contact form' : 'Custom interactive tools',
      asked: `They asked for ${listWords(features.map((x) => FEATURES[x]))}.`,
      included: tier === 1 ? 'Tier 1 covers a contact or lead form.' : 'Tier 2 covers custom motion on defined sections, not custom tools.',
      effort:
        'Each feature needs its own logic, design, build and testing. Search and filtering depend on how the content is structured, and maps can carry a license cost.',
      stage: 'Page preview and build-out',
      level: features.length >= 2 ? 'Heavy' : 'Moderate',
    });
  }

  // Page templates
  const overT1 = tier === 1 && ['6-10', '11-15', '16+'].includes(a.q9);
  const overT2 = tier === 2 && ['11-15', '16+'].includes(a.q9);
  if (overT1 || overT2) {
    add({
      key: 'pages',
      title: 'Additional page templates',
      asked: `They expect ${PAGE_TYPES[a.q9]} page types.`,
      included: tier === 1 ? 'Tier 1 covers 3 to 6 templates.' : 'Tier 2 covers 6 to 12 templates.',
      effort: 'Every extra template is designed, built, made responsive and tested. Confirm the real count in discovery, since page types are often fewer than clients expect.',
      stage: 'Build-out',
      level: a.q9 === '16+' || (tier === 1 && a.q9 === '11-15') ? 'Heavy' : 'Moderate',
    });
  }

  // Illustration and iconography
  if (tier === 1 && (has(a.q17, 'illustration') || has(a.q17, 'icons'))) {
    add({
      key: 'illustration',
      title: 'Custom illustration or iconography',
      asked: 'They need new illustration or iconography.',
      included: 'Tier 1 does not include custom illustration.',
      effort: 'Style exploration, drawing the set and preparing the files for the web. It runs alongside the direction stage.',
      stage: 'Direction',
      level: 'Moderate',
    });
  }

  // Photography and video
  if (has(a.q17, 'photo') || has(a.q17, 'video')) {
    const kinds = [has(a.q17, 'photo') && 'photography', has(a.q17, 'video') && 'video'].filter(Boolean);
    add({
      key: 'photo',
      title: 'Photography or video production',
      asked: `They need new ${listWords(kinds)}.`,
      included: 'No tier includes production.',
      effort: 'Planning, shooting or sourcing, editing and preparing files for the web. Treat it as a separate production cost with its own schedule.',
      stage: 'Direction and build-out',
      level: 'Heavy',
    });
  }

  // Copywriting
  if (a.q10 === 'st' || a.q10 === 'mix') {
    add({
      key: 'copy',
      title: 'Copywriting',
      asked: a.q10 === 'st' ? 'They want Signal Theory to write the copy.' : 'They want Signal Theory to write part of the copy.',
      included: 'The tier deliverables do not include writing the site copy.',
      effort: 'Messaging, page-by-page writing and client review rounds. The amount depends on the number of pages, so size it once the page list is set.',
      stage: 'Discovery through build-out',
      level: a.q10 === 'st' ? 'Heavy' : 'Moderate',
    });
  }

  // User research
  if ((tier === 1 || tier === 2) && (a.q5 === 'none' || a.q5 === 'analytics')) {
    add({
      key: 'research',
      title: 'Full user research',
      asked: a.q5 === 'none' ? 'They have no research on their audiences.' : 'They have analytics but no research on their audiences.',
      included:
        tier === 1
          ? 'Tier 1 covers a stakeholder conversation and an analytics review.'
          : 'Tier 2 covers a usability check of the page preview with 3 to 5 people.',
      effort:
        'All five phases: plan, recruit, review, observe and synthesize. It needs 5 to 8 participants at 45 to 60 minutes each, plus customer contacts from the client or a recruiting budget.',
      stage: 'Discovery',
      level: 'Heavy',
    });
  }

  // Search
  if (a.q25 === 'critical') {
    if (tier === 1) {
      add({
        key: 'search',
        title: 'Search audit',
        asked: 'Search traffic is critical to their business.',
        included: 'Tier 1 covers search basics only.',
        effort: 'Audit current rankings and content, set priorities and plan redirects so existing traffic carries over to the new site.',
        stage: 'Discovery and launch',
        level: 'Moderate',
      });
    } else if (tier === 2 && (a.q1 === 'redesign' || a.q1 === 'move')) {
      add({
        key: 'search',
        title: 'Search migration plan',
        asked: 'Search traffic is critical to their business and the current site is being replaced.',
        included: 'Tier 2 covers a search audit and search setup.',
        effort: 'Map every ranking page to its new address, set up redirects and watch rankings after launch.',
        stage: 'Build-out and launch',
        level: 'Moderate',
      });
    }
  }

  // Languages and regions
  if ((tier === 1 || tier === 2) && a.q13 && a.q13 !== 'no') {
    add({
      key: 'multi',
      title: 'Multiple languages or regions',
      asked: a.q13 === 'both' ? 'The site serves more than one language and region.' : a.q13 === 'languages' ? 'The site needs more than one language.' : 'The site serves more than one region.',
      included: 'An advanced content system starts at Tier 3.',
      effort:
        'Content has to be structured for each language or region, with a way to switch between them and a plan for who translates. Every template is tested in each version.',
      stage: 'Discovery and build-out',
      level: 'Heavy',
    });
  }

  // Gated content
  if (has(a.q22, 'gated')) {
    add({
      key: 'gated',
      title: 'Gated content',
      asked: 'They need gated content.',
      included: 'Tiers 1 to 3 do not include logins.',
      effort: 'Decide how access is granted, build the gate and connect it to a form or email platform. Full user accounts would move the project to Tier 4.',
      stage: 'Build-out',
      level: 'Moderate',
    });
  }

  // Accessibility
  if ((tier === 1 || tier === 2) && a.q23 === 'yes') {
    add({
      key: 'a11y',
      title: 'Accessibility beyond WCAG 2.2 AA',
      asked: 'They have accessibility or legal requirements beyond our standard.',
      included: `Tier ${tier} covers a WCAG 2.2 AA review with fixes.`,
      effort: 'Confirm the exact standard or legal requirement, run a full audit with assistive technology and document the results.',
      stage: 'Build-out',
      level: 'Moderate',
    });
  }

  // Consent and privacy
  if ((tier === 1 || tier === 2) && a.q27 === 'yes') {
    add({
      key: 'privacy',
      title: 'Consent and privacy setup',
      asked: 'They have tracking, consent or privacy requirements.',
      included: 'Consent tools are part of Tier 3.',
      effort: 'Choose and configure a consent tool, make sure tracking respects it and review the setup with the client’s legal contact.',
      stage: 'Build-out',
      level: 'Moderate',
    });
  }

  // Training
  if (tier === 1 && a.q20 === 'client-nontech') {
    add({
      key: 'training',
      title: 'Extended training',
      asked: 'Their editors are not technical.',
      included: 'Tier 1 covers a recorded walkthrough and a short editing guide.',
      effort: 'A live training session and fuller documentation written for non-technical editors.',
      stage: 'Launch',
      level: 'Light',
    });
  }

  // Ongoing support
  if (has(a.q30, 'content') || has(a.q30, 'improve')) {
    const wants = [has(a.q30, 'content') && 'content updates', has(a.q30, 'improve') && 'continuous improvement'].filter(Boolean);
    add({
      key: 'support',
      title: 'Ongoing support',
      asked: `They want ${listWords(wants)} after launch.`,
      included: `Tier ${tier} covers ${SUPPORT[tier]}.`,
      effort: 'A monthly retainer with agreed hours and response times, set up as its own agreement.',
      stage: 'After launch',
      level: has(a.q30, 'improve') ? 'Heavy' : 'Moderate',
    });
  }

  // Content migration
  if ((tier === 1 || tier === 2) && a.q1 === 'move') {
    add({
      key: 'move',
      title: 'Content migration',
      asked: 'They are moving the current site to a new platform.',
      included: 'Content migration assistance starts at Tier 3.',
      effort: 'Inventory the current content, move and reformat it for the new templates and check every page.',
      stage: 'Build-out',
      level: 'Heavy',
    });
  }

  return out;
}
