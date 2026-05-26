import { Lightning } from 'lucide-react';
import { EmulatorState } from '../types';
import { useEffect, useState } from 'react';

interface DiagnosticStatsProps {
  state: EmulatorState;
}

export default function DiagnosticStats({ state }: DiagnosticStatsProps) {
  const [liveAmps, setLiveAmps] = useState(0);
  const [liveTemp, setLiveTemp] = useState(28.4);
  const [liveVoltage, setLiveVoltage] = useState(3.8);

  // Dynamic simulation loop for realistic, live-ticking physics
  useEffect(() => {
    const interval = setInterval(() => {
      if (!state.isPluggedIn) {
        // Slow cooling down loop to baseline 27.5C, 0mA current flow, 3.7V baseline
        setLiveTemp((prev) => Math.max(26.2, prev - 0.05 + (Math.random() - 0.5) * 0.02));
        setLiveAmps(0);
        setLiveVoltage((prev) => Math.max(3.6, prev - 0.01 + (Math.random() - 0.5) * 0.005));
      } else {
        // Charging thermodynamics simulation:
        // Super/Hyper chargers heat up the battery more, up to e.g. 41C
        let targetTemp = 30.5; // standard
        let ampBase = 1200; // mA
        let voltBase = 4.0; // V

        if (state.chargerType === 'fast') {
          targetTemp = 34.2;
          ampBase = 2200;
          voltBase = 4.15;
        } else if (state.chargerType === 'super_fast') {
          targetTemp = 37.8;
          ampBase = 4500;
          voltBase = 4.3;
        } else if (state.chargerType === 'hyper') {
          targetTemp = 41.5;
          ampBase = 6800;
          voltBase = 4.45;
        }

        // Apply realistic trickle charging:
        // Once battery level gets above 80%, reduce current (amps) progressively
        if (state.batteryLevel > 80) {
          const factor = (100 - state.batteryLevel) / 20; // 1 down to 0
          ampBase = ampBase * Math.max(0.12, factor);
          targetTemp = Math.max(30.0, targetTemp * Math.max(0.8, factor));
        }

        setLiveTemp((prev) => {
          const diff = targetTemp - prev;
          return prev + (diff * 0.08) + (Math.random() - 0.5) * 0.04;
        });

        // Add minor electrical noise
        setLiveAmps(Math.round(ampBase + (Math.random() - 0.5) * 20));
        setLiveVoltage(voltBase + (Math.random() - 0.5) * 0.01);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [state.isPluggedIn, state.chargerType, state.batteryLevel]);

  // Compute calculated time remaining in minutes
  const computeTimeRemaining = () => {
    if (!state.isPluggedIn) return 'N/A';
    if (state.batteryLevel >= 100) return 'Fully Charged';

    const remainingPercent = 100 - state.batteryLevel;
    let ratePerMinute = 0.5; // standard

    if (state.chargerType === 'fast') ratePerMinute = 1.3;
    if (state.chargerType === 'super_fast') ratePerMinute = 2.4;
    if (state.chargerType === 'hyper') ratePerMinute = 4.5;

    // Accounts for slow trickle charging above 80%
    let calculatedMinutes = remainingPercent / ratePerMinute;
    if (state.batteryLevel > 80) {
      calculatedMinutes = calculatedMinutes * 1.8; // slows down
    }

    const mins = Math.max(1, Math.round(calculatedMinutes));
    return `${mins} min`;
  };

  const getThermometerColor = (temp: number) => {
    if (temp < 32) return 'text-[#22c55e]';
    if (temp < 39) return 'text-[#f59e0b]';
    return 'text-[#ef4444]';
  };

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
      {/* Rate of Charge / Amps */}
      <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col justify-between">
        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
          Current Stream
        </span>
        <div className="flex items-baseline space-x-1 mt-2">
          <span 
            className="text-2xl font-extrabold tracking-tight font-sans transition-all duration-300"
            style={{ color: state.isPluggedIn ? state.accentColor : '#9ca3af' }}
          >
            {liveAmps > 0 ? `+${liveAmps}` : '0'}
          </span>
          <span className="text-[10px] text-neutral-400 font-bold font-mono">mA</span>
        </div>
        <p className="text-[9px] text-neutral-500 mt-1 leading-none font-medium">
          {state.isPluggedIn && state.batteryLevel > 80 ? 'Trickle state active' : state.isPluggedIn ? 'Amperage coupling' : 'Discharging idle'}
        </p>
      </div>

      {/* Temperature */}
      <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col justify-between">
        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
          Battery Temp
        </span>
        <div className="flex items-baseline space-x-0.5 mt-2">
          <span className={`text-2xl font-extrabold tracking-tight font-sans ${getThermometerColor(liveTemp)}`}>
            {liveTemp.toFixed(1)}
          </span>
          <span className="text-[10.5px] text-neutral-400 font-bold font-mono">°C</span>
        </div>
        <p className="text-[9px] text-neutral-500 mt-1 leading-none font-medium">
          {liveTemp < 32 ? 'Cool & Stable' : liveTemp < 39 ? 'Warming up' : 'Thermal high-load'}
        </p>
      </div>

      {/* Volts */}
      <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col justify-between">
        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
          Input Voltage
        </span>
        <div className="flex items-baseline space-x-0.5 mt-2">
          <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
            {liveVoltage.toFixed(2)}
          </span>
          <span className="text-[10px] text-neutral-400 font-bold font-mono">V</span>
        </div>
        <p className="text-[9px] text-neutral-500 mt-1 leading-none font-medium">
          {state.isPluggedIn ? 'Power line standard' : 'Cell node default'}
        </p>
      </div>

      {/* Charge Time Estimate */}
      <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col justify-between">
        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
          Time To Full
        </span>
        <div className="flex items-baseline space-x-1 mt-2">
          <span className="text-2xl font-extrabold tracking-tight font-sans text-white truncate max-w-full">
            {computeTimeRemaining()}
          </span>
        </div>
        <p className="text-[9px] text-neutral-500 mt-1 leading-none font-medium">
          {state.isPluggedIn ? 'Calc. by watt-curve' : 'Connect charger'}
        </p>
      </div>
    </div>
  );
}
