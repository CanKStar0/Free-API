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
        {/* Gradients */}
        <linearGradient id="logoTopPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#e11d48" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#be123c" stopOpacity="0.85" />
        </linearGradient>

        <linearGradient id="logoMidPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e11d48" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#be123c" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#9e0a2b" stopOpacity="0.75" />
        </linearGradient>

        <linearGradient id="logoBotPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#be123c" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#9e0a2b" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#4c0519" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id="logoEdgeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="50%" stopColor="#ffe4e6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fda4af" stopOpacity="0.6" />
        </linearGradient>

        <linearGradient id="logoCircuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fecdd3" stopOpacity="0.75" />
        </linearGradient>

        {/* Filters */}
        <filter id="logoPlateShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#000000" floodOpacity="0.45" />
          <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#be123c" floodOpacity="0.35" />
        </filter>
        <filter id="logoNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ffffff" floodOpacity="0.8" />
        </filter>
      </defs>

      <g transform="translate(0, 10)">
        {/* BOTTOM LAYER */}
        <path d="M76 340 L76 368 L256 458 L256 430 Z" fill="#4c0519" opacity="0.95" />
        <path d="M436 340 L436 368 L256 458 L256 430 Z" fill="#330310" opacity="0.95" />
        <polygon points="256,250 436,340 256,430 76,340" fill="url(#logoBotPlateGrad)" filter="url(#logoPlateShadow)" />
        <polygon points="256,250 436,340 256,430 76,340" fill="none" stroke="url(#logoEdgeGlow)" strokeWidth="4" strokeLinejoin="round" opacity="0.65" />
        <path d="M76 340 L76 368 L256 458 L436 368 L436 340" fill="none" stroke="url(#logoEdgeGlow)" strokeWidth="3.5" strokeLinejoin="round" opacity="0.5" />

        {/* MIDDLE LAYER */}
        <path d="M76 225 L76 247 L256 337 L256 315 Z" fill="#881337" opacity="0.9" />
        <path d="M436 225 L436 247 L256 337 L256 315 Z" fill="#5b0a1f" opacity="0.9" />
        <polygon points="256,135 436,225 256,315 76,225" fill="url(#logoMidPlateGrad)" filter="url(#logoPlateShadow)" />
        <polygon points="256,135 436,225 256,315 76,225" fill="none" stroke="url(#logoEdgeGlow)" strokeWidth="5" strokeLinejoin="round" opacity="0.8" />
        <path d="M76 225 L76 247 L256 337 L436 247 L436 225" fill="none" stroke="url(#logoEdgeGlow)" strokeWidth="4" strokeLinejoin="round" opacity="0.6" />
        
        {/* Middle Data Paths */}
        <path d="M166 225 L216 250 L216 275" fill="none" stroke="url(#logoCircuitGrad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
        <circle cx="216" cy="275" r="6" fill="#ffffff" filter="url(#logoNeonGlow)" />
        <path d="M346 225 L296 250 L296 275" fill="none" stroke="url(#logoCircuitGrad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
        <circle cx="296" cy="275" r="6" fill="#ffffff" filter="url(#logoNeonGlow)" />

        {/* TOP LAYER */}
        <path d="M76 110 L76 130 L256 220 L256 200 Z" fill="#9e0a2b" opacity="0.95" />
        <path d="M436 110 L436 130 L256 220 L256 200 Z" fill="#75061e" opacity="0.95" />
        <polygon points="256,20 436,110 256,200 76,110" fill="url(#logoTopPlateGrad)" filter="url(#logoPlateShadow)" />
        <polygon points="256,20 436,110 256,200 76,110" fill="none" stroke="url(#logoEdgeGlow)" strokeWidth="6" strokeLinejoin="round" />
        <path d="M76 110 L76 130 L256 220 L436 130 L436 110" fill="none" stroke="url(#logoEdgeGlow)" strokeWidth="4.5" strokeLinejoin="round" opacity="0.8" />

        {/* Top Plate Circuit Nodes & API Data Streams */}
        <g filter="url(#logoNeonGlow)">
          <path d="M150 110 L195 132 L230 115 L230 92" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="150" cy="110" r="7" fill="#ffffff" />
          <circle cx="230" cy="92" r="7" fill="#ffffff" />

          <path d="M362 110 L317 132 L282 115 L282 92" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="362" cy="110" r="7" fill="#ffffff" />
          <circle cx="282" cy="92" r="7" fill="#ffffff" />

          <circle cx="256" cy="110" r="14" fill="#ffffff" />
          <circle cx="256" cy="110" r="7" fill="#be123c" />
        </g>
      </g>
    </svg>
  );
}
