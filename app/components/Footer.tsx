export default function Footer() {
  return (
    <footer className="mt-auto py-12 px-6 border-t border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-lg">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
            © {new Date().getFullYear()} Starbuck&apos;d • Built with Chaos
          </p>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">Identity Crisis</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
