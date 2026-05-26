import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AnimationProps {
  batteryLevel: number;
  isPluggedIn: boolean;
  accentColor: string;
  speedMultiplier: number;
}

interface Spark {
  id: number;
  angle: number; // degrees
  distance: number; // radius expansion
  size: number;
  duration: number;
}

export default function BoltStrikeAnimation({
  batteryLevel,
  isPluggedIn,
  accentColor,
  speedMultiplier,
}: AnimationProps) {
  const [sparks, setSparks] = useState<Spark[]>([]);

  // Generate electrical spark debris periodically
  useEffect(() => {
    if (!isPluggedIn) {
      setSparks([]);
      return;
    }

    const interval = setInterval(() => {
      const newSparks = Array.from({ length: 4 }, (_, i) => ({
        id: Date.now() + i,
        angle: Math.random() * 360,
        distance: Math.random() * 40 + 60,
        size: Math.random() * 5 + 3,
        duration: (Math.random() * 0.4 + 0.3) / speedMultiplier,
      }));

      setSparks((prev) => [...prev.slice(-12), ...newSparks]);
    }, 450 / speedMultiplier);

    return () => clearInterval(interval);
  }, [isPluggedIn, speedMultiplier]);

  return (
    <div className="absolute inset-0 bg-[#06040a] overflow-hidden flex flex-col items-center justify-between py-12 select-none">
      
      {/* Background electrical storm background flash */}
      {isPluggedIn && (
        <motion.div 
          animate={{
            opacity: [0, 0.05, 0, 0.12, 0.03, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: "easeInOut"
          }}
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
      )}

      {/* Top Lightning Label */}
      <div className="z-10 text-center">
        <span className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase font-mono">
          HIGH VOLTAGE CONNECTION
        </span>
        {isPluggedIn && (
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-amber-400 font-mono text-[10px] mt-1 font-semibold flex items-center justify-center space-x-1"
          >
            <span>⚡ COIL COUPLING STABLE</span>
          </motion.div>
        )}
      </div>

      {/* Center Battery Container with striking electricity */}
      <div className="relative flex items-center justify-center w-full h-80 z-10">
        
        {/* Shimmering Halo */}
        <div 
          className="absolute w-56 h-56 rounded-full opacity-[0.06] filter blur-2xl"
          style={{ backgroundColor: accentColor }}
        />

        {/* Dynamic Wave Ripples (expanding rings of electrical arcs) */}
        <AnimatePresence>
          {isPluggedIn && [1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              initial={{ scale: 0.4, opacity: 0.8 }}
              animate={{ 
                scale: 1.5, 
                opacity: 0,
                rotate: ring * 45
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2.2 / speedMultiplier,
                delay: (ring - 1) * 0.7,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute w-44 h-44 rounded-full border border-dashed pointer-events-none"
              style={{ borderColor: `${accentColor}44` }}
            />
          ))}
        </AnimatePresence>

        {/* Animated Lightning Bolt Graphic floating on top (simulated strike) */}
        {isPluggedIn && (
          <div className="absolute top-0 bottom-1/2 left-1/2 -translate-x-1/2 w-8 pointer-events-none z-20 flex flex-col items-center">
            <motion.svg
              animate={{
                opacity: [0.3, 1, 0.2, 0.8, 0.3, 0.9, 0.4],
                y: [-3, 3, -1, 2, -2],
                scaleX: [1, 1.1, 0.95, 1.05, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-8 h-36"
              viewBox="0 0 24 120"
              fill="none"
            >
              {/* Lightning path down from top of screen to the battery */}
              <motion.path
                d="M 12 0 L 8 40 L 16 35 L 7 75 L 15 70 L 10 110"
                stroke={accentColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ 
                  filter: `drop-shadow(0 0 8px ${accentColor})`
                }}
              />
              <path
                d="M 12 0 L 8 40 L 16 35 L 7 75 L 15 70 L 10 110"
                stroke="#ffffff"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </div>
        )}

        {/* Huge Battery Core Body */}
        <div className="relative w-28 h-48 rounded-[18px] bg-black/60 border-2 border-white/10 p-2 flex flex-col justify-end overflow-hidden">
          {/* Custom battery node terminal at the top */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-white/20 rounded-t border-t border-x border-white/10" />

          {/* Internal Fill Level with high-voltage neon blocks */}
          <div className="relative w-full h-full rounded-[10px] overflow-hidden flex flex-col justify-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${batteryLevel}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="w-full opacity-90 rounded-[8px]"
              style={{
                background: `linear-gradient(to top, ${accentColor} 0%, ${accentColor}dd 100%)`,
                boxShadow: `0 0 20px ${accentColor}88`,
              }}
            >
              {/* Glossy Overlay Highlight */}
              <div className="absolute inset-y-0 left-0 w-1/3 bg-white/10 filter blur-[1px]" />
            </motion.div>

            {/* Inner text displaying current percentage */}
            <div className="absolute inset-x-0 bottom-6 text-center z-20">
              <span className="text-4xl font-extrabold text-white tracking-tighter block drop-shadow-md">
                {batteryLevel}
              </span>
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block mt-0.5">
                Percent
              </span>
            </div>
          </div>
        </div>

        {/* Scattered Electrical Spark particles */}
        <div className="absolute inset-0 pointer-events-none">
          {sparks.map((spark) => {
            const rad = (spark.angle * Math.PI) / 180;
            const targetX = Math.cos(rad) * spark.distance;
            const targetY = Math.sin(rad) * spark.distance;

            return (
              <motion.div
                key={spark.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: targetX,
                  y: targetY,
                  opacity: 0,
                  scale: 0.1,
                }}
                transition={{
                  duration: spark.duration,
                  ease: "easeOut",
                }}
                className="absolute w-2 h-2 rounded-full left-1/2 top-1/2 -ml-1 -mt-1"
                style={{
                  width: spark.size,
                  height: spark.size,
                  backgroundColor: accentColor,
                  boxShadow: `0 0 6px ${accentColor}`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Amperage and Speed Details */}
      <div className="z-10 text-center font-mono text-[9px] text-white/20">
        <span>VOLT: {Math.max(5, 5 + batteryLevel / 20).toFixed(1)}V // AMP: {isPluggedIn ? (3 * speedMultiplier).toFixed(2) : '0.00'}A</span>
      </div>
    </div>
  );
}
