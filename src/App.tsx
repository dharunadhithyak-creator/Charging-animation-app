import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PhoneFrame from './components/PhoneFrame';
import ControlPanel from './components/ControlPanel';
import DiagnosticStats from './components/DiagnosticStats';
import { EmulatorState, ChargerType, ChargingAnimationTheme } from './types';
import { audioSynth } from './utils/audio';
import { Shield, Sparkles, Lightbulb } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<EmulatorState>({
    batteryLevel: 64,
    isPluggedIn: true,
    selectedTheme: 'fluid_bubble',
    chargerType: 'super_fast',
    accentColor: '#22c55e',
    ambientVolume: 0.35,
    soundEffectsEnabled: true,
    timeToFullMinutes: null,
    batteryHealth: 'Excellent',
    batteryTempCelsius: 30.2,
    currentAmps: 1800,
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Trigger brief alert banner notifications
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Play connection audio theme when changed
  const handleTogglePlug = () => {
    setState((prev) => {
      const nextPlugged = !prev.isPluggedIn;
      
      if (prev.soundEffectsEnabled) {
        if (nextPlugged) {
          audioSynth.playConnect(prev.chargerType, prev.ambientVolume);
        } else {
          audioSynth.playDisconnect(prev.ambientVolume);
        }
      }

      return {
        ...prev,
        isPluggedIn: nextPlugged,
      };
    });

    showNotification(
      !state.isPluggedIn 
        ? `USB-C cable connected: Synergizing speed details.` 
        : 'USB-C Cable disconnected. Battery discharging.'
    );
  };

  // Incremental charge accretion effect based on wattage speeds
  useEffect(() => {
    if (!state.isPluggedIn || state.batteryLevel >= 100) return;

    // Define tick speeds based on wattage configuration in ms
    let tickSpeedMs = 5000; // standard (gives +1% progress)
    if (state.chargerType === 'fast') tickSpeedMs = 3000;
    if (state.chargerType === 'super_fast') tickSpeedMs = 1500;
    if (state.chargerType === 'hyper') tickSpeedMs = 700;

    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.batteryLevel >= 100) {
          clearInterval(interval);
          if (prev.soundEffectsEnabled) {
            // Play double success chime
            audioSynth.playConnect('standard', prev.ambientVolume);
          }
          return { ...prev, batteryLevel: 100 };
        }
        return {
          ...prev,
          batteryLevel: Math.min(100, prev.batteryLevel + 1),
        };
      });
    }, tickSpeedMs);

    return () => clearInterval(interval);
  }, [state.isPluggedIn, state.chargerType, state.batteryLevel]);

  const handleChangeTheme = (theme: ChargingAnimationTheme) => {
    setState((prev) => ({ ...prev, selectedTheme: theme }));
    showNotification(`Theme swapped to ${theme.replace('_', ' ').toUpperCase()}`);
  };

  const handleChangeBattery = (level: number) => {
    setState((prev) => ({ ...prev, batteryLevel: level }));
  };

  const handleChangeChargerType = (type: ChargerType) => {
    setState((prev) => {
      if (prev.isPluggedIn && prev.soundEffectsEnabled) {
        // Play fresh chime matching speed
        audioSynth.playConnect(type, prev.ambientVolume);
      }
      return { ...prev, chargerType: type };
    });
    showNotification(`Charger speed configured: ${type.toUpperCase()}`);
  };

  const handleChangeAccentColor = (color: string) => {
    setState((prev) => ({ ...prev, accentColor: color }));
  };

  const handleToggleSound = () => {
    setState((prev) => ({ ...prev, soundEffectsEnabled: !prev.soundEffectsEnabled }));
    showNotification(state.soundEffectsEnabled ? 'Web audio synthesized muted' : 'Audio sounds dynamic active');
  };

  const handleChangeVolume = (val: number) => {
    setState((prev) => ({ ...prev, ambientVolume: val }));
  };

  // Calculate speed multiplier based on hardware profiles
  const speedMultipliers: Record<ChargerType, number> = {
    standard: 1.0,
    fast: 1.8,
    super_fast: 2.8,
    hyper: 4.8,
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-100 flex flex-col justify-between py-10 px-4 md:px-8 overflow-x-hidden antialiased font-sans">
      
      {/* Absolute Dynamic Notification bar */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ y: -30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              className="px-5 py-2.5 rounded-full bg-neutral-900/90 text-white border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center space-x-2 text-[11px] font-medium tracking-wide text-center"
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: state.accentColor }} />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col justify-center">
        
        {/* Top Header Branding Row */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center justify-center md:justify-start space-x-2.5">
              <div 
                className="w-2.5 h-6 rounded-sm relative overflow-hidden transition-all duration-500"
                style={{ backgroundColor: state.accentColor, boxShadow: `0 0 10px ${state.accentColor}` }}
              />
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase font-sans">
                Charge Symbol Emulator
              </h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-lg md:max-w-md mx-auto md:mx-0 font-light leading-relaxed">
              Explore fluid, geometric, retro, and stellar animations mimicking fast charging behaviors and device thermodynamics.
            </p>
          </div>

          {/* Quick Stats banner */}
          <div className="flex justify-center md:justify-end items-center space-x-4 bg-white/[0.02] border border-white/5 py-2 px-4 rounded-2xl">
            <div className="text-center md:text-right">
              <span className="text-[10px] text-neutral-500 font-bold uppercase block">Coil Coupling</span>
              <span className={`text-xs font-semibold ${state.isPluggedIn ? 'text-emerald-400' : 'text-neutral-400'}`}>
                {state.isPluggedIn ? '⚡ CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="text-center md:text-right">
              <span className="text-[10px] text-neutral-500 font-bold uppercase block">Wattage Rate</span>
              <span className="text-xs font-semibold text-white">
                {state.isPluggedIn ? `${state.chargerType === 'standard' ? 5 : state.chargerType === 'fast' ? 18 : state.chargerType === 'super_fast' ? 45 : 120}W` : '0W'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Inner Dual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
          {/* Column A: Virtual Smartphone Emulator (Takes 5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center pt-2">
            <PhoneFrame
              batteryLevel={state.batteryLevel}
              isPluggedIn={state.isPluggedIn}
              selectedTheme={state.selectedTheme}
              accentColor={state.accentColor}
              speedMultiplier={speedMultipliers[state.chargerType]}
            />
          </div>

          {/* Column B: Control Dashboard Settings (Takes 7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ControlPanel
              state={state}
              onChangeTheme={handleChangeTheme}
              onChangeBattery={handleChangeBattery}
              onTogglePlug={handleTogglePlug}
              onChangeChargerType={handleChangeChargerType}
              onChangeAccentColor={handleChangeAccentColor}
              onToggleSound={handleToggleSound}
              onChangeVolume={handleChangeVolume}
            />
          </div>

        </div>

        {/* Real-time calculated thermodynamic specs */}
        <div className="mt-2 border-t border-white/5 pt-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: state.accentColor }} />
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-none">
              Live Diagnostic telemetry
            </h3>
          </div>
          <DiagnosticStats state={state} />
        </div>

      </div>

      {/* Decorative footer notes */}
      <footer className="mt-12 text-center text-[10px] text-neutral-600 font-medium select-none flex flex-col items-center gap-2">
        <div className="flex items-center space-x-1.5">
          <Shield className="w-3.5 h-3.5 opacity-60" />
          <span>Simulation Engine V1.4 Active // Sandbox Secure Cloud Ingress</span>
        </div>
        <div className="flex items-center space-x-3 text-[9px] text-neutral-700 font-mono mt-1">
          <span>COSMIC COLISEUM PROJECT</span>
          <span>•</span>
          <span>SPEED MULTIPLIER SCALER ENABLED</span>
        </div>
      </footer>
    </div>
  );
}
