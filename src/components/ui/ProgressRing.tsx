import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  valueDisplay?: string;
  color?: "primary" | "accent" | "success" | "warning" | "danger";
  className?: string;
}

const STROKE_COLORS = {
  primary: {
    light: "oklch(0.42 0.14 240)",
    dark: "oklch(0.75 0.12 240)",
    track: "oklch(0.9 0.008 230)",
    darkTrack: "oklch(0.28 0.02 230)",
  },
  accent: {
    light: "oklch(0.6 0.15 170)",
    dark: "oklch(0.7 0.14 170)",
    track: "oklch(0.9 0.008 230)",
    darkTrack: "oklch(0.28 0.02 230)",
  },
  success: {
    light: "oklch(0.6 0.16 150)",
    dark: "oklch(0.7 0.16 150)",
    track: "oklch(0.9 0.008 230)",
    darkTrack: "oklch(0.28 0.02 230)",
  },
  warning: {
    light: "oklch(0.72 0.15 85)",
    dark: "oklch(0.75 0.18 85)",
    track: "oklch(0.9 0.008 230)",
    darkTrack: "oklch(0.28 0.02 230)",
  },
  danger: {
    light: "oklch(0.55 0.22 25)",
    dark: "oklch(0.65 0.19 22)",
    track: "oklch(0.9 0.008 230)",
    darkTrack: "oklch(0.28 0.02 230)",
  },
};

export function ProgressRing({
  value,
  max,
  size = 80,
  strokeWidth = 7,
  label,
  sublabel,
  valueDisplay,
  color = "primary",
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const center = size / 2;
  const colors = STROKE_COLORS[color];
  const displayValue = valueDisplay ?? `${Math.round(percentage)}%`;

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          role="img"
          aria-label={`${label}: ${displayValue}`}
        >
          {/* Track light */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="dark:hidden"
            stroke={colors.track}
          />
          {/* Track dark */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="hidden dark:block"
            stroke={colors.darkTrack}
          />
          {/* Progress light */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="dark:hidden transition-all duration-700 ease-out"
            stroke={colors.light}
          />
          {/* Progress dark */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="hidden dark:block transition-all duration-700 ease-out"
            stroke={colors.dark}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold font-display text-foreground leading-none">
            {displayValue}
          </span>
          {sublabel && (
            <span className="text-[9px] text-muted-foreground mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className="text-xs font-medium text-muted-foreground text-center leading-tight">
          {label}
        </span>
      )}
    </div>
  );
}
