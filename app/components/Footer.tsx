export default function Footer() {
  return (
    <footer className="border-t border-dotted border-neutral-300 dark:border-neutral-700 mt-auto">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <p className="text-sm text-neutral-500 dark:text-neutral-500 text-center">
          © {new Date().getFullYear()} Ashok Marannan
        </p>
      </div>
    </footer>
  )
}
