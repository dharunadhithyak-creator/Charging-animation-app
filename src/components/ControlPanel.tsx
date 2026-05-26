import { motion } from 'motion/react';
import { 
  Zap, 
  Settings, 
  Volume2, 
  VolumeX, 
  Thermometer, 
  Flame, 
  Gauge, 
  Smartphone,
  Sparkles,
  Cpu,
  Tv,
  Infinity,
  Hammer
} from 'lucide-react';
import { ChargingAnimationTheme, EmulatorState, ChargerType } from '../types';

interface ControlPanelProps {
  state: EmulatorState;
  onChangeTheme: (theme: ChargingAnimationTheme) => void;
  onChangeBattery: (level: number) => void;
  onTogglePlug: () => void;
  onChangeChargerType: (type: ChargerType) => void;
  onChangeAccentColor: (color: string) => void;
  onToggleSound: () => void;
  onChangeVolume: (val: number) => void;
}

const THEMES: { id: ChargingAnimationTheme; name: string; desc: string; icon: any }[] = [
  { id: 'fluid_bubble', name: 'Fluid Bubble', desc: 'Elegant floating liquid physics bubbles', icon: Sparkles },
  { id: 'cyber_ring', name: 'Cyber HUD Ring', desc: 'Futuristic rotating diagnostic rings & dails', icon: Cpu },
  { id: 'aura_gradient', name: 'Aura Gradient', desc: 'Luminescent luxury morphing gas meshes', icon: Tv },
  { id: 'bolt_strike', name: 'Bolt Strike', desc: 'Arced lightning strikes & shockwave rings', icon: Flame },
  { id: 'retro_pixel', name: 'Retro Pixel', desc: '8-bit arcade styled chunky block charges', icon: Hammer },
  { id: 'cosmic_nebula', name: 'Galaxy Cosmic', desc: 'Celestial starfield & planet orbits', icon: Infinity },
];

const SPEED_PRESETS: { id: ChargerType; label: string; watts: number; multiplier: number; desc: string }[] = [
  { id: 'standard', label: 'Standard 5W', watts: 5, multiplier: 1.0, desc: 'Normal speed' },
  { id: 'fast', label: 'QC Fast 18W', watts: 18, multiplier: 1.6, desc: 'Quick charge pulse' },
  { id: 'super_fast', label: 'Super Dart 45W', watts: 45, multiplier: 2.8, desc: 'Rapid stream' },
  { id: 'hyper', label: 'HyperCharge 120W', watts: 120, multiplier: 4.5, desc: 'Supercharged power' },
];

const ACCENT_COLORS = [
  { label: 'Neon Green', value: '#22c55e' },
  { label: 'Cyber Blue', value: '#3b82f6' },
  { label: 'Enigma Pink', value: '#ec4899' },
  { label: 'Liquid Gold', value: '#f59e0b' },
  { label: 'Deep Lavender', value: '#a855f7' },
];

