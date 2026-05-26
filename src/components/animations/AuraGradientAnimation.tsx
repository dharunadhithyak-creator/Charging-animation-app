import { motion } from 'motion/react';

interface AnimationProps {
  batteryLevel: number;
  isPluggedIn: boolean;
  accentColor: string;
  speedMultiplier: number;
}

export default function AuraGradientAnimation({
  batteryLevel,
  isPluggedIn,
  accentColor,
  speedMultiplier,
}: AnimationProps) {
  // Use custom rich complementary gradient colors based on original accent
  const baseGlow = accentColor;
  
  return (
    <div className="absolute inset-0 bg-[#0c0514] overflow-hidden flex flex-col items-center justify-between py-12 select-none">
      
      {/* Morphing Liquid Blobs (Aura Gradient Mesh) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none filter blur-[80px] opacity-40">
        
        {/* Blob 1 */}
        <motion.div
          animate={isPluggedIn ? {
            x: [0, 40, -20, 0],
            y: [-20, 30, -50, -20],
            scale: [1, 1.2, 0.9, 1],
          } : {}}
          transition={{
            duration: 12 / speedMultiplier,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-10 -left-10 w-96 h-96 rounded-full"
          style={{ backgroundColor: baseGlow }}
        />

        {/* Blob 2 (Offset secondary color e.g. indigo/purple) */}
        <motion.div
          animate={isPluggedIn ? {
            x: [20, -50, 30, 20],
            y: [50, -20, 70, 50],
            scale: [1.1, 0.8, 1.2, 1.1],
          } : {}}
          transition={{
            duration: 15 / speedMultiplier,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full"
          style={{ backgroundColor: baseGlow }}
        />

        {/* Blob 3 (Center pulsating aura) */}
        <motion.div
          animate={{
            scale: isPluggedIn ? [1, 1.4, 1] : [1, 1.05, 1],
            opacity: isPluggedIn ? [0.4, 0.7, 0.4] : [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8 / speedMultiplier,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full"
          style={{ backgroundColor: baseGlow }}
        />
      </div>

      {/* Elegant Neon Active Borders (Visible only when charging) */}
      {isPluggedIn && (
        <div className="absolute inset-0 z-0 border-[2.5px] pointer-events-none"
          style={{ 
            borderColor: `${baseGlow}15`,
            boxShadow: `inset 0 0 16px ${baseGlow}33`
          }}
        >
          {/* Moving Laser Sweep Point */}
          <motion.div 
            animate={{
              top: ['0%', '100%', '100%', '0%', '0%'],
              left: ['0%', '0%', '100%', '100%', '0%'],
            }}
            transition={{
              duration: 8 / speedMultiplier,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none filter blur-sm opacity-80"
            style={{ 
              background: `radial-gradient(circle, ${baseGlow} 0%, transparent 70%)` 
            }}
          />
        </div>
      )}

      {/* Premium Screen Header */}
      <div className="z-10 text-center flex flex-col items-center">
        <span className="text-white/30 text-xs font-semibold tracking-[0.25em] uppercase">
          Elegant Aura
        </span>
        {isPluggedIn && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 / speedMultiplier }}
            className="text-white/60 text-[10px] mt-1 font-sans font-light tracking-widest"
          >
            SMOOTH FLUID OVERFLOW
          </motion.span>
        )}
      </div>

      {/* Main Luxury Glass Clock / Display */}
      <div className="relative flex items-center justify-center w-full h-80 z-10 p-6">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="w-44 h-64 rounded-3xl backdrop-blur-3xl bg-white/[0.02] border border-white/5 shadow-[0_24px_50px_rgba(0,0,0,0.6)] flex flex-col items-center justify-between py-8 text-center"
        >
          {/* Top subtle symbol badge */}
          <div className="text-white/45 flex flex-col items-center">
            {isPluggedIn ? (
              <motion.svg 
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-5 h-5 text-emerald-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" style={{ color: baseGlow }} />
              </motion.svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            )}
            <span className="text-[9px] uppercase tracking-widest mt-1.5 opacity-60">Status</span>
          </div>

          {/* Big percentage view */}
          <div className="relative">
            <span className="text-6xl font-extrabold tracking-tight text-white block">
              {batteryLevel}
            </span>
            <span className="text-xs uppercase font-semibold text-white/40 tracking-widest mt-1 block">
              Percent
            </span>
          </div>

          {/* Bottom dynamic micro wave */}
          <div className="w-16 h-1 rounded-full overflow-hidden bg-white/5">
            <motion.div 
              className="h-full rounded-full"
              style={{ backgroundColor: baseGlow }}
              animate={isPluggedIn ? {
                width: ['0%', '100%'],
                x: ['-100%', '100%']
              } : { width: `${batteryLevel}%` }}
              transition={isPluggedIn ? {
                duration: 2.2 / speedMultiplier,
                repeat: Infinity,
                ease: 'easeInOut'
              } : { duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Luxury Brand Styling Signature */}
      <div className="z-10 text-center">
        <span className="text-white/10 uppercase text-[9px] tracking-[0.3em]">
          Designed by Antigravity Studio
        </span>
      </div>
    </div>
  );
}
