// The questions come from the appendix of the website process deck.
// Each one has an answer format so the form is quick to complete on a phone,
// and every question accepts an optional note.

const isNewSite = (a) => a.q1 === 'new';

export const SECTIONS = [
  {
    id: 'goals',
    title: 'Goals and audiences',
    intro: 'What the site is for and who it serves.',
    questions: [
      {
        id: 'q1',
        text: 'Which best describes this project?',
        type: 'single',
        required: true,
        options: [
          { value: 'new', label: 'A new site, with no current site' },
          { value: 'redesign', label: 'A redesign of our current site' },
          { value: 'move', label: 'A move to a new platform' },
          { value: 'refresh', label: 'A refresh of a few pages' },
        ],
      },
      {
        id: 'q2',
        text: 'What is the primary job of the website?',
        type: 'single',
        required: true,
        options: [
          { value: 'sell', label: 'Sell products online' },
          { value: 'leads', label: 'Bring in leads or quote requests' },
          { value: 'locate', label: 'Help people find a location or dealer' },
          { value: 'brand', label: 'Tell our story and build the brand' },
          { value: 'recruit', label: 'Recruit people' },
          { value: 'support', label: 'Give customers information or support' },
          { value: 'other', label: 'Something else' },
        ],
      },
      {
        id: 'q3',
        text: 'Is a business change driving this project?',
        help: 'Choose all that apply.',
        type: 'multi',
        required: true,
        options: [
          { value: 'rebrand', label: 'A rebrand or new name' },
          { value: 'merger', label: 'A merger or acquisition' },
          { value: 'products', label: 'New products or services' },
          { value: 'audience', label: 'A new audience or market' },
          { value: 'platform', label: 'Our current platform is ending' },
          { value: 'none', label: 'None of these', exclusive: true },
        ],
      },
      {
        id: 'q4',
        text: 'Who are the main groups of people who use the site, and what do they come to do?',
        type: 'long',
        required: true,
        placeholder: 'For example: contractors comparing products, job seekers looking for openings',
      },
      {
        id: 'q5',
        text: 'What research or analytics do you already have about those people?',
        type: 'single',
        required: true,
        options: [
          { value: 'recent', label: 'Recent research from the last two years' },
          { value: 'older', label: 'Older or partial research' },
          { value: 'analytics', label: 'Website analytics only' },
          { value: 'none', label: 'None' },
        ],
      },
      {
        id: 'q6',
        text: 'How will you measure success 6 and 12 months after launch?',
        type: 'long',
        placeholder: 'For example: more quote requests, fewer support calls',
      },
      {
        id: 'q7',
        text: 'What works well on the site today, and what do users complain about?',
        type: 'long',
        showIf: (a) => !isNewSite(a),
      },
      {
        id: 'q8',
        text: 'Which pages or features must be preserved, such as high-traffic pages or existing tools?',
        type: 'long',
        showIf: (a) => !isNewSite(a),
      },
    ],
  },
  {
    id: 'structure',
    title: 'Site structure and content',
    intro: 'What goes on the site and who provides it.',
    questions: [
      {
        id: 'q9',
        text: 'Roughly how many distinct page types do you need?',
        help: 'A page type is a layout that is reused, such as a product page or an article.',
        type: 'single',
        required: true,
        options: [
          { value: '1-5', label: '1 to 5' },
          { value: '6-10', label: '6 to 10' },
          { value: '11-15', label: '11 to 15' },
          { value: '16+', label: 'More than 15' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'q10',
        text: 'Who writes the copy?',
        help: 'Add a note to tell us when it can realistically be delivered.',
        type: 'single',
        required: true,
        options: [
          { value: 'client', label: 'Our team' },
          { value: 'st', label: 'Signal Theory' },
          { value: 'mix', label: 'A mix' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'q11',
        text: 'What content already exists in usable form?',
        help: 'Choose all that apply.',
        type: 'multi',
        required: true,
        options: [
          { value: 'photo', label: 'Photography' },
          { value: 'video', label: 'Video' },
          { value: 'cases', label: 'Case studies' },
          { value: 'product', label: 'Product data' },
          { value: 'copy', label: 'Written content' },
          { value: 'none', label: 'None of it is ready', exclusive: true },
        ],
      },
      {
        id: 'q12',
        text: 'Do you have a content inventory or sitemap from the current site?',
        type: 'single',
        required: true,
        showIf: (a) => !isNewSite(a),
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'q13',
        text: 'Will the site be multilingual or serve multiple regions?',
        type: 'single',
        required: true,
        options: [
          { value: 'no', label: 'No' },
          { value: 'languages', label: 'Yes, more than one language' },
          { value: 'regions', label: 'Yes, more than one region' },
          { value: 'both', label: 'Yes, both' },
        ],
      },
    ],
  },
  {
    id: 'design',
    title: 'Design and brand',
    intro: 'How the site should look, move and feel.',
    questions: [
      {
        id: 'q14',
        text: 'Do you have current, approved brand guidelines, logos, color and typography files?',
        type: 'single',
        required: true,
        options: [
          { value: 'current', label: 'Yes, current and in use' },
          { value: 'outdated', label: 'Yes, but they are outdated' },
          { value: 'none', label: 'No, we do not have guidelines' },
          { value: 'rebrand', label: 'A rebrand is underway' },
        ],
      },
      {
        id: 'q15',
        text: 'Is there a direction you already like, a competitor site or a site you would rather avoid?',
        type: 'long',
        placeholder: 'Paste links and tell us what you like or dislike about each',
      },
      {
        id: 'qd',
        text: 'How distinctive should the site feel?',
        type: 'single',
        required: true,
        options: [
          { value: 'clean', label: 'Clean and proven', detail: 'A polished site built on familiar patterns' },
          { value: 'tailored', label: 'Tailored to us', detail: 'A custom look built around our brand' },
          { value: 'standout', label: 'A standout experience', detail: 'Something people remember and talk about' },
        ],
      },
      {
        id: 'q16',
        text: 'Is motion a core part of the experience or a nice-to-have?',
        type: 'single',
        required: true,
        options: [
          { value: 'core', label: 'A core part of the experience' },
          { value: 'nice', label: 'A nice-to-have' },
          { value: 'minimal', label: 'Keep it minimal' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'q17',
        text: 'Will you need new photography, illustration or iconography?',
        help: 'Choose all that apply.',
        type: 'multi',
        required: true,
        options: [
          { value: 'photo', label: 'Photography' },
          { value: 'video', label: 'Video' },
          { value: 'illustration', label: 'Illustration' },
          { value: 'icons', label: 'Iconography' },
          { value: 'none', label: 'None', exclusive: true },
        ],
      },
    ],
  },
  {
    id: 'function',
    title: 'Functionality and development',
    intro: 'What the site needs to do and connect to.',
    questions: [
      {
        id: 'q18',
        text: 'What interactive features do you need?',
        help: 'Choose all that apply.',
        type: 'multi',
        required: true,
        options: [
          { value: 'forms', label: 'Forms' },
          { value: 'search', label: 'Site search' },
          { value: 'filtering', label: 'Filtering' },
          { value: 'booking', label: 'Booking or scheduling' },
          { value: 'calculators', label: 'Calculators or product finders' },
          { value: 'maps', label: 'Maps or a location finder' },
          { value: 'login', label: 'Login' },
          { value: 'ecommerce', label: 'Online store' },
          { value: 'none', label: 'None of these', exclusive: true },
        ],
      },
      {
        id: 'q19',
        text: 'Which systems must the site connect to?',
        help: 'Choose all that apply. Add a note to name the tools you use.',
        type: 'multi',
        required: true,
        options: [
          { value: 'crm', label: 'A CRM such as Salesforce or HubSpot' },
          { value: 'email', label: 'An email platform' },
          { value: 'analytics', label: 'Analytics' },
          { value: 'payments', label: 'Payments' },
          { value: 'erp', label: 'Product or inventory data' },
          { value: 'scheduling', label: 'Scheduling' },
          { value: 'api', label: 'Other systems' },
          { value: 'none', label: 'None', exclusive: true },
          { value: 'unsure', label: 'Not sure', exclusive: true },
        ],
      },
      {
        id: 'q20',
        text: 'Who will edit content after launch, and how technical are they?',
        type: 'single',
        required: true,
        options: [
          { value: 'client-tech', label: 'Our team, and they are comfortable with web tools' },
          { value: 'client-nontech', label: 'Our team, and they are not technical' },
          { value: 'st', label: 'Signal Theory' },
          { value: 'mix', label: 'A mix' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'q21',
        text: 'Do you have a preferred CMS or hosting setup, or an existing vendor contract?',
        help: 'Add a note to tell us which one.',
        type: 'single',
        required: true,
        options: [
          { value: 'no', label: 'No preference' },
          { value: 'preferred', label: 'Yes, a preferred CMS or host' },
          { value: 'contract', label: 'Yes, an existing vendor contract' },
        ],
      },
      {
        id: 'q22',
        text: 'Will the site need user accounts, gated content or role-based permissions?',
        help: 'Choose all that apply.',
        type: 'multi',
        required: true,
        options: [
          { value: 'accounts', label: 'User accounts' },
          { value: 'gated', label: 'Gated content' },
          { value: 'roles', label: 'Different permissions for different roles' },
          { value: 'none', label: 'None of these', exclusive: true },
        ],
      },
    ],
  },
  {
    id: 'standards',
    title: 'Standards and quality',
    intro: 'Accessibility, performance, search and privacy.',
    questions: [
      {
        id: 'q23',
        text: 'We build every site to WCAG 2.2 AA. Do you have accessibility or legal obligations beyond that?',
        type: 'single',
        required: true,
        options: [
          { value: 'no', label: 'No, that standard is right for us' },
          { value: 'yes', label: 'Yes, we have stricter or legal requirements' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'q24',
        text: 'Every site works across all major browsers and devices. Which devices do your users rely on most?',
        help: 'Add a note if you have specific speed targets.',
        type: 'single',
        required: true,
        options: [
          { value: 'mobile', label: 'Mostly phones' },
          { value: 'desktop', label: 'Mostly desktop' },
          { value: 'even', label: 'An even mix' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'q25',
        text: 'How important is search traffic to the business?',
        help: 'Add a note about any SEO work that has been done.',
        type: 'single',
        required: true,
        options: [
          { value: 'critical', label: 'Critical to the business' },
          { value: 'important', label: 'Important' },
          { value: 'nice', label: 'Nice to have' },
        ],
      },
      {
        id: 'q26',
        text: 'Who are your top competitors, and what do people search for or ask AI tools before choosing a brand like yours?',
        type: 'long',
      },
      {
        id: 'q27',
        text: 'Are there tracking, consent or privacy requirements?',
        type: 'single',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
    ],
  },
  {
    id: 'process',
    title: 'Ownership, maintenance and process',
    intro: 'Who decides, who owns what and when it is due.',
    questions: [
      {
        id: 'q28',
        text: 'Who owns the domain, hosting accounts and analytics, and who needs admin access?',
        type: 'long',
      },
      {
        id: 'q29',
        text: 'Who is the single decision-maker for approvals, and who else must sign off?',
        type: 'long',
        required: true,
      },
      {
        id: 'q30',
        text: 'What level of support do you want after launch?',
        help: 'Choose all that apply.',
        type: 'multi',
        required: true,
        options: [
          { value: 'bugs', label: 'Bug fixes' },
          { value: 'content', label: 'Content updates' },
          { value: 'improve', label: 'Continuous improvement' },
          { value: 'none', label: 'None for now', exclusive: true },
        ],
      },
      {
        id: 'q31',
        text: 'Is there a hard launch date tied to an event, campaign or fiscal deadline?',
        help: 'Add a note with the date.',
        type: 'single',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        id: 'q32',
        text: 'What is the approximate budget range?',
        type: 'text',
        placeholder: 'A range is fine',
      },
    ],
  },
];

export function visibleQuestions(section, answers) {
  return section.questions.filter((q) => !q.showIf || q.showIf(answers));
}

// Sequential numbers across the questions a given client actually sees.
export function numberMap(answers) {
  const map = {};
  let n = 0;
  for (const s of SECTIONS) {
    for (const q of visibleQuestions(s, answers)) {
      n += 1;
      map[q.id] = n;
    }
  }
  return map;
}

export function isAnswered(q, value) {
  if (q.type === 'multi') return Array.isArray(value) && value.length > 0;
  return typeof value === 'string' && value.trim().length > 0;
}

export function formatAnswer(q, value) {
  if (!isAnswered(q, value)) return '';
  if (q.type === 'single') {
    const o = q.options.find((x) => x.value === value);
    return o ? o.label : '';
  }
  if (q.type === 'multi') {
    return value
      .map((v) => q.options.find((x) => x.value === v))
      .filter(Boolean)
      .map((o) => o.label)
      .join(', ');
  }
  return value.trim();
}

export const ALL_QUESTIONS = SECTIONS.flatMap((s) => s.questions);
