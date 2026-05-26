import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AnimationProps {
  batteryLevel: number;
  isPluggedIn: boolean;
  accentColor: string;
  speedMultiplier: number;
}

interface Bubble {
  id: number;
  x: number; // percentage width
  size: number; // pixels
  delay: number; // seconds
  duration: number; // seconds
}

export default function FluidBubbleAnimation({
  batteryLevel,
  isPluggedIn,
  accentColor,
  speedMultiplier,
}: AnimationProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // Generate bubbles periodically when plugged in
  useEffect(() => {
    if (!isPluggedIn) {
      setBubbles([]);
      return;
    }

    // Set initial batch
    const initialBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      size: Math.random() * 12 + 6,
      delay: Math.random() * 4,
      duration: (Math.random() * 3 + 2.5) / speedMultiplier,
    }));
    setBubbles(initialBubbles);

    // Keep adding newer bubbles to loop
    const interval = setInterval(() => {
      setBubbles((prev) => {
        // Keep up to 25 bubbles max, replace older ones
        const list = [...prev];
        if (list.length > 25) {
          list.splice(0, 5);
        }
        const now = Date.now();
        return [
          ...list,
          ...Array.from({ length: 5 }, (_, i) => ({
            id: now + i,
            x: Math.random() * 84 + 8,
            size: Math.random() * 14 + 6,
            delay: 0,
            duration: (Math.random() * 2.5 + 2) / speedMultiplier,
          })),
        ];
      });
    }, 2000 / speedMultiplier);

    return () => clearInterval(interval);
  }, [isPluggedIn, speedMultiplier]);

  return (
    <div className="absolute inset-0 bg-[#070b13] overflow-hidden flex flex-col items-center justify-between py-12 select-none">
      {/* Dynamic Ambient Background Glow */}
      <div 
        className="absolute inset-0 opacity-[0.14] pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at bottom, ${accentColor} 0%, transparent 60%)`,
        }}
      />

      {/* Top Banner / Charging details */}
      <div className="z-10 text-center flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/40 text-[10px] uppercase font-semibold tracking-widest"
        >
          {isPluggedIn ? 'Super Fluid Charging' : 'Battery Status'}
        </motion.span>
        {isPluggedIn && (
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 / speedMultiplier }}
            className="mt-1 flex items-center space-x-1"
          >
            <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
            <span className="text-[11px] font-medium text-white/80">Flowing Watts</span>
          </motion.div>
        )}
      </div>

      {/* Main Core Charge Indicator */}
      <div className="relative flex items-center justify-center w-full h-80 z-10">
        {/* Breathing Inner Ripple */}
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 3 / speedMultiplier,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-48 h-48 rounded-full border-2 border-dashed opacity-25"
          style={{ borderColor: accentColor }}
        />

        {/* Central Glass Globe */}
        <div className="relative w-40 h-40 rounded-full flex items-center justify-center backdrop-blur-xl bg-white/[0.03] border border-white/10 shadow-2xl">
          {/* Internal liquid swell filled to battery level (simulated offset) */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 rounded-b-full overflow-hidden opacity-15"
            style={{ 
              height: `${batteryLevel}%`, 
              backgroundColor: accentColor,
              filter: 'blur(4px)'
            }}
            animate={{
              height: [`${batteryLevel}%`, `${batteryLevel + 2}%`, `${batteryLevel}%`]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Central Charge percentage */}
          <div className="text-center z-10">
            <div className="flex items-baseline justify-center">
              <span className="text-5xl font-extrabold tracking-tight text-white font-sans">
                {batteryLevel}
              </span>
              <span className="text-lg font-medium text-white/50 ml-0.5">%</span>
            </div>
            <span className="text-[10px] text-white/30 tracking-wider uppercase font-mono mt-0.5 block">
              {batteryLevel === 100 ? 'Full' : isPluggedIn ? 'Charging' : 'Unplugged'}
            </span>
          </div>

          {/* Liquid Sine Wave Core Layer */}
          <svg className="absolute w-full h-full inset-0 pointer-events-none opacity-20" viewBox="0 0 100 100">
            <path 
              d="M 10 50 Q 30 40 50 50 T 90 50" 
              fill="none" 
              stroke={accentColor} 
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          </svg>
        </div>

        {/* Outer decorative spinning orbits */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12 / speedMultiplier, repeat: Infinity, ease: 'linear' }}
          className="absolute w-44 h-44 rounded-full border border-white/5 pointer-events-none"
        >
          <div 
            className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full shadow-lg"
            style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
          />
        </motion.div>
      </div>

      {/* Floating Bubbles Container */}
      <div className="absolute inset-x-0 bottom-0 top-[20%] pointer-events-none overflow-hidden">
        {bubbles.map((b) => (
          <motion.div
            key={b.id}
            initial={{ y: '100%', x: `${b.x}%`, opacity: 0, scale: 0.5 }}
            animate={{
              y: '-10%',
              opacity: [0, b.size > 10 ? 0.7 : 0.4, 0.8, 0],
              scale: [0.5, 1, 1.2, 0.8],
              x: [
                `${b.x}%`,
                `${b.x + (Math.sin(b.id) * 6)}%`,
                `${b.x - (Math.cos(b.id) * 4)}%`,
                `${b.x + (Math.sin(b.id) * 3)}%`
              ]
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute rounded-full"
            style={{
              width: b.size,
              height: b.size,
              backgroundColor: accentColor,
              boxShadow: `0 0 ${b.size * 1.5}px ${accentColor}`,
            }}
          />
        ))}

        {/* Dynamic Wave Bed at the absolute bottom */}
        {isPluggedIn && (
          <motion.div
            animate={{
              y: [2, -2, 2],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-0 left-0 right-0 h-4 filter blur-sm"
            style={{
              backgroundColor: accentColor,
              opacity: 0.15,
            }}
          />
        )}
      </div>
    </div>
  );
}
