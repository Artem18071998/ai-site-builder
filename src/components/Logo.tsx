export default function Logo({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#logo-grad)" />
      <rect x="14" y="16" width="30" height="32" rx="5" fill="#ffffff" />
      <path d="M14 21a5 5 0 0 1 5-5h20a5 5 0 0 1 5 5v3H14z" fill="#c7d2fe" />
      <rect x="19" y="30" width="20" height="3" rx="1.5" fill="#6366f1" />
      <rect x="19" y="37" width="14" height="3" rx="1.5" fill="#c7d2fe" />
      <path d="M47 12l2.2 5.8L55 20l-5.8 2.2L47 28l-2.2-5.8L39 20l5.8-2.2z" fill="#fde68a" />
    </svg>
  )
}