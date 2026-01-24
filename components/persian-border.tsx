"use client";

interface PersianBorderProps {
  className?: string;
  color?: "red" | "gold" | "turquoise";
  variant?: "geometric" | "simple" | "dots";
}

export function PersianBorder({
  className = "",
  color = "red",
  variant = "geometric",
}: PersianBorderProps) {
  const colorClasses = {
    red: "text-persian-red-500",
    gold: "text-persian-gold-500",
    turquoise: "text-persian-turquoise-500",
  };

  if (variant === "simple") {
    return (
      <div className={`w-full flex items-center justify-center gap-4 py-4 ${className}`}>
        <div className={`flex-1 h-px bg-current ${colorClasses[color]} opacity-30`} />
        <svg
          className={`w-8 h-8 ${colorClasses[color]}`}
          viewBox="0 0 32 32"
          fill="currentColor"
          aria-hidden="true"
        >
          {/* 8-pointed star */}
          <path d="M16 0L18.5 13.5L32 16L18.5 18.5L16 32L13.5 18.5L0 16L13.5 13.5L16 0Z" />
        </svg>
        <div className={`flex-1 h-px bg-current ${colorClasses[color]} opacity-30`} />
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={`w-full flex items-center justify-center gap-2 py-4 ${className}`}>
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${colorClasses[color]} ${
              i === 3 ? "opacity-100 scale-125" : "opacity-40"
            }`}
            style={{ backgroundColor: "currentColor" }}
          />
        ))}
      </div>
    );
  }

  // Geometric pattern (default)
  return (
    <div className={`w-full py-4 ${className}`} aria-hidden="true">
      <svg
        className="w-full h-8"
        viewBox="0 0 400 32"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          {/* Gradient for depth */}
          <linearGradient id={`border-gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.6" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Central line */}
        <line
          x1="0"
          y1="16"
          x2="400"
          y2="16"
          stroke="currentColor"
          strokeWidth="1"
          className={colorClasses[color]}
          opacity="0.3"
        />

        {/* Repeating geometric pattern */}
        <g className={colorClasses[color]} fill="currentColor">
          {/* Left decorative elements */}
          <path d="M40 16L44 12L48 16L44 20Z" opacity="0.4" />
          <path d="M80 16L84 12L88 16L84 20Z" opacity="0.5" />
          <path d="M120 16L124 12L128 16L124 20Z" opacity="0.6" />

          {/* Center - 8-pointed star */}
          <g transform="translate(184, 0)">
            <path
              d="M16 4L18 14L28 16L18 18L16 28L14 18L4 16L14 14Z"
              opacity="0.8"
            />
            {/* Inner diamond */}
            <path
              d="M16 10L18 14L22 16L18 18L16 22L14 18L10 16L14 14Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.4"
            />
          </g>

          {/* Right decorative elements */}
          <path d="M272 16L276 12L280 16L276 20Z" opacity="0.6" />
          <path d="M312 16L316 12L320 16L316 20Z" opacity="0.5" />
          <path d="M352 16L356 12L360 16L356 20Z" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
}

// Vertical border variant
export function PersianBorderVertical({
  className = "",
  color = "red",
}: Omit<PersianBorderProps, "variant">) {
  const colorClasses = {
    red: "text-persian-red-500",
    gold: "text-persian-gold-500",
    turquoise: "text-persian-turquoise-500",
  };

  return (
    <div className={`h-full flex flex-col items-center justify-center gap-2 px-4 ${className}`} aria-hidden="true">
      <div className={`flex-1 w-px bg-current ${colorClasses[color]} opacity-30`} />
      <svg
        className={`w-6 h-6 ${colorClasses[color]}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z" />
      </svg>
      <div className={`flex-1 w-px bg-current ${colorClasses[color]} opacity-30`} />
    </div>
  );
}

// Corner decoration
export function PersianCorner({
  position = "top-left",
  color = "gold",
  size = "md",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: "red" | "gold" | "turquoise";
  size?: "sm" | "md" | "lg";
}) {
  const colorClasses = {
    red: "text-persian-red-500",
    gold: "text-persian-gold-500",
    turquoise: "text-persian-turquoise-500",
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} ${colorClasses[color]} opacity-40`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" fill="currentColor" className="w-full h-full">
        {/* Paisley-inspired corner ornament */}
        <path d="M0 0L24 0C12 8 4 16 0 24Z" opacity="0.6" />
        <path d="M0 0L16 0C8 6 2 12 0 16Z" opacity="0.4" />
        <circle cx="8" cy="8" r="2" opacity="0.8" />
      </svg>
    </div>
  );
}
