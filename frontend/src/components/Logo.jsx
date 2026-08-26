const Logo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#7C5CFC" />
    <path
      d="M10 10H22L10 22H22"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="25" cy="7" r="2.5" fill="#F5A623" />
  </svg>
);

export default Logo;