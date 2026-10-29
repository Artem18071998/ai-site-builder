export default function Logo({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" style={{ fill: 'var(--ui-accent, #4f46e5)' }} />
      <rect x="14" y="16" width="30" height="32" rx="5" fill="#ffffff" />
      <path d="M14 21a5 5 0 0 1 5-5h20a5 5 0 0 1 5 5v3H14z" fill="#d9dde3" />
      <rect x="19" y="30" width="20" height="3" rx="1.5" fill="#23262b" />
      <rect x="19" y="37" width="14" height="3" rx="1.5" fill="#c4c9d1" />
      <path d="M47 12l2.2 5.8L55 20l-5.8 2.2L47 28l-2.2-5.8L39 20l5.8-2.2z" fill="#ffffff" />
    </svg>
  )
}