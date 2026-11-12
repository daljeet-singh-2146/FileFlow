import React from 'react';

interface FolderIconProps {
  type: 'desktop' | 'downloads' | 'documents' | 'pictures' | 'music' | 'videos' | 'generic';
  className?: string;
  size?: number;
}

export const FlowFolderIcon: React.FC<FolderIconProps> = ({ type, className = 'w-10 h-10', size = 40 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Back folder flap gradient */}
        <linearGradient id="flow-folder-back" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#25A4EC" />
          <stop offset="100%" stopColor="#0B79CB" />
        </linearGradient>

        {/* Front folder flap gradient */}
        <linearGradient id="flow-folder-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#53BEFA" />
          <stop offset="35%" stopColor="#32ACF5" />
          <stop offset="100%" stopColor="#0881D4" />
        </linearGradient>

        {/* Subtle top edge gloss */}
        <linearGradient id="flow-folder-sheen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
        </linearGradient>

        <filter id="flow-folder-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#00355E" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Back tab */}
      <path
        d="M6 18C6 15.2386 8.23858 13 11 13H24.5C26.8 13 28.8 14.8 29.8 17L31.2 20.2C31.8 21.3 33 22 34.2 22H53C55.7614 22 58 24.2386 58 27V47C58 49.7614 55.7614 52 53 52H11C8.23858 52 6 49.7614 6 47V18Z"
        fill="url(#flow-folder-back)"
      />

      {/* Front flap with rounded corners */}
      <path
        d="M6 24C6 21.2386 8.23858 19 11 19H53C55.7614 19 58 21.2386 58 24V47C58 49.7614 55.7614 52 53 52H11C8.23858 52 6 49.7614 6 47V24Z"
        fill="url(#flow-folder-front)"
        filter="url(#flow-folder-shadow)"
      />

      {/* Subtle top highlight */}
      <path
        d="M7 24C7 21.7909 8.79086 20 11 20H53C55.2091 20 57 21.7909 57 24V25H7V24Z"
        fill="url(#flow-folder-sheen)"
      />

      {/* Embossed Flow Glyph on folder */}
      {type === 'desktop' && (
        <g opacity="0.85">
          <rect x="23" y="27" width="18" height="13" rx="2" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
          <path d="M29 40V43M35 40V43M26 43H38" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}

      {type === 'downloads' && (
        <g opacity="0.85">
          <circle cx="32" cy="35" r="9.5" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
          <path d="M32 29V38M32 38L28 34M32 38L36 34" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {type === 'documents' && (
        <g opacity="0.85">
          <path d="M25 27C25 25.8954 25.8954 25 27 25H33L39 31V41C39 42.1046 38.1046 43 37 43H27C25.8954 43 25 42.1046 25 41V27Z" fill="#FFFFFF" fillOpacity="0.25" stroke="#FFFFFF" strokeWidth="1.8" />
          <path d="M33 25V31H39" stroke="#FFFFFF" strokeWidth="1.8" strokeLinejoin="round" />
          <line x1="28" y1="34" x2="36" y2="34" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="28" y1="38" x2="34" y2="38" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}

      {type === 'pictures' && (
        <g opacity="0.85">
          <rect x="22" y="27" width="20" height="15" rx="2" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
          <circle cx="27" cy="31.5" r="1.8" fill="#FFFFFF" />
          <path d="M23 39L29 33L34 37L37 34L41 39" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {type === 'music' && (
        <g opacity="0.85">
          <path d="M35 27V38.5C35 40 33.7 41.2 32 41.2C30.3 41.2 29 40 29 38.5C29 37 30.3 35.8 32 35.8C32.7 35.8 33.3 36 33.8 36.3V29.5L40 28V36.5C40 38 38.7 39.2 37 39.2C35.3 39.2 34 38 34 36.5C34 35 35.3 33.8 37 33.8C37.7 33.8 38.3 34 38.8 34.3V26.5L35 27Z" fill="#FFFFFF" />
        </g>
      )}

      {type === 'videos' && (
        <g opacity="0.85">
          <rect x="22" y="27" width="20" height="15" rx="2.5" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
          <path d="M29 31L36 34.5L29 38V31Z" fill="#FFFFFF" />
        </g>
      )}
    </svg>
  );
};
