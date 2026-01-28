export type Build = {
  title: string
  description: string
  href: string
  github?: string
}

export const builds: Build[] = [
  {
    title: 'name my pet',
    description: 'an AI pet naming website.',
    href: 'https://www.namemypet.app',
    github: 'https://github.com/marannan/name-it',
  },
  {
    title: 'gift garden',
    description: 'an AI gift generator website.',
    href: 'https://gift-gen.vercel.app',
    github: 'https://github.com/marannan/gift-gen',
  },
]