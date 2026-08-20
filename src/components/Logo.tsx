'use client';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = 'w-8 h-8', size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Background Gradient */}
        <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#be123c" />
          <stop offset="45%" stopColor="#9e0a2b" />
          <stop offset="100%" stopColor="#4c0519" />
        </linearGradient>

        {/* Top Glow */}
        <linearGradient id="logoGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Accent Gradient */}
        <linearGradient id="logoAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffe4e6" />
        </linearGradient>

        {/* Shadow */}
        <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#000000" floodOpacity="0.4" />
        </filter>
        <filter id="logoLayerGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Squircle Base */}
      <rect
        x="24"
        y="24"
        width="464"
        height="464"
        rx="124"
        ry="124"
        fill="url(#logoBgGrad)"
        filter="url(#logoShadow)"
      />

      {/* Inner Border Highlight */}
      <rect
        x="25"
        y="25"
        width="462"
        height="462"
        rx="123"
        ry="123"
        fill="none"
        stroke="rgba(255, 255, 255, 0.22)"
        strokeWidth="4"
      />

      {/* Top Sheen */}
      <path
        d="M 24 148 C 24 79 79 24 148 24 L 364 24 C 433 24 488 79 488 148 L 488 240 C 350 210 160 210 24 240 Z"
        fill="url(#logoGlowGrad)"
      />

      {/* API Layers Group */}
      <g filter="url(#logoLayerGlow)" transform="translate(0, 10)">
        {/* Bottom Layer */}
        <path
          d="M120 326 L256 392 L392 326 L360 308 L256 358 L152 308 Z"
          fill="#ffffff"
          fillOpacity="0.38"
        />

        {/* Middle Layer */}
        <path
          d="M120 252 L256 318 L392 252 L360 234 L256 284 L152 234 Z"
          fill="#ffffff"
          fillOpacity="0.7"
        />

        {/* Top Plate */}
        <polygon points="256,120 392,184 256,248 120,184" fill="url(#logoAccentGrad)" />

        {/* Center Node */}
        <circle cx="256" cy="184" r="24" fill="#be123c" />
        <circle cx="256" cy="184" r="13" fill="#ffffff" />

        {/* Code Brackets */}
        <path
          d="M198 175 L180 184 L198 193"
          fill="none"
          stroke="#9e0a2b"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M314 175 L332 184 L314 193"
          fill="none"
          stroke="#9e0a2b"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
