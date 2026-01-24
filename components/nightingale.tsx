"use client";

import { useEffect, useState } from "react";

interface NightingaleProps {
  show?: boolean;
  onComplete?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Nightingale({
  show = true,
  onComplete,
  size = "md",
  className = "",
}: NightingaleProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show && !isAnimating) return null;

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${className}`}
      style={{
        animation: isAnimating ? "nightingaleFlyIn 0.8s ease-out forwards" : "none",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        aria-label="Nightingale celebration"
      >
        {/* Bird body */}
        <ellipse
          cx="50"
          cy="55"
          rx="20"
          ry="18"
          className="fill-persian-gold-500"
        >
          <animate
            attributeName="ry"
            values="18;16;18"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Head */}
        <circle
          cx="65"
          cy="42"
          r="12"
          className="fill-persian-gold-400"
        />

        {/* Beak */}
        <path
          d="M77 42L88 40L77 44Z"
          className="fill-persian-red-600"
        >
          <animate
            attributeName="d"
            values="M77 42L88 40L77 44Z;M77 42L88 42L77 44Z;M77 42L88 40L77 44Z"
            dur="0.3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Eye */}
        <circle cx="68" cy="40" r="2" className="fill-gray-900" />
        <circle cx="69" cy="39" r="0.5" className="fill-white" />

        {/* Wing */}
        <path
          d="M35 50C30 45 25 50 20 55C25 52 30 48 40 55C45 60 50 55 45 50Z"
          className="fill-persian-gold-600"
        >
          <animate
            attributeName="d"
            values="M35 50C30 45 25 50 20 55C25 52 30 48 40 55C45 60 50 55 45 50Z;M35 45C25 35 15 45 10 55C20 48 28 42 40 50C48 55 50 50 45 45Z;M35 50C30 45 25 50 20 55C25 52 30 48 40 55C45 60 50 55 45 50Z"
            dur="0.4s"
            repeatCount="indefinite"
          />
        </path>

        {/* Tail feathers */}
        <path
          d="M30 60L15 70L20 62L10 75L25 65L30 60Z"
          className="fill-persian-gold-600"
        />

        {/* Legs */}
        <line x1="45" y1="70" x2="42" y2="85" stroke="#8B4513" strokeWidth="2" />
        <line x1="55" y1="70" x2="58" y2="85" stroke="#8B4513" strokeWidth="2" />

        {/* Musical notes */}
        <g className="fill-persian-red-400" opacity="0.8">
          <path d="M82 25C82 23 84 21 86 21L86 30C85 31 83 31 82 30Z">
            <animate
              attributeName="opacity"
              values="0;0.8;0"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="transform"
              values="translate(0,0);translate(5,-10)"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M90 30C90 28 92 26 94 26L94 35C93 36 91 36 90 35Z">
            <animate
              attributeName="opacity"
              values="0;0.6;0"
              dur="1.2s"
              repeatCount="indefinite"
              begin="0.3s"
            />
            <animate
              attributeName="transform"
              values="translate(0,0);translate(3,-12)"
              dur="1.2s"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </path>
        </g>
      </svg>

      <style jsx>{`
        @keyframes nightingaleFlyIn {
          0% {
            transform: translateX(100px) translateY(-50px) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translateX(0) translateY(-10px) scale(1.1);
            opacity: 1;
          }
          70% {
            transform: translateX(0) translateY(0) scale(1);
          }
          100% {
            transform: translateX(0) translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Simpler static nightingale icon for badges
export function NightingaleIcon({
  className = "",
  color = "gold",
}: {
  className?: string;
  color?: "gold" | "red" | "turquoise";
}) {
  const colorClasses = {
    gold: "text-persian-gold-500",
    red: "text-persian-red-500",
    turquoise: "text-persian-turquoise-500",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${colorClasses[color]} ${className}`}
      aria-hidden="true"
    >
      {/* Simplified bird silhouette */}
      <path d="M12 4C10 4 8 6 8 8C8 10 9 11 10 12L8 14L6 13L4 15L6 16L5 18L7 17L9 19L11 17L13 18C15 18 17 16 17 14C17 12 16 11 15 10L18 7L20 8L22 6L20 5L21 3L19 4L17 2L15 4L13 3C13 3 12.5 4 12 4ZM14 9C14.5 9 15 9.5 15 10C15 10.5 14.5 11 14 11C13.5 11 13 10.5 13 10C13 9.5 13.5 9 14 9Z" />
    </svg>
  );
}
