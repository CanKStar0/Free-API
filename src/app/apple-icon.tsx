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
          background: 'linear-gradient(135deg, #be123c 0%, #9e0a2b 50%, #4c0519 100%)',
          borderRadius: '40px',
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
          <polygon points="256,120 392,184 256,248 120,184" fill="#ffffff" />
          {/* Node */}
          <circle cx="256" cy="184" r="24" fill="#be123c" />
          <circle cx="256" cy="184" r="13" fill="#ffffff" />
          {/* Brackets */}
          <path
            d="M198 175 L180 184 L198 193"
            stroke="#9e0a2b"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M314 175 L332 184 L314 193"
            stroke="#9e0a2b"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
