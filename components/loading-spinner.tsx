"use client";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  message = "Loading...",
  size = "md"
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Pomegranate */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Pomegranate body with pulse */}
        <div className="absolute inset-0 animate-pulse">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Main pomegranate body */}
            <ellipse
              cx="50"
              cy="55"
              rx="35"
              ry="38"
              className="fill-persian-red-500"
            />
            {/* Crown/calyx */}
            <path
              d="M35 22 L40 30 L45 18 L50 28 L55 18 L60 30 L65 22 L62 35 L38 35 Z"
              className="fill-persian-red-700"
            />
            {/* Highlight */}
            <ellipse
              cx="38"
              cy="45"
              rx="8"
              ry="12"
              className="fill-persian-red-400 opacity-50"
            />
          </svg>
        </div>

        {/* Spinning ring around pomegranate */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s" }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="30 70"
              className="text-persian-gold-500"
            />
          </svg>
        </div>

        {/* Second spinning ring (opposite direction) */}
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "3s", animationDirection: "reverse" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="20 80"
              className="text-persian-red-300"
            />
          </svg>
        </div>
      </div>

      {/* Loading text */}
      {message && (
        <p className={`text-persian-red-700 dark:text-persian-beige-200 font-medium ${textSizeClasses[size]}`}>
          {message}
        </p>
      )}
    </div>
  );
}

// Full page loading component
export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <LoadingSpinner message={message} size="md" />
    </div>
  );
}
