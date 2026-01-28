import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About Ashok Marannan',
}

export default function About() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 font-mono">
          About
        </h1>

        <div className="space-y-6 text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-mono">
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            I'm curious about everything.
          </p>
          
          <p>
            That curiosity drives everything I do. Whether it's understanding how things work, exploring new technologies, or diving deep into ideas that catch my attention—I can't help but want to know more.
          </p>
          
          <p>
            This site is where I share that curiosity. You'll find thoughts on engineering, AI, building things, and whatever else has captured my attention. Sometimes these are polished essays, sometimes they're rough notes. All of them come from a place of genuine interest and exploration.
          </p>

          <p>
            If you're curious too, or if something I've written resonates with you, feel free to reach out. I'm always interested in conversations with fellow explorers.
          </p>

          <div className="mt-12 pt-8 border-t border-dotted border-neutral-300 dark:border-neutral-700">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Currently Exploring
            </h2>
            <ul className="list-none space-y-2 pl-0">
              <li className="flex items-start">
                <span className="mr-3 text-neutral-400 dark:text-neutral-600">→</span>
                <span>AI and machine learning systems</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-neutral-400 dark:text-neutral-600">→</span>
                <span>Building tools and products</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-neutral-400 dark:text-neutral-600">→</span>
                <span>How technology shapes how we think and work</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-neutral-400 dark:text-neutral-600">→</span>
                <span>Whatever catches my attention next</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
