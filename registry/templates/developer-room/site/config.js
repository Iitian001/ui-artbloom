/**
 * Everything personal in the room lives in this file. Edit it and refresh: the
 * 3D room, the simple scrollable view and the terminal all read from here.
 *
 * Images are paths below ./assets/. Replace the placeholder SVGs in
 * assets/placeholders/ with your own screenshots, certificates and portrait
 * (any aspect ratio works; they are letterboxed to fit).
 *
 * Fixed slots, because they are physical places in the room:
 *   - projects:      up to 5 cards on the right-wall console
 *   - certificates:  up to 5 frames on the wall behind the desk
 *   - shelf:         up to 24 sculptures on the skill shelves (3 rows of 8)
 */

export const profile = {
  name: 'Mira Okafor',
  role: 'Creative technologist',
  location: 'Lagos · Remote',
  bio: 'I build interactive web experiences, developer tools and small machine-learning products, and I care about the last 10% of polish.',
  avatar: 'placeholders/avatar.svg',
  email: 'hello@example.com',
  availability: 'Available for freelance and remote work',
  // Shown in About and Contact. Any number of links.
  links: [
    { label: 'GitHub', url: 'https://github.com/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
  ],
  // The prompt in the room terminal, e.g. "mira@workspace".
  terminalUser: 'mira@workspace',
};

export const projects = [
  {
    id: 'orbit',
    title: 'Orbit',
    kind: 'DEVELOPER TOOL · OPEN SOURCE',
    stack: ['TypeScript', 'Node.js', 'SQLite'],
    description: 'A local-first dashboard that watches your repositories and tells you which pull requests are waiting on you.',
    image: 'placeholders/project-1.svg',
    url: 'https://example.com/',
    action: 'VISIT LIVE SITE',
    highlights: ['Runs entirely on your machine', 'Zero-config GitHub sync'],
  },
  {
    id: 'tidepool',
    title: 'Tidepool',
    kind: 'WEBGL · INTERACTIVE',
    stack: ['Three.js', 'GLSL'],
    description: 'A shallow-water simulation you can stir with your cursor, rendered in a single fragment shader.',
    image: 'placeholders/project-2.svg',
    url: 'https://example.com/',
    action: 'OPEN DEMO',
    highlights: ['Shallow-water equations on the GPU', '60fps on integrated graphics'],
  },
  {
    id: 'sift',
    title: 'Sift',
    kind: 'AI · SEARCH',
    stack: ['Python', 'Embeddings', 'FastAPI'],
    description: 'Semantic search over your own notes, with answers that cite the paragraph they came from.',
    image: 'placeholders/project-3.svg',
    url: 'https://example.com/',
    action: 'VIEW ON GITHUB',
    highlights: ['Every answer links its source', 'Indexes 10k notes in under a minute'],
  },
  {
    id: 'ledger',
    title: 'Ledger',
    kind: 'FINTECH · DASHBOARD',
    stack: ['Next.js', 'Postgres'],
    description: 'A calm, keyboard-first budgeting app for freelancers with irregular income.',
    image: 'placeholders/project-4.svg',
    url: 'https://example.com/',
    action: 'VISIT LIVE SITE',
    highlights: ['Plans around income, not months', 'Full keyboard navigation'],
  },
  {
    id: 'open-source',
    title: 'Open source',
    kind: 'CONTRIBUTIONS',
    stack: ['React', 'Accessibility'],
    description: 'Fixes and features contributed to libraries I use every day.',
    image: 'placeholders/project-5.svg',
    url: 'https://github.com/',
    action: 'VIEW ON GITHUB',
    highlights: ['Accessibility fixes in UI libraries', 'Docs and examples'],
  },
];

// Projects shown first, as large cards, in the Projects panel.
export const featuredIds = ['orbit', 'tidepool', 'sift'];

export const skillGroups = [
  { title: 'Web & interfaces', skills: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'JavaScript / TypeScript', 'UI / UX design'] },
  { title: 'AI & machine learning', skills: ['Machine learning', 'Deep learning', 'PyTorch', 'TensorFlow', 'scikit-learn', 'Generative AI'] },
  { title: 'Data & automation', skills: ['Python', 'Data analysis', 'Data engineering', 'pandas / NumPy', 'Workflow automation', 'LLM APIs'] },
  { title: 'Emerging systems', skills: ['Prompt engineering', 'RAG pipelines', 'AI agents', 'AI development'] },
];

/**
 * The 3D skill shelves. Each entry: [name, logo, colour, monogram, shelf label].
 *  - logo: a file name in assets/logos/ without .svg (Simple Icons slugs work:
 *    https://simpleicons.org), or null to extrude the monogram instead.
 *  - name should match a skill above, so clicking it opens the right group.
 *  - shelf label is optional; it defaults to the name.
 */
export const shelf = [
  ['React', 'react', '#61dafb'], ['Next.js', 'nextdotjs', '#f4f4f4'], ['Tailwind CSS', 'tailwindcss', '#38bdf8', null, 'Tailwind'], ['Node.js', 'nodedotjs', '#75b45f'],
  ['JavaScript', 'javascript', '#f7df1e'], ['TypeScript', 'typescript', '#3178c6'], ['Python', 'python', '#ffd343'], ['UI / UX design', null, '#d6a3ff', 'UI/UX', 'UI / UX'],
  ['PyTorch', 'pytorch', '#ee4c2c'], ['TensorFlow', 'tensorflow', '#ff9200'], ['scikit-learn', 'scikitlearn', '#f89939'], ['pandas', 'pandas', '#c7b3ff'],
  ['NumPy', 'numpy', '#4dabcf'], ['Machine learning', null, '#77daca', 'ML', 'ML'], ['Deep learning', null, '#ab95ff', 'DL'], ['Generative AI', null, '#e7a8df', 'AI', 'Gen AI'],
  ['Workflow automation', 'n8n', '#ea4b71', null, 'n8n'], ['Data analysis', null, '#5bd6e5', 'DATA', 'Analytics'], ['Data engineering', null, '#82c6ff', 'ETL', 'Data eng.'], ['LLM APIs', null, '#eec184', 'API'],
  ['Prompt engineering', null, '#b6c5ef', '>_', 'Prompts'], ['RAG pipelines', null, '#77e3b0', 'RAG', 'RAG'], ['AI agents', null, '#edae7d', 'AI', 'AI agents'], ['AI development', null, '#92baf5', 'DEV', 'AI dev.'],
];

export const certificates = [
  { title: 'Web Performance', issuer: 'Example Academy', image: 'placeholders/certificate-1.svg', verify: 'https://example.com/' },
  { title: 'Machine Learning', issuer: 'Example University', image: 'placeholders/certificate-2.svg' },
  { title: 'Accessible Design', issuer: 'Example Academy', image: 'placeholders/certificate-3.svg' },
  { title: 'Cloud Fundamentals', issuer: 'Example Institute', image: 'placeholders/certificate-4.svg' },
  { title: 'Data Engineering', issuer: 'Example University', image: 'placeholders/certificate-5.svg' },
];
