/**
 * Public site constants. These were previously the `env` block in next.config.mjs, which Next
 * inlined as process.env.* at build time. They are public values, not secrets, so a plain module
 * is simpler and type-safe.
 */
export const site = {
  origin: 'https://ax-h.com',
  title: 'Alex Haslehurst',
  description: 'Alex Haslehurst`s Personal Website',
  author: 'Alex Haslehurst',
} as const

export const contact = {
  email: 'alex.haslehurst@gmail.com',
  linkedin: 'ahaslehurst',
  website: 'ax-h.com',
  github: 'axle-h',
  googleMaps: 'a12DCrhaHz9XdY2n8',
  location: 'Sheffield, UK',
} as const
