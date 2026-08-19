import React from 'react';
import dsLogoWhite from '../Assets/ds_logo_white.png';
import dsLogoDark from '../Assets/ds_logo_dark.png';

/**
 * Authentic DS (Dawn Sports) brand emblem matching the user-uploaded reference design.
 * Features a compact, clean logo icon alongside "Dawn Sports" in clean white typography.
 */
export default function DsLogo({ textClassName = "text-white", theme = "light-on-dark" }) {
  const logoSrc = theme === "dark-on-light" ? dsLogoDark : dsLogoWhite;

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 select-none group" style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
      {/* Small Compact DS Brand Emblem */}
      <img
        src={logoSrc}
        alt="Dawn Sports Logo"
        className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
        style={{
          height: '32px',
          maxHeight: '34px',
          width: 'auto',
          maxWidth: '56px',
          objectFit: 'contain',
          display: 'block',
          flexShrink: 0
        }}
      />
      
      {/* DAAN Sports in Clean White Font */}
      <div className="flex flex-col leading-none" style={{ flexShrink: 0 }}>
        <span 
          className={`font-display font-black tracking-wider uppercase text-white whitespace-nowrap ${textClassName}`}
          style={{
            fontSize: 'clamp(15px, 2vw, 20px)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            color: '#ffffff',
            lineHeight: 1,
            display: 'inline-block'
          }}
        >
          DAAN SPORTS
        </span>
      </div>
    </div>
  );
}
