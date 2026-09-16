import clsx from 'clsx';

interface IntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  color?: string;
}

function intensityColor(value: number): string {
  if (value >= 80) return 'text-cyan-400';
  if (value >= 60) return 'text-blue-400';
  if (value >= 40) return 'text-purple-400';
  return 'text-slate-400';
}

function intensityLabel(value: number): string {
  if (value >= 90) return 'Extreme';
  if (value >= 75) return 'Strong';
  if (value >= 60) return 'Moderate';
  if (value >= 40) return 'Light';
  return 'Minimal';
}

export function IntensitySlider({ value, onChange, label, color }: IntensitySliderProps) {
  const percentage = value;
  const fillColor = color || '#06b6d4';

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">{label}</span>
          <span className={clsx('text-sm font-mono font-bold', intensityColor(value))}>
            {intensityLabel(value)} — {value}%
          </span>
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percentage}%, #1e2d3d ${percentage}%, #1e2d3d 100%)`,
          }}
          aria-label={label || 'Intensity'}
          aria-valuenow={value}
          aria-valuemin={10}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
