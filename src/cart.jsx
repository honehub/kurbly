export default function Cart({ color, height = 62 }) {
  return (
    <svg
      height={height}
      viewBox="0 0 44 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 7h20" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
      <rect x="4" y="9" width="36" height="8.5" rx="3" fill={color} />
      <path d="M7.5 19.5h29L33.2 47H10.8z" fill={color} opacity="0.82" />
      <path d="M16 24v18M22 24v18M28 24v18" stroke="#0F172A" strokeWidth="1.2" opacity="0.18" />
      <circle cx="14" cy="51" r="4.5" fill={color} opacity="0.5" />
      <circle cx="30" cy="51" r="4.5" fill={color} opacity="0.5" />
    </svg>
  )
}