"use client";
import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    let phi = 0;
    let ringAngle = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1200,
      height: 1200,
      phi: 0,
      theta: 0.25,               // More tilt = more dimensional
      dark: 0,                   // Light mode — ocean transparent
      diffuse: 1.5,              // Softer, more volumetric lighting
      mapSamples: 40000,         // Higher detail landmass edges
      mapBrightness: 14,         // Brighter, more defined continents
      baseColor: [0.10, 0.16, 0.26], // Rich deep navy (barely visible dots)
      markerColor: [0.85, 0.72, 0.30], // Warm gold markers
      glowColor: [0.93, 0.90, 0.85],   // Soft cream glow
      markers: [
        // North America
        { location: [40.7128, -74.0060], size: 0.08 }, // New York
        { location: [34.0522, -118.2437], size: 0.06 }, // LA
        { location: [43.6510, -79.3470], size: 0.05 }, // Toronto
        
        // Europe
        { location: [51.5072, -0.1276], size: 0.08 }, // London
        { location: [48.8566, 2.3522], size: 0.06 }, // Paris
        { location: [52.5200, 13.4050], size: 0.05 }, // Berlin
        { location: [41.9028, 12.4964], size: 0.04 }, // Rome
        
        // Asia Pacific
        { location: [31.2304, 121.4737], size: 0.09 }, // Shanghai (HQ)
        { location: [22.5431, 114.0579], size: 0.07 }, // Shenzhen
        { location: [35.6762, 139.6503], size: 0.08 }, // Tokyo
        { location: [37.5665, 126.9780], size: 0.06 }, // Seoul
        { location: [1.3521, 103.8198], size: 0.07 }, // Singapore
        { location: [13.7563, 100.5018], size: 0.05 }, // Bangkok
        
        // Middle East & Others
        { location: [25.2048, 55.2708], size: 0.06 }, // Dubai
        { location: [-33.8688, 151.2093], size: 0.06 }, // Sydney
      ],
    });

    let currentReq: number;
    const render = () => {
      if (pointerInteracting.current === null) {
        phi += 0.003;
        ringAngle -= 0.0015;
      }
      globe.update({ phi: phi + pointerInteractionMovement.current });

      if (ringRef.current) {
        ringRef.current.style.transform = `rotateX(65deg) rotateZ(${ringAngle}rad)`;
      }

      currentReq = requestAnimationFrame(render);
    };
    currentReq = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(currentReq);
      globe.destroy();
    };
  }, []);

  return (
    <div className="w-full h-full aspect-square flex items-center justify-center relative cursor-grab active:cursor-grabbing mx-auto">
      {/* Ambient glow ring behind the globe */}
      <div
        className="absolute w-[90%] h-[90%] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(212,168,75,0.12) 0%, rgba(212,168,75,0.04) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Outer decorative glow ring */}
      <div
        className="absolute w-[80%] h-[80%] rounded-full pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at center, transparent 55%, rgba(212,168,75,0.08) 60%, transparent 70%)",
        }}
      />

      {/* Orbital ring */}
      <div
        ref={ringRef}
        className="absolute w-[88%] h-[88%] pointer-events-none"
        style={{ transformStyle: "preserve-3d", perspective: "800px" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="20%" stopColor="#D4AF37" stopOpacity="0.15" />
              <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#F5D68E" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.5" />
              <stop offset="80%" stopColor="#D4AF37" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Main solid ring */}
          <ellipse
            cx="100"
            cy="100"
            rx="90"
            ry="26"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="0.3"
            opacity="0.5"
          />
          {/* Dotted ring accent */}
          <ellipse
            cx="100"
            cy="100"
            rx="90"
            ry="26"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="1"
            strokeDasharray="1.5, 14"
            opacity="0.35"
          />
        </svg>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.005;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta =
              e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.005;
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
        }}
      />
    </div>
  );
}
