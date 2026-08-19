import React from 'react';
import dsLogoWhite from '../../assets/ds_logo_white.png';

/**
 * Authentic DS (Dawn Sports) brand emblem matching the user-uploaded reference design for Admin portal.
 */
export default function DsLogo({ textClassName = "text-white" }) {
  return (
    <div className="flex items-center gap-2 select-none group" style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
      <img
        src={dsLogoWhite}
        alt="Dawn Sports Logo"
        className="h-7 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
        style={{
          height: '28px',
          maxHeight: '30px',
          width: 'auto',
          maxWidth: '50px',
          objectFit: 'contain',
          display: 'block',
          flexShrink: 0
        }}
      />
      <div className="flex flex-col leading-none" style={{ flexShrink: 0 }}>
        <span 
          className={`font-bold tracking-wider uppercase text-white whitespace-nowrap ${textClassName}`}
          style={{
            fontSize: '17px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: '#ffffff',
            lineHeight: 1,
            display: 'inline-block'
          }}
        >
          Dawn Sports
        </span>
      </div>
    </div>
  );
}
