import React from 'react';

/**
 * High-fidelity DS (DAAN Sports) brand emblem matching the reference design.
 * Features bold italicized letterforms with sharp sporty cuts and an aerodynamic underline swoosh.
 */
export default function DsLogo({ className = "h-9 w-auto", textClassName = "text-white" }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg
        viewBox="0 0 160 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: 'block', overflow: 'visible' }}
        aria-label="DAAN Sports DS Logo"
      >
        <defs>
          <linearGradient id="dsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#EDEDED" />
            <stop offset="100%" stopColor="#D4D4D8" />
          </linearGradient>
          <filter id="dsShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        <g filter="url(#dsShadow)">
          {/* Main Stylized Italic DS Glyph */}
          <path
            d="M 12 12 
               L 52 12 
               C 68 12, 78 20, 74 36 
               C 70 50, 58 56, 42 56 
               L 18 56 
               L 10 56 
               L 12 12 Z 
               M 29 23 
               L 25 45 
               L 39 45 
               C 47 45, 53 41, 55 34 
               C 57 27, 53 23, 45 23 
               L 29 23 Z"
            fill="url(#dsGradient)"
            transform="skewX(-16)"
          />

          {/* S glyph interwoven */}
          <path
            d="M 70 18 
               L 115 18 
               L 112 28 
               L 85 28 
               C 80 28, 77 30, 76 33 
               C 75 36, 78 38, 84 39 
               L 102 42 
               C 114 44, 118 49, 116 55 
               C 113 63, 102 67, 85 67 
               L 60 67 
               L 63 56 
               L 92 56 
               C 98 56, 101 54, 102 51 
               C 103 48, 100 46, 94 45 
               L 76 42 
               C 64 40, 60 35, 62 29 
               C 64 22, 73 18, 85 18 Z"
            fill="url(#dsGradient)"
            transform="skewX(-16)"
          />

          {/* Aerodynamic Speed Swoosh Underneath */}
          <path
            d="M 6 62 
               C 35 73, 90 71, 126 53 
               C 105 60, 58 63, 22 56 
               Z"
            fill="url(#dsGradient)"
            opacity="0.95"
            transform="skewX(-16)"
          />
        </g>
      </svg>

      {/* Brand Wordmark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span className={`font-display font-black text-2xl tracking-tighter uppercase ${textClassName}`}>
            DAAN
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#dc2626]">
            SPORTS
          </span>
        </div>
      </div>
    </div>
  );
}
