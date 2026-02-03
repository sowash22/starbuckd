import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-black text-neutral-200 dark:text-neutral-800 leading-none mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-neutral-100 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go Home
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>

        </div>
      </div>
    </div>
  )
}
