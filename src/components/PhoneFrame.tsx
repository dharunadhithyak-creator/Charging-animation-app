import { motion, AnimatePresence } from 'motion/react';
import { Wifi, Signal, Battery, BatteryCharging, Zap } from 'lucide-react';
import FluidBubbleAnimation from './animations/FluidBubbleAnimation';
import CyberRingAnimation from './animations/CyberRingAnimation';
import AuraGradientAnimation from './animations/AuraGradientAnimation';
import BoltStrikeAnimation from './animations/BoltStrikeAnimation';
import RetroPixelAnimation from './animations/RetroPixelAnimation';
import CosmicNebulaAnimation from './animations/CosmicNebulaAnimation';
import { ChargingAnimationTheme } from '../types';
import { useEffect, useState } from 'react';

interface PhoneFrameProps {
  batteryLevel: number;
  isPluggedIn: boolean;
  selectedTheme: ChargingAnimationTheme;
  accentColor: string;
  speedMultiplier: number;
}

export default function PhoneFrame({
  batteryLevel,
  isPluggedIn,
  selectedTheme,
  accentColor,
  speedMultiplier,
}: PhoneFrameProps) {
  const [deviceTime, setDeviceTime] = useState('09:41');

  // Sync virtual smartphone status bar clock to local system time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setDeviceTime(`${hrs}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const renderAnimation = () => {
    switch (selectedTheme) {
      case 'fluid_bubble':
        return (
          <FluidBubbleAnimation
            batteryLevel={batteryLevel}
            isPluggedIn={isPluggedIn}
            accentColor={accentColor}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'cyber_ring':
        return (
          <CyberRingAnimation
            batteryLevel={batteryLevel}
            isPluggedIn={isPluggedIn}
            accentColor={accentColor}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'aura_gradient':
        return (
          <AuraGradientAnimation
            batteryLevel={batteryLevel}
            isPluggedIn={isPluggedIn}
            accentColor={accentColor}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'bolt_strike':
        return (
          <BoltStrikeAnimation
            batteryLevel={batteryLevel}
            isPluggedIn={isPluggedIn}
            accentColor={accentColor}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'retro_pixel':
        return (
          <RetroPixelAnimation
            batteryLevel={batteryLevel}
            isPluggedIn={isPluggedIn}
            accentColor={accentColor}
            speedMultiplier={speedMultiplier}
          />
        );
      case 'cosmic_nebula':
        return (
          <CosmicNebulaAnimation
            batteryLevel={batteryLevel}
            isPluggedIn={isPluggedIn}
            accentColor={accentColor}
            speedMultiplier={speedMultiplier}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div id="phone-simulation-viewport" className="relative flex flex-col items-center">
      {/* Phone Case Container */}
      <div className="relative w-[320px] h-[640px] rounded-[48px] bg-[#12161f] p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-[5px] border-[#202735] select-none">
        
        {/* Rear structural glass highlights / tactile buttons on case */}
        {/* Left Side: Volume Buttons */}
        <div className="absolute top-28 -left-1.5 w-1 h-12 bg-[#2d374b] rounded-l border-y border-l border-black/25" />
        <div className="absolute top-44 -left-1.5 w-1 h-12 bg-[#2d374b] rounded-l border-y border-l border-black/25" />
        
        {/* Right Side: Power Button */}
        <div className="absolute top-36 -right-1.5 w-1 h-16 bg-[#2d374b] rounded-r border-y border-r border-black/25" />

        {/* Screen/Bezel Frame */}
        <div className="relative w-full h-full rounded-[36px] bg-black overflow-hidden flex flex-col border border-white/5 shadow-inner">
          
          {/* Glass glare overlay */}
          <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.08]" />

          {/* Punch hole or Dynamic Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3.5 border border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
            {/* Camera Lens */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#051122] border border-white/5 relative overflow-hidden flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#1e44a5] opacity-50" />
            </div>
            {/* Dynamic charging indicator dot */}
            <div className="flex items-center space-x-1">
              <div 
                className={`w-1.5 h-1.5 rounded-full ${isPluggedIn ? 'animate-pulse' : 'opacity-20'}`}
                style={{ backgroundColor: isPluggedIn ? accentColor : '#9ca3af' }}
              />
            </div>
          </div>

          {/* Virtual Top Status Bar */}
          <div className="absolute top-0 inset-x-0 h-10 px-6 flex justify-between items-center z-30 pointer-events-none text-white text-[11px] font-medium tracking-tight">
            <div>
              <span>{deviceTime}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Signal className="w-3.5 h-3.5 opacity-80" strokeWidth={2.5} />
              <Wifi className="w-3.5 h-3.5 opacity-80" strokeWidth={2.5} />
              <div className="flex items-center space-x-0.5">
                {isPluggedIn ? (
                  <BatteryCharging className="w-4 h-4" strokeWidth={2.5} style={{ color: accentColor }} />
                ) : (
                  <Battery className="w-4 h-4 opacity-80" strokeWidth={2.5} />
                )}
                <span>{batteryLevel}%</span>
              </div>
            </div>
          </div>

          {/* The Live Charging Anim Screen inside */}
          <div className="w-full h-full relative z-10">
            {renderAnimation()}
          </div>

          {/* Phone Bottom Swipe bar indicator */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full z-30 pointer-events-none" />
        </div>
      </div>

      {/* Dynamic Animated Cable Slot Simulator */}
      <div className="relative w-20 flex flex-col items-center">
        {/* Dynamic USB-C socket under phone */}
        <div className="w-12 h-2.5 bg-neutral-800 rounded-b-md border-x border-b border-white/5 relative z-10">
          <div className="absolute inset-x-2.5 top-0.5 bottom-1 rounded bg-black flex items-center justify-center">
            {/* Lightning bolt indicator */}
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/10" />
          </div>
        </div>

        {/* Cable wire visual plug-in animation */}
        <AnimatePresence>
          {isPluggedIn && (
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 25, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className="absolute -top-1 w-8 flex flex-col items-center z-0"
            >
              {/* Metal USB-C Header */}
              <div className="w-4 h-3 bg-neutral-400 border-x border-[#9ca3af] relative">
                <div className="w-full h-1 bg-[#d1d5db] absolute top-0" />
              </div>
              {/* Plastic USB Grip */}
              <div className="w-6 h-8 bg-neutral-800 rounded-md border border-neutral-700 flex flex-col items-center justify-center p-1 relative shadow-lg">
                <Zap className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                <div className="w-1.5 h-0.5 bg-neutral-600 rounded-sm mt-1" />
              </div>
              {/* Cable cord itself */}
              <div className="w-1.5 h-20 bg-neutral-800 border-l border-neutral-700 shadow-inner" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
