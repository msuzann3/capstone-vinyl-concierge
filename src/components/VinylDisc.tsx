import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Recommendation } from "../types";
import { Star, Award, BadgeCheck } from "lucide-react";

interface VinylDiscProps {
  key?: any;
  album: Recommendation;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export default function VinylDisc({ album, isSelected, onClick, index }: VinylDiscProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Generate a distinct aesthetic cover color based on title hash or index matching the Curate palette
  const getCoverGradient = (idx: number) => {
    const gradients = [
      "from-curate-red via-red-950 to-stone-900",
      "from-stone-900 via-stone-800 to-amber-950",
      "from-curate-red via-indigo-950 to-stone-900",
      "from-deep-rust via-stone-850 to-zinc-950",
      "from-stone-900 via-stone-950 to-stone-900",
    ];
    return gradients[idx % gradients.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-300 select-none pb-4`}
    >
      {/* Container holding sleeve and record */}
      <div className="relative w-full aspect-square flex items-center justify-start pr-12 overflow-visible">
        
        {/* BLACK VINYL RECORD DISC - SLIDES OUT OF SLEEVE */}
        <motion.div
          animate={{
            x: isSelected || isHovered ? 16 : 4,
            rotate: isSelected ? 360 : isHovered ? 45 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 70,
            damping: 14,
            rotate: isSelected ? { repeat: Infinity, duration: 10, ease: "linear" } : { duration: 0.8 }
          }}
          className="absolute right-0 top-2 bottom-2 aspect-square rounded-full bg-stone-950 shadow-2xl flex items-center justify-center border-4 border-stone-800"
          style={{ zIndex: 0 }}
        >
          {/* Vinyl grooves simulation */}
          <div className="absolute inset-2 rounded-full border border-stone-800 opacity-60"></div>
          <div className="absolute inset-4 rounded-full border border-stone-800 opacity-40"></div>
          <div className="absolute inset-7 rounded-full border border-stone-800 opacity-60"></div>
          <div className="absolute inset-10 rounded-full border border-stone-800 opacity-35"></div>
          <div className="absolute inset-14 rounded-full border border-stone-800 opacity-50"></div>
          
          {/* Vinyl center label (Sleeve Mustard / Curate Red Accent) */}
          <div className="w-1/3 aspect-square rounded-full bg-curate-red border-2 border-sleeve-mustard flex flex-col items-center justify-center p-1 text-center overflow-hidden shadow-inner font-mono">
            <div className="text-[7px] text-sleeve-mustard font-mono leading-none tracking-widest uppercase">
              Curate Staff
            </div>
            <div className="text-[5px] text-white font-sans font-bold leading-tight truncate max-w-full px-1 py-1">
              {album.title}
            </div>
            {/* Center Spindle Hole */}
            <div className="w-2 h-2 rounded-full bg-bone-cream border border-stone-800"></div>
          </div>
        </motion.div>

        {/* CARDBOARD SLEEVE (Curate Red & Vintage theme) */}
        <div
          className={`relative z-10 w-full aspect-square rounded bg-gradient-to-br ${getCoverGradient(index)} shadow-xl border border-stone-800 overflow-hidden flex flex-col justify-between p-5 transition-shadow duration-300 ${
            isSelected ? "shadow-sleeve-mustard/40 border-sleeve-mustard ring-2 ring-sleeve-mustard" : "hover:shadow-stone-950/50"
          }`}
        >
          {/* Vintage paper sleeve texture overlay */}
          <div className="absolute inset-0 bg-noise opacity-15 mix-blend-overlay pointer-events-none"></div>

          {/* Record Label Info / Stamp */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-stone-300 text-[10px] font-mono tracking-widest uppercase">Side A</span>
              <span className="text-[9px] text-sleeve-mustard font-mono uppercase bg-curate-red/80 px-1.5 py-0.5 mt-1 rounded border border-sleeve-mustard/30">
                12" LP Stereo
              </span>
            </div>
            
            {/* Classification Badge (Familiar Classic vs Discovery) */}
            <span className={`text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${
              album.classification === "Familiar Classic" 
                ? "bg-stone-900/80 text-white border-stone-700" 
                : "bg-sleeve-mustard text-vinyl-black border-sleeve-mustard/50 font-bold"
            }`}>
              {album.classification === "Familiar Classic" ? <Award className="w-2.5 h-2.5" /> : <Star className="w-2.5 h-2.5 fill-curate-red text-curate-red" />}
              {album.classification}
            </span>
          </div>

          {/* Album Title and Artist */}
          <div className="mt-auto">
            <h3 className="font-display text-white text-lg md:text-xl leading-tight tracking-tight uppercase line-clamp-3">
              {album.title}
            </h3>
            <p className="font-editorial text-stone-200 text-base md:text-lg italic tracking-wide mt-1 line-clamp-2">
              {album.artist}
            </p>
          </div>

          {/* Stylized vinyl groove graphics at bottom card */}
          <div className="border-t border-white/10 pt-3 mt-3 flex justify-between items-center">
            <span className="text-xs text-stone-300 font-mono tracking-wide max-w-[72%] line-clamp-2">
              {album.aestheticVibe}
            </span>
            <span className="text-xs text-sleeve-mustard font-mono">
              {album.releaseYear}
            </span>
          </div>
        </div>

      </div>

      {/* Under-album shelf note */}
      <div className="mt-3 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-sm leading-snug text-stone-900 line-clamp-3">{album.title}</h4>
          <p className="mt-0.5 text-sm leading-snug text-stone-600 font-editorial italic line-clamp-2">{album.artist}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-2 py-1 text-[10px] font-mono uppercase tracking-wider ${
            isSelected
              ? "bg-sleeve-mustard text-vinyl-black border-sleeve-mustard font-bold"
              : "bg-bone-cream text-stone-600 border-stone-300"
          }`}
        >
          <BadgeCheck className="w-3 h-3 text-curate-red" />
          Staff Pick
        </span>
      </div>
    </motion.div>
  );
}
