import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface AnimationProps {
  batteryLevel: number;
  isPluggedIn: boolean;
  accentColor: string;
  speedMultiplier: number;
}

interface Star {
  id: number;
  x: number; // percent
  y: number; // percent
  size: number;
  decay: number;
}

export default function CosmicNebulaAnimation({
  batteryLevel,
  isPluggedIn,
  accentColor,
  speedMultiplier,
}: AnimationProps) {
  const [stars, setStars] = useState<Star[]>([]);

  // Generate celestial starry points
  useEffect(() => {
    const spaceStars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      size: Math.random() * 3 + 1,
      decay: Math.random() * 2 + 1,
    }));
    setStars(spaceStars);
  }, []);

  return (
    <div className="absolute inset-0 bg-[#020308] overflow-hidden flex flex-col items-center justify-between py-12 select-none">
      
      {/* Deep Space Starfield */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            animate={{
              opacity: [0.1, 1, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.decay * 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute rounded-full bg-white"
            style={{
              top: `${star.y}%`,
              left: `${star.x}%`,
              width: star.size,
              height: star.size,
              boxShadow: star.size > 2 ? `0 0 6px rgba(255, 255, 255, 0.7)` : 'none'
            }}
          />
        ))}
      </div>

      {/* Nebula Swirl cloud rings based on theme Color */}
      <div 
        className="absolute inset-12 pointer-events-none rounded-full filter blur-[60px] opacity-[0.14]"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 65%)`
        }}
      />

      {/* Top Celestials Header */}
      <div className="z-10 text-center">
        <span className="text-white/30 text-[10px] font-light tracking-[0.3em] uppercase">
          COSMIC STELLAR EMULATOR
        </span>
        {isPluggedIn && (
          <motion.div 
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="text-white/60 text-[9px] uppercase tracking-widest mt-1 font-mono"
          >
            ★ Orbiting Starfield State
          </motion.div>
        )}
      </div>

      {/* Central Planet core / Charging orbits */}
      <div className="relative flex items-center justify-center w-full h-80 z-10">
        
        {/* Core celestial background halo */}
        <div 
          className="absolute w-60 h-60 rounded-full opacity-[0.05] filter blur-3xl"
          style={{ backgroundColor: accentColor }}
        />

        {/* Orbit Path 1 (Small planets) */}
        <motion.div
          animate={{ rotate: 180 }}
          transition={{ duration: 16 / speedMultiplier, repeat: Infinity, ease: 'linear' }}
          className="absolute w-56 h-56 rounded-full border border-white/5 pointer-events-none flex items-center justify-center"
        >
          {/* Orbital Satellite Dust */}
          <div 
            className="absolute top-0 w-3 h-3 rounded-full opacity-60" 
            style={{ 
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`
            }} 
          />
        </motion.div>

        {/* Orbit Path 2 (Large Planet) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25 / speedMultiplier, repeat: Infinity, ease: 'linear' }}
          className="absolute w-44 h-44 rounded-full border border-dashed border-white/10 pointer-events-none"
        >
          {/* Planet */}
          <div 
            className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 rounded-full border border-white/10"
            style={{ 
              background: `linear-gradient(135deg, #1f2937, #030712)`,
            }} 
          >
            {/* Tiny ring around satellite planet */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-1 border border-white/20 rounded-full rotate-12" />
          </div>
        </motion.div>

        {/* Central Planet Core */}
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center backdrop-blur-3xl bg-black/40 border border-white/10 shadow-2xl"
        >
          {/* Internal Eclipse Moon Shadow */}
          <div 
            className="absolute inset-[3px] rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${accentColor} 0%, transparent 70%)`
            }}
          />

          {/* Core percentage */}
          <div className="z-10 text-center">
            <span className="text-4xl font-extrabold text-white block tracking-tighter">
              {batteryLevel}
            </span>
            <span className="text-[9px] uppercase font-mono tracking-widest text-white/40 block mt-1">
              {isPluggedIn ? '⚡ CHRGN' : 'SYS_STB'}
            </span>
          </div>

          {/* Star Corona Rings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            <motion.ellipse 
              cx="50" 
              cy="50" 
              rx="46" 
              ry="46" 
              fill="none" 
              stroke={accentColor} 
              strokeWidth="0.75"
              strokeDasharray="6 12"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Galactic Location details at the absolute bottom */}
      <div className="z-10 text-center font-mono text-[9px] text-white/20">
        <span>GALAXY: MILKY_WAY_S1 // COORDINATES: X-349.00 / Y-052.12</span>
      </div>
    </div>
  );
}
