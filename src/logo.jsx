export default function Logo({ size = 28, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 25h10V16h18"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="17" y="5" width="10" height="9" rx="1.5" fill={color} />
    </svg>
  )
}