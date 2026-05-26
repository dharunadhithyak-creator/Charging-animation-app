import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AnimationProps {
  batteryLevel: number;
  isPluggedIn: boolean;
  accentColor: string;
  speedMultiplier: number;
}

interface PixelSparkle {
  id: number;
  x: number;
  delayY: number;
  text: string;
}

export default function RetroPixelAnimation({
  batteryLevel,
  isPluggedIn,
  accentColor,
  speedMultiplier,
}: AnimationProps) {
  const [popups, setPopups] = useState<PixelSparkle[]>([]);

  // Trigger floaty scores "+1%" periodically
  useEffect(() => {
    if (!isPluggedIn) {
      setPopups([]);
      return;
    }

    const interval = setInterval(() => {
      setPopups((prev) => {
        const nextId = Date.now();
        // Limit to 4 active floating tags
        return [
          ...prev.slice(-3),
          {
            id: nextId,
            x: Math.random() * 60 + 20,
            delayY: 0,
            text: Math.random() > 0.4 ? '+1%' : 'PWR UP!'
          }
        ];
      });
    }, 1500 / speedMultiplier);

    return () => clearInterval(interval);
  }, [isPluggedIn, speedMultiplier]);

  // Map 0-100 to 8 equal retro segment blocks
  const maxBlocks = 8;
  const filledBlocks = Math.ceil((batteryLevel / 100) * maxBlocks);

  return (
    <div className="absolute inset-0 bg-[#0c1208] overflow-hidden flex flex-col items-center justify-between py-12 select-none font-mono">
      {/* Scanlines Overlay for retro feel */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.07]" 
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Retro Title banner */}
      <div className="z-10 text-center flex flex-col items-center">
        <span className="bg-[#1e3415] text-[#4af626] border-2 border-[#4af626] px-3 py-1 font-bold text-xs uppercase tracking-widest leading-none"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          {isPluggedIn ? '⚡ PLUGGED IN ⚡' : 'DISCONNECTED'}
        </span>
        <span className="text-[#4af626] text-[9px] mt-1.5 opacity-50 block uppercase">
          STAMP: COIN_SYS_OK
        </span>
      </div>

      {/* Main retro pixelated battery graphic */}
      <div className="relative flex items-center justify-center w-full h-80 z-10">
        
        {/* Floating popups */}
        <AnimatePresence>
          {popups.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: 50, x: `${p.x}%`, opacity: 0, scale: 0.8 }}
              animate={{
                y: -120,
                opacity: [0, 1, 1, 0],
                scale: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2.5 / speedMultiplier,
                ease: "easeOut",
              }}
              className="absolute font-bold text-xs pointer-events-none border border-[#4af626] bg-[#0c1208] px-1"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              {p.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Outer pixel bounds */}
        <div className="relative p-2.5 border-4 border-[#335624] bg-neutral-900 w-32 h-56 flex flex-col items-center justify-between"
          style={{ borderColor: accentColor }}
        >
          {/* Top retro node */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-2.5 border-4 border-b-0 border-[#335624] bg-neutral-900" 
            style={{ borderColor: accentColor }}
          />

          {/* Map block segments top to bottom or bottom to top */}
          <div className="w-full h-full flex flex-col-reverse justify-between gap-1 mt-1">
            {Array.from({ length: maxBlocks }).map((_, blockIndex) => {
              const isFilled = blockIndex < filledBlocks;
              return (
                <div 
                  key={blockIndex} 
                  className={`h-full border-2 ${isFilled ? 'bg-[#4af626]' : 'border-dashed border-white/5'}`}
                  style={{ 
                    backgroundColor: isFilled ? accentColor : 'transparent',
                    borderColor: isFilled ? accentColor : 'rgba(255,255,255,0.05)'
                  }}
                />
              );
            })}
          </div>

          {/* Centered big 8-bit text display overlay */}
          <div className="absolute inset-x-0 bottom-4 text-center z-10 bg-neutral-900/90 py-1 border-y-2 border-dashed border-[#335624]"
            style={{ borderColor: `${accentColor}33` }}
          >
            <span className="text-3xl font-black text-white leading-none block font-mono">
              {batteryLevel}%
            </span>
            <span className="text-[9px] uppercase font-bold text-white/50 tracking-wider block mt-1">
              {filledBlocks}/{maxBlocks} BLOCKS
            </span>
          </div>
        </div>
      </div>

      {/* Classic retro pixel scores line */}
      <div className="z-10 text-center text-[#4af626] text-[10px] uppercase opacity-70"
        style={{ color: accentColor }}
      >
        <span>SCORE: {batteryLevel * 100} // TIME: {(maxBlocks - filledBlocks) * 3} MIN</span>
      </div>
    </div>
  );
}
