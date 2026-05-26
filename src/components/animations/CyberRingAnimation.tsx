import { motion } from 'motion/react';

interface AnimationProps {
  batteryLevel: number;
  isPluggedIn: boolean;
  accentColor: string;
  speedMultiplier: number;
}

export default function CyberRingAnimation({
  batteryLevel,
  isPluggedIn,
  accentColor,
  speedMultiplier,
}: AnimationProps) {
  return (
    <div className="absolute inset-0 bg-[#04080e] overflow-hidden flex flex-col items-center justify-between py-12 select-none font-mono">
      {/* Target Retro Grid Background Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${accentColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${accentColor} 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Cyberpunk Top Header Stats */}
      <div className="z-10 text-center w-full px-6 flex justify-between items-center text-[10px]">
        <div className="text-left">
          <span className="text-white/30 block">SYS.CHARGE:</span>
          <span className="text-white/80 font-medium" style={{ color: isPluggedIn ? accentColor : '' }}>
            {isPluggedIn ? `ACTIVE // ${45 * speedMultiplier}W` : 'STANDBY'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-white/30 block">TERMINAL.ID:</span>
          <span className="text-white/80 font-medium font-mono">CES-3501X</span>
        </div>
      </div>

      {/* Futuristic Spinning HUD Center */}
      <div className="relative flex items-center justify-center w-full h-80 z-10">
        
        {/* Core Pulsing Glow Area */}
        <div 
          className="absolute w-56 h-56 rounded-full opacity-[0.08] filter blur-xl transition-all duration-700"
          style={{ backgroundColor: accentColor }}
        />

        {/* Outer Tech Ring 1 (Rotates Slow Clockwise) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18 / speedMultiplier, repeat: Infinity, ease: 'linear' }}
          className="absolute w-64 h-64 rounded-full border border-dashed text-center flex items-center justify-center"
          style={{ borderColor: `${accentColor}33` }}
        >
          {/* Internal hash markings */}
          <div className="absolute inset-4 rounded-full border border-white/5" />
        </motion.div>

        {/* Outer Tech Dial with tick lines (Rotates Counter-Clockwise) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 10 / speedMultiplier, repeat: Infinity, ease: 'linear' }}
          className="absolute w-52 h-52 rounded-full border border-double flex items-center justify-center"
          style={{ borderColor: `${accentColor}55`, borderStyle: 'double', borderWidth: '4px' }}
        >
          {/* Tech tick dots */}
          <div className="absolute w-full h-full flex justify-between items-center px-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
          </div>
          <div className="absolute w-full h-full flex justify-between items-center py-1 flex-col">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
          </div>
        </motion.div>

        {/* Inner Tech Ring with dynamic slash segments */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 5 / speedMultiplier, repeat: Infinity, ease: 'linear' }}
          className="absolute w-44 h-44 rounded-full border-t-2 border-b-2"
          style={{ borderColor: accentColor }}
        />

        {/* Center Target Ring */}
        <div className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center backdrop-blur-2xl bg-black/60 border"
          style={{ borderColor: `${accentColor}77` }}
        >
          {/* Dynamic Arc Indicator mapping battery percent */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 scale-95" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="transparent"
              stroke="rgba(255,255,255,0.02)"
              strokeWidth="3.5"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              fill="transparent"
              stroke={accentColor}
              strokeWidth="4"
              strokeDasharray="276.4"
              initial={{ strokeDashoffset: 276.4 }}
              animate={{ strokeDashoffset: 276.4 - (276.4 * batteryLevel) / 100 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 4px ${accentColor})` }}
            />
          </svg>

          {/* Central Digital Readout */}
          <div className="z-10 text-center">
            {/* Tiny battery icon indicator */}
            <div className="flex justify-center mb-1 text-xs" style={{ color: accentColor }}>
              <span className="text-[9px] uppercase tracking-widest font-bold font-mono">
                {batteryLevel}% CAP
              </span>
            </div>
            
            <div className="text-3xl font-extrabold tracking-tight text-white mb-0.5">
              {batteryLevel}
            </div>

            <div className="text-[10px] uppercase opacity-40 font-mono tracking-widest">
              {isPluggedIn ? '⚡ CHRG_SPEED' : 'DISCONNECTED'}
            </div>
          </div>

          {/* Glowing particle emitter ticks */}
          {isPluggedIn && (
            <div className="absolute inset-2 pointer-events-none">
              <span className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-3 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-3 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
            </div>
          )}
        </div>

        {/* Futuristic Laser Concentrators orbiting around */}
        {isPluggedIn && (
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 7 / speedMultiplier, repeat: Infinity, ease: 'linear' }}
            className="absolute w-72 h-72 rounded-full pointer-events-none"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[1px]" style={{ backgroundColor: accentColor }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[1px]" style={{ backgroundColor: accentColor }} />
          </motion.div>
        )}
      </div>

      {/* Tech Decors at bottom */}
      <div className="z-10 w-full px-6 flex justify-between items-end text-[9px] text-white/20">
        <div>
          <span>PWR // MULTIPLIER: {speedMultiplier.toFixed(1)}X</span>
        </div>
        <div>
          <span>SECURE PROTOCOL CLOUD_LIVE</span>
        </div>
      </div>
    </div>
  );
}
