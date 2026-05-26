export type ChargerType = 'standard' | 'fast' | 'super_fast' | 'hyper';

export interface ChargerConfig {
  name: string;
  wattage: number;
  voltage: number;
  amperage: number;
  multiplier: number; // speed multiplier
  color: string;
}

export type ChargingAnimationTheme = 
  | 'fluid_bubble' 
  | 'cyber_ring' 
  | 'aura_gradient' 
  | 'bolt_strike' 
  | 'retro_pixel' 
  | 'cosmic_nebula';

export interface ThemeConfig {
  id: ChargingAnimationTheme;
  name: string;
  description: string;
  icon: string; // lucide icon name
  primaryColor: string; // tailwind color class or hex
}

export interface EmulatorState {
  batteryLevel: number;
  isPluggedIn: boolean;
  selectedTheme: ChargingAnimationTheme;
  chargerType: ChargerType;
  accentColor: string; // hex
  ambientVolume: number; // 0 to 1
  soundEffectsEnabled: boolean;
  timeToFullMinutes: number | null;
  batteryHealth: 'Good' | 'Excellent' | 'Slightly Warm';
  batteryTempCelsius: number;
  currentAmps: number;
}
