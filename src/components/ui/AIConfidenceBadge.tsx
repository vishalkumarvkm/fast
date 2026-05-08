import { cn } from "@/lib/utils";

interface AIConfidenceBadgeProps {
  confidence: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getConfidenceConfig(confidence: number) {
  if (confidence >= 85) {
    return {
      label: "High",
      barClass: "bg-emerald-500 dark:bg-emerald-400",
      textClass: "text-emerald-700 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
      borderClass: "border-emerald-200 dark:border-emerald-800",
    };
  }
  if (confidence >= 70) {
    return {
      label: "Medium",
      barClass: "bg-amber-500 dark:bg-amber-400",
      textClass: "text-amber-700 dark:text-amber-400",
      bgClass: "bg-amber-50 dark:bg-amber-950/40",
      borderClass: "border-amber-200 dark:border-amber-800",
    };
  }
  return {
    label: "Low",
    barClass: "bg-red-500 dark:bg-red-400",
    textClass: "text-red-700 dark:text-red-400",
    bgClass: "bg-red-50 dark:bg-red-950/40",
    borderClass: "border-red-200 dark:border-red-800",
  };
}

export function AIConfidenceBadge({
  confidence,
  showLabel = true,
  size = "md",
  className,
}: AIConfidenceBadgeProps) {
  const config = getConfidenceConfig(confidence);
  const barWidth = Math.max(0, Math.min(100, confidence));

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-2 py-1 font-medium",
        config.bgClass,
        config.borderClass,
        size === "sm" && "px-1.5 py-0.5 text-xs",
        size === "lg" && "px-3 py-1.5",
        className,
      )}
      title={`AI Confidence: ${confidence}%`}
    >
      <span className="text-xs">🤖</span>
      <div
        className={cn(
          "rounded-full bg-border",
          size === "sm"
            ? "h-1 w-12"
            : size === "lg"
              ? "h-2 w-20"
              : "h-1.5 w-16",
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            config.barClass,
          )}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <span className={cn("tabular-nums text-xs", config.textClass)}>
        {confidence}%
      </span>
      {showLabel && (
        <span className={cn("text-xs", config.textClass)}>{config.label}</span>
      )}
    </div>
  );
}
