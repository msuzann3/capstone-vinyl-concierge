import React from "react";

interface LogoProps {
  className?: string;
  size?: number | string;
}

/**
 * Brandmark: The circular vinyl disk with Curate Red soundwaves 
 * and hand-drawn "CURATE" logotype in Bone Cream.
 */
export const Brandmark: React.FC<LogoProps> = ({ className = "", size = "100%" }) => {
  return (
    <svg
      id="curate-brandmark"
      viewBox="0 0 500 500"
      className={className}
      style={{ width: size, height: size }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vinyl Disk Base (Vinyl Black #1D1D1B) */}
      <circle cx="250" cy="250" r="235" fill="#1D1D1B" />
      
      {/* Subtle Vinyl Grooves */}
      <circle cx="250" cy="250" r="215" fill="none" stroke="#2D2D2A" strokeWidth="2" opacity="0.4" />
      <circle cx="250" cy="250" r="195" fill="none" stroke="#2D2D2A" strokeWidth="1.5" opacity="0.4" />
      <circle cx="250" cy="250" r="175" fill="none" stroke="#2D2D2A" strokeWidth="1" opacity="0.4" />

      {/* Sound Waves / Arcs (Curate Red #DB1D1B) */}
      {/* Top Waves */}
      <path
        d="M 140 100 A 180 180 0 0 1 360 100"
        fill="none"
        stroke="#DB1D1B"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M 175 75 A 210 210 0 0 1 325 75"
        fill="none"
        stroke="#DB1D1B"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Bottom Waves */}
      <path
        d="M 140 400 A 180 180 0 0 0 360 400"
        fill="none"
        stroke="#DB1D1B"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M 175 425 A 210 210 0 0 0 325 425"
        fill="none"
        stroke="#DB1D1B"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Custom Hand-Drawn "CURATE" Text in the center (Bone Cream #F4EFE3) */}
      <g stroke="#F4EFE3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Letter C: Sweeping brush stroke, slightly organic */}
        <path
          d="M 135 200 C 110 205, 80 230, 90 270 C 97 305, 125 320, 142 308"
          strokeWidth="18"
        />
        
        {/* Letter U (lowercase as requested): Lower curve, slightly dropped */}
        <path
          d="M 162 250 L 162 284 C 162 298, 184 298, 184 284 L 184 250"
          strokeWidth="15"
        />
        {/* Lowercase u small leg/serif */}
        <path
          d="M 184 275 L 184 294"
          strokeWidth="15"
        />

        {/* Letter R: Bold vertical stroke and quirky loop */}
        <path
          d="M 215 190 L 210 320"
          strokeWidth="18"
        />
        <path
          d="M 215 190 C 245 190, 275 200, 270 235 C 265 265, 230 268, 212 268"
          strokeWidth="16"
        />
        <path
          d="M 240 268 C 248 290, 255 310, 268 322"
          strokeWidth="17"
        />

        {/* Letter A: High joint, bold brush joints */}
        <path
          d="M 315 192 L 290 315"
          strokeWidth="17"
        />
        <path
          d="M 315 192 L 340 315"
          strokeWidth="17"
        />
        <path
          d="M 300 265 L 332 265"
          strokeWidth="14"
        />

        {/* Letter T: Flat organic top bar and heavy central stem */}
        <path
          d="M 345 202 L 415 195"
          strokeWidth="17"
        />
        <path
          d="M 380 198 L 380 316"
          strokeWidth="18"
        />

        {/* Letter E: Heavy hand-drawn three bar structure */}
        <path
          d="M 432 195 L 432 318"
          strokeWidth="17"
        />
        <path
          d="M 432 195 L 485 195"
          strokeWidth="15"
        />
        <path
          d="M 432 258 L 472 258"
          strokeWidth="14"
        />
        <path
          d="M 432 318 L 480 318"
          strokeWidth="16"
        />
      </g>
    </svg>
  );
};

/**
 * WordmarkRed: The red hand-drawn brand wordmark 'CURATE'
 */
export const WordmarkRed: React.FC<LogoProps> = ({ className = "", size = "100%" }) => {
  return (
    <svg
      id="curate-wordmark-red"
      viewBox="0 0 450 180"
      className={className}
      style={{ width: size, height: size }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#DB1D1B" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Letter C */}
        <path
          d="M 65 40 C 45 44, 20 64, 28 98 C 34 128, 58 140, 72 130"
          strokeWidth="16"
        />
        
        {/* Letter U (lowercase curve) */}
        <path
          d="M 90 85 L 90 114 C 90 126, 108 126, 108 114 L 108 85"
          strokeWidth="14"
        />
        <path
          d="M 108 105 L 108 122"
          strokeWidth="14"
        />

        {/* Letter R */}
        <path
          d="M 135 32 L 131 142"
          strokeWidth="16"
        />
        <path
          d="M 135 32 C 160 32, 185 41, 181 71 C 177 96, 148 98, 133 98"
          strokeWidth="14"
        />
        <path
          d="M 155 98 C 162 116, 168 132, 178 142"
          strokeWidth="15"
        />

        {/* Letter A */}
        <path
          d="M 218 34 L 197 138"
          strokeWidth="15"
        />
        <path
          d="M 218 34 L 239 138"
          strokeWidth="15"
        />
        <path
          d="M 205 96 L 231 96"
          strokeWidth="12"
        />

        {/* Letter T */}
        <path
          d="M 245 44 L 305 38"
          strokeWidth="15"
        />
        <path
          d="M 275 41 L 275 140"
          strokeWidth="16"
        />

        {/* Letter E */}
        <path
          d="M 320 38 L 320 141"
          strokeWidth="15"
        />
        <path
          d="M 320 38 L 365 38"
          strokeWidth="13"
        />
        <path
          d="M 320 92 L 354 92"
          strokeWidth="12"
        />
        <path
          d="M 320 141 L 360 141"
          strokeWidth="14"
        />
      </g>
    </svg>
  );
};

/**
 * CircleLockupWithTagline: The circular disk brandmark with curved 
 * "RECORDS AND BOOKS" surrounding the bottom in clean, classic typeface.
 */
export const CircleLockupWithTagline: React.FC<LogoProps> = ({ className = "", size = "100%" }) => {
  return (
    <div className={`relative flex flex-col items-center ${className}`} style={{ width: size }}>
      <Brandmark size="75%" />
      {/* Curved SVG Text Wrapper */}
      <svg viewBox="0 0 500 120" className="w-full mt-2" xmlns="http://www.w3.org/2000/svg">
        <path id="tagline-curve" d="M 50 10 A 210 210 0 0 0 450 10" fill="none" />
        <text className="font-mono text-xl tracking-[0.2em] font-bold" fill="#1D1D1B" textAnchor="middle">
          <textPath href="#tagline-curve" startOffset="50%">
            RECORDS AND BOOKS
          </textPath>
        </text>
      </svg>
    </div>
  );
};