export default function ControlPanel({
  state,
  onChangeTheme,
  onChangeBattery,
  onTogglePlug,
  onChangeChargerType,
  onChangeAccentColor,
  onToggleSound,
  onChangeVolume,
}: ControlPanelProps) {
  return (
    <div className="w-full flex flex-col gap-6 select-none">
      
      {/* Simulation Power Switch */}
      <div className="relative p-5 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/5 shadow-lg flex items-center justify-between">
        <div className="flex-1 pr-4">
          <h4 className="text-sm font-semibold text-white flex items-center space-x-1.5 leading-none">
            <Smartphone className="w-4 h-4 text-neutral-400" />
            <span>Power Coupling Status</span>
          </h4>
          <p className="text-[11px] text-neutral-400 mt-1">
            {state.isPluggedIn 
              ? 'Charger is physically plugged in and supplying wattage' 
              : 'Device is running on battery. Plug in to start emulator.'
            }
          </p>
        </div>
        
        <motion.button
          id="btn-power-coupling"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onTogglePlug}
          className={`relative px-5 py-3 h-12 rounded-2xl flex items-center justify-center space-x-2 font-bold text-xs uppercase tracking-wide cursor-pointer shadow-md transition-all duration-300 ${
            state.isPluggedIn
              ? 'bg-[#ef4444]/15 border border-[#ef4444]/40 text-[#ef4444] shadow-[#ef4444]/10'
              : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
          }`}
        >
          <Zap className={`w-4 h-4 ${state.isPluggedIn ? 'animate-bounce' : ''}`} />
          <span>{state.isPluggedIn ? 'Disconnect' : 'Connect USB-C'}</span>
        </motion.button>
      </div>

      {/* Charging Animation Themes Grid */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-widest flex items-center space-x-1.5 leading-none">
            <Settings className="w-3.5 h-3.5" />
            <span>Select Charging Theme</span>
          </h3>
          <span className="text-[10px] bg-white/5 text-neutral-400 px-2.5 py-0.5 rounded-full font-semibold">
            {THEMES.length} styles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {THEMES.map((theme) => {
            const Icon = theme.icon;
            const isSelected = state.selectedTheme === theme.id;
            return (
              <motion.button
                key={theme.id}
                id={`theme-btn-${theme.id}`}
                whileHover={{ y: -1.5, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onChangeTheme(theme.id)}
                className={`flex gap-3.5 p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-300 bg-white/[0.015] hover:bg-white/[0.035] ${
                  isSelected 
                    ? 'border-neutral-500 bg-white/[0.04]' 
                    : 'border-white/5 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Icon Circle */}
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 self-start shrink-0"
                  style={{
                    borderColor: isSelected ? state.accentColor : 'rgba(255,255,255,0.05)',
                    backgroundColor: isSelected ? `${state.accentColor}11` : 'rgba(255,255,255,0.02)',
                    color: isSelected ? state.accentColor : '#9ca3af'
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Theme text */}
                <div className="flex flex-col justify-between">
                  <span className={`text-[13px] font-bold tracking-tight ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                    {theme.name}
                  </span>
                  <p className="text-[10px] text-neutral-400 leading-tight mt-0.5">
                    {theme.desc}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Speed & Amperage Selection */}
      <div className="p-5 rounded-3xl border border-white/5 bg-white/[0.015] flex flex-col gap-3.5">
        <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-widest flex items-center space-x-1.5 leading-none">
          <Gauge className="w-3.5 h-3.5" />
          <span>Charger Wattage Speed</span>
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {SPEED_PRESETS.map((preset) => {
            const isSelected = state.chargerType === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onChangeChargerType(preset.id)}
                className={`py-2 px-3 rounded-xl border text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-neutral-500 bg-white/[0.05] text-white'
                    : 'border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <span className="text-[11px] font-bold">{preset.label}</span>
                <span className="text-[9px] opacity-50 mt-0.5">{preset.multiplier.toFixed(1)}x animation</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulated Battery Sliding State */}
      <div className="p-5 rounded-3xl border border-white/5 bg-white/[0.015] flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-widest flex items-center space-x-1.5 leading-none">
            <Thermometer className="w-3.5 h-3.5" />
            <span>Battery Charge Level</span>
          </h3>
          <span className="text-lg font-mono font-bold" style={{ color: state.accentColor }}>
            {state.batteryLevel}%
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs text-neutral-500 font-medium">0%</span>
          <input
            id="slider-battery-level"
            type="range"
            min="0"
            max="100"
            value={state.batteryLevel}
            onChange={(e) => onChangeBattery(Number(e.target.value))}
            className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <span className="text-xs text-neutral-500 font-medium font-mono">100%</span>
        </div>
      </div>

      {/* Aura Color Customizer */}
      <div className="p-5 rounded-3xl border border-white/5 bg-white/[0.015] flex flex-col gap-3">
        <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-widest leading-none">
          Emulation Accent Color
        </h3>
        
        <div className="flex flex-wrap gap-2.5 items-center mt-1">
          {ACCENT_COLORS.map((color) => {
            const isSelected = state.accentColor.toLowerCase() === color.value;
            return (
              <button
                key={color.value}
                onClick={() => onChangeAccentColor(color.value)}
                title={color.label}
                className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-300 relative ${
                  isSelected ? 'scale-110 shadow-lg' : 'opacity-70 hover:opacity-100Scale-100'
                }`}
                style={{ 
                  backgroundColor: color.value,
                  boxShadow: isSelected ? `0 0 12px ${color.value}` : 'none'
                }}
              >
                {isSelected && (
                  <span className="absolute inset-1 rounded-full border-2 border-white/80" />
                )}
              </button>
            );
          })}
          
          {/* Custom color input */}
          <div className="flex items-center bg-white/5 rounded-full px-2.5 py-1 text-[11px] font-medium border border-white/5 space-x-1.5">
            <input
              id="color-picker-custom"
              type="color"
              value={state.accentColor}
              onChange={(e) => onChangeAccentColor(e.target.value)}
              className="w-5 h-5 rounded-full border-0 cursor-pointer overflow-hidden p-0 bg-transparent shrink-0"
            />
            <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase">
              {state.accentColor}
            </span>
          </div>
        </div>
      </div>

      {/* Sound Options Card */}
      <div className="p-5 rounded-3xl border border-white/5 bg-white/[0.015] flex flex-col gap-3.5">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-widest leading-none">
            Synthesized Chimes Volume
          </h3>
          
          <button 
            onClick={onToggleSound}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
          >
            {state.soundEffectsEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <VolumeX className="w-4 h-4 text-neutral-500" />
          <input
            id="slider-synth-volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            disabled={!state.soundEffectsEnabled}
            value={state.soundEffectsEnabled ? state.ambientVolume : 0}
            onChange={(e) => onChangeVolume(Number(e.target.value))}
            className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white disabled:opacity-30"
          />
          <Volume2 className="w-4 h-4 text-neutral-400" />
        </div>
      </div>

    </div>
  );
}
