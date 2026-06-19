"use client";

import { useRef, useState } from "react";

const COLORS = [
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#a3e635",
  "#34d399",
  "#22d3ee",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
];

// Rounding avoids a React hydration mismatch: the server and browser can
// land on a different last decimal digit for the same trig calculation.
function round(value: number) {
  return Math.round(value * 100) / 100;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: round(cx + r * Math.cos(angleRad)),
    y: round(cy + r * Math.sin(angleRad)),
  };
}

function describeSlice(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

type Restaurant = {
  id: string;
  displayName: { text: string; languageCode: string };
};

export default function Wheel({ restaurants }: { restaurants: Restaurant[] }) {
  const n = restaurants.length;
  const segmentAngle = 360 / n;
  const size = 340;
  const center = size / 2;
  const radius = size / 2 - 10;

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Restaurant | null>(null);
  const spinCountRef = useRef(0);

  function handleSpin() {
    if (spinning) return;
    setWinner(null);
    setSpinning(true);

    const winnerIndex = Math.floor(Math.random() * n);
    const winnerCenterAngle = winnerIndex * segmentAngle + segmentAngle / 2;

    spinCountRef.current += 1;
    const fullSpins = 5 * 360 * spinCountRef.current;
    setRotation(fullSpins - winnerCenterAngle);

    setTimeout(() => {
      setSpinning(false);
      setWinner(restaurants[winnerIndex]);
    }, 4000);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "20px solid #1f2937",
          }}
        />
        <svg
          width={size}
          height={size}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
          }}
        >
          {restaurants.map((restaurant, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = startAngle + segmentAngle;
            const midAngle = startAngle + segmentAngle / 2;

            // polarToCartesian treats 0deg as "up" and goes clockwise, but
            // SVG's rotate() treats 0deg as "right" (East). Subtracting 90
            // converts between the two so the label sits along the same
            // radius line as its slice instead of tangent to the rim.
            const baseRotation = midAngle - 90;
            // Past the West side the label would render upside down, so
            // flip it 180 degrees and anchor from the other end.
            const upsideDown = midAngle > 180 && midAngle < 360;
            const labelRotation = upsideDown ? baseRotation + 180 : baseRotation;

            const labelPos = polarToCartesian(
              center,
              center,
              radius * 0.62,
              midAngle
            );

            const name = restaurant.displayName.text;
            const label = name.length > 16 ? `${name.slice(0, 15)}…` : name;

            return (
              <g key={restaurant.id}>
                <path
                  d={describeSlice(center, center, radius, startAngle, endAngle)}
                  fill={COLORS[i % COLORS.length]}
                  stroke="white"
                  strokeWidth={1}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  fontSize={10}
                  fontWeight={600}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${labelRotation}, ${labelPos.x}, ${labelPos.y})`}
                  fill="#1f2937"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <button
        onClick={handleSpin}
        disabled={spinning}
        className="rounded-full bg-black px-6 py-2 text-white disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "Spin the Wheel"}
      </button>
      {winner && (
        <p className="text-lg font-medium">🎉 {winner.displayName.text}</p>
      )}
    </div>
  );
}
