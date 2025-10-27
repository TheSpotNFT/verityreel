// scripts/seed.cjs
const fs = require('fs');
const path = require('path');

const NOW = Date.now();

// simple helpers
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const range = (n) => Array.from({ length: n }, (_, i) => i);

const handles = [
  'wildframes', 'roadworks', 'fieldnotes', 'rivertownreport',
  'makerjay', 'nurseonshift', 'marinesci', 'ranger_ella',
  'farmdiary', 'metalworks', 'citybeats', 'weatherwatch',
  'trailcam', 'gridinspector', 'civiclens', 'seawatch',
  'urbangardener', 'timbercraft', 'mountainpost', 'riverscout',
  'studioglass', 'freightyard', 'roofline', 'coastalcleanup'
];

const titles = [
  'Alpine Morning', 'Harbor Shift', 'Under the Bridge', 'Rain on Steel',
  'Night Watch', 'Signals at Dawn', 'The Burn Scar', 'Storm Line',
  'Fieldwork Friday', 'Shop Sparks', 'River Repair', 'Breakwater',
  'Civic Light', 'Trail Readings', 'Bridge Deck', 'Grid Rewire',
  'Urban Canopy', 'Timber Joinery', 'Ridge Weather', 'Estuary Count',
  'Coast Sweep', 'Yard Moves'
];

const blurb = [
  'Real work, real outcomes.',
  'Thin air. Cold light.',
  'No drones. No tricks.',
  'Notes from the field.',
  'Crew staged safely.',
  'Measured, not guessed.',
  'Footing set at first light.',
  'Steel meets storm.',
  'Walked the whole line.',
  'Tide was higher than forecast.'
];

const longText = [
  'We documented conditions across the site with photos and recorded locations for each observation. No AI, no composites—just the lens and the work in front of it.',
  'Materials: precast, compacted base, and hand tools. The sequence matters more than speed. Keeping access open was the constraint.',
  'Elevation and weather shaped everything today. Snow carried footprints like notes. The story was already there; we only had to read it.',
  'We logged wind, swell, and surface temps at intervals. Data beats debate. Sharing here so anyone can check the same shoreline.',
  'Power was cut, crew grounded the line. Every step was called out and repeated. The fix holds because the process holds.'
];

const unsplash = (id) =>
  `https://images.unsplash.com/${id}?w=2000&q=90&auto=format`;

const images = [
  // nature / landscapes
  'photo-1501785888041-af3ef285b470', // mountains
  'photo-1477414348463-c0eb7f1359b6', // ridge
  'photo-1500530855697-b586d89ba3ee', // forest
  'photo-1507525428034-b723cf961d3e', // ocean
  // work / infrastructure
  'photo-1541888946425-d81bb19240f5', // construction
  'photo-1518779578993-ec3579fee39f', // welding
  'photo-1504306662306-1f10d49d44c6', // rebar
  'photo-1520607162513-77705c0f0d4a', // roadway
  // human / stories
  'photo-1506794778202-cad84cf45f1d', // person portrait
  'photo-1520975922284-9bcd70d08297', // worker
  'photo-1529070538774-1843cb3265df', // tools
  'photo-1504198453319-5ce911bafcde'  // hands
];

const layouts = ['cover', 'wrap-left', 'wrap-right', 'split-50', 'grid-2', 'text'];

function makePage(layout) {
  if (layout === 'text') {
    return {
      layout,
      text: pick(longText)
    };
  }
  if (layout === 'grid-2') {
    const a = pick(images), b = pick(images);
    return {
      layout,
      images: [unsplash(a), unsplash(b)],
      text: pick(longText)
    };
  }
  if (layout === 'split-50') {
    return {
      layout,
      image: unsplash(pick(images)),
      text: pick(longText),
      caption: pick(blurb)
    };
  }
  if (layout === 'wrap-left' || layout === 'wrap-right') {
    return {
      layout,
      image: unsplash(pick(images)),
      text: `${pick(blurb)} ${pick(longText)}`
    };
  }
  // cover
  return {
    layout: 'cover',
    image: unsplash(pick(images)),
    caption: pick(blurb)
  };
}

function makePost(idx) {
  // vary page count: cycle 1..10
  const pageCount = (idx % 10) + 1;
  // start with a strong cover then mix
  const pages = [
    makePage('cover'),
    ...range(pageCount - 1).map(() => makePage(pick(layouts)))
  ];

  return {
    id: `p-seed-${idx + 1}`,
    author: { handle: pick(handles), role: 'poster' },
    title: pick(titles),
    createdAt: new Date(NOW - idx * 60 * 60 * 1000).toISOString(),
    pages
  };
}

// Keep your original two demo posts, then add 20 more
const base = [
  {
    id: 'p-nature-1',
    author: { handle: 'wildframes', role: 'poster' },
    title: 'Alpine Morning',
    createdAt: '2025-10-01T10:00:00Z',
    pages: [
      {
        layout: 'cover',
        image: unsplash('photo-1501785888041-af3ef285b470'),
        caption: 'Dawn over the ridge'
      },
      {
        layout: 'wrap-right',
        image: unsplash('photo-1477414348463-c0eb7f1359b6'),
        text: 'Thin air. Cold light. The ridge wakes first…'
      }
    ]
  },
  {
    id: 'p-work-1',
    author: { handle: 'roadworks', role: 'poster' },
    title: 'Storm Catch Basin Renewal',
    createdAt: '2025-10-02T09:00:00Z',
    pages: [
      {
        layout: 'split-50',
        image: unsplash('photo-1541888946425-d81bb19240f5'),
        text: 'Real work, real outcomes…'
      },
      {
        layout: 'text',
        text: 'Materials: precast basin, new grate, compacted sub-base. Lessons: staging beats speed, every time.'
      }
    ]
  }
];

const extra = range(20).map((i) => makePost(i));

const out = { posts: [...extra, ...base] }; // newest first

const file = path.join(process.cwd(), 'data', 'posts.json');
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(out, null, 2), 'utf-8');

console.log(`Seeded ${out.posts.length} posts → ${file}`);
