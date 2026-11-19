export type TestimonialItem = {
  id: string
  quote: string
  name: string
  handle: string
  role: string
  company: string
  website: string
  profileUrl: string
  projectSlug?: string
  avatar?: { src: string; alt: string }
}

export const testimonials: TestimonialItem[] = [
  {
    id: '1',
    quote:
      'Miux Studio has been a game-changer for our brand. Their design systems and engineering velocity are unmatched.',
    name: 'Guillermo Rauch',
    handle: '@rauchg',
    role: 'CEO',
    company: 'Vercel',
    website: 'https://vercel.com',
    profileUrl: 'https://x.com/rauchg',
  },
  {
    id: '2',
    quote:
      'We saw a 3x lift in conversion within four weeks of launching the new digital platform.',
    name: 'Rika Shinoda',
    handle: '@rikashinoda',
    role: 'CEO',
    company: 'Kintsugi',
    website: 'https://kintsugi.com',
    profileUrl: 'https://x.com/rikashinoda',
  },
  {
    id: '3',
    quote:
      'Their team is highly strategic, and their clean development architecture truly streamlined our customer journey.',
    name: 'Reacher',
    handle: '@reacher',
    role: 'CEO',
    company: 'OdeaoLabs',
    website: 'https://odeaolabs.com',
    profileUrl: 'https://x.com/reacher',
  },
  {
    id: '4',
    quote:
      'Working with Miux Studio was effortless. Senior-level partners, zero fluff, and delivery that exceeded our expectations.',
    name: 'Johnathan Vance',
    handle: '@jvance',
    role: 'Founder',
    company: 'Labsbo',
    website: 'https://labsbo.com',
    profileUrl: 'https://x.com/jvance',
  },
  {
    id: '5',
    quote:
      'Their creative direction elevated our positioning across the UAE. We could not have asked for a better partner.',
    name: 'Steven Sunny',
    handle: '@stevensunny',
    role: 'CEO',
    company: 'Boxefi',
    website: 'https://boxefi.com',
    profileUrl: 'https://x.com/stevensunny',
  },
  {
    id: '6',
    quote:
      'Miux Studio has been a true partner. Their deep craftsmanship, high standards, and relentless commitment to measurable results set them completely apart.',
    name: 'Paul Brauch',
    handle: '@paulbrauch',
    role: 'CTO',
    company: 'Spectrum',
    website: 'https://spectrum.chat',
    profileUrl: 'https://x.com/paulbrauch',
  },
]
