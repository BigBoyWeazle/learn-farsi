"use client";

interface CarpetProgressProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function CarpetProgress({
  value,
  className = "",
  showLabel = false,
  size = "md",
}: CarpetProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeClasses = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-persian-red-700 font-medium">Progress</span>
          <span className="text-persian-red-500 font-bold">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div
        className={`w-full ${sizeClasses[size]} bg-persian-beige-100 dark:bg-gray-700 rounded-full overflow-hidden relative`}
      >
        {/* Background pattern (unfilled) */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 4px,
              currentColor 4px,
              currentColor 5px
            )`,
          }}
        />

        {/* Filled carpet pattern */}
        <div
          className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${clampedValue}%` }}
        >
          {/* Woven carpet gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                90deg,
                #cd7171 0%,
                #b85c5c 25%,
                #cd7171 50%,
                #b85c5c 75%,
                #cd7171 100%
              )`,
              backgroundSize: "20px 100%",
            }}
          />

          {/* Diamond pattern overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #f0c674 25%, transparent 25%),
                linear-gradient(-45deg, #f0c674 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #f0c674 75%),
                linear-gradient(-45deg, transparent 75%, #f0c674 75%)
              `,
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
            }}
          />

          {/* Subtle turquoise accent line */}
          <div
            className="absolute top-1/2 left-0 right-0 h-px opacity-40"
            style={{
              background: "linear-gradient(90deg, transparent, #14b8a6, transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Circular progress variant (for achievements)
export function CarpetProgressCircle({
  value,
  size = 80,
  strokeWidth = 8,
  className = "",
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-persian-beige-200 dark:text-gray-700"
        />

        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id="carpet-circle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cd7171" />
            <stop offset="50%" stopColor="#f0c674" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#carpet-circle-gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-persian-red-600 dark:text-persian-gold-400 font-bold text-lg">
          {Math.round(clampedValue)}%
        </span>
      </div>
    </div>
  );
}
