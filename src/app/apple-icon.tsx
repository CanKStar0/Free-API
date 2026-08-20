import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
        }}
      >
        <svg
          width="135"
          height="135"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bottom Layer */}
          <path d="M76 340 L76 368 L256 458 L256 430 Z" fill="#4c0519" />
          <path d="M436 340 L436 368 L256 458 L256 430 Z" fill="#330310" />
          <polygon points="256,250 436,340 256,430 76,340" fill="#9e0a2b" />
          <polygon points="256,250 436,340 256,430 76,340" stroke="#ffffff" strokeWidth="6" />

          {/* Middle Layer */}
          <path d="M76 225 L76 247 L256 337 L256 315 Z" fill="#881337" />
          <path d="M436 225 L436 247 L256 337 L256 315 Z" fill="#5b0a1f" />
          <polygon points="256,135 436,225 256,315 76,225" fill="#be123c" />
          <polygon points="256,135 436,225 256,315 76,225" stroke="#ffffff" strokeWidth="7" />

          {/* Top Layer */}
          <path d="M76 110 L76 130 L256 220 L256 200 Z" fill="#be123c" />
          <path d="M436 110 L436 130 L256 220 L256 200 Z" fill="#75061e" />
          <polygon points="256,20 436,110 256,200 76,110" fill="#e11d48" />
          <polygon points="256,20 436,110 256,200 76,110" stroke="#ffffff" strokeWidth="8" />

          {/* Circuits */}
          <path d="M150 110 L195 132 L230 115 L230 92" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="150" cy="110" r="10" fill="#ffffff" />
          <circle cx="230" cy="92" r="10" fill="#ffffff" />

          <path d="M362 110 L317 132 L282 115 L282 92" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="362" cy="110" r="10" fill="#ffffff" />
          <circle cx="282" cy="92" r="10" fill="#ffffff" />

          <circle cx="256" cy="110" r="16" fill="#ffffff" />
          <circle cx="256" cy="110" r="8" fill="#be123c" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
