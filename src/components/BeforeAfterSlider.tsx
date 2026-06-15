import React, { useState, useRef, useEffect, MouseEvent, TouchEvent } from "react";
import { Sliders, ArrowLeftRight } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Original Room Space",
  afterLabel = "AI Premium Design",
  aspectRatio = "aspect-[16/10]"
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    };

    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging]);

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      id="before-after-slider-root"
      ref={containerRef}
      className={`relative w-full ${aspectRatio} overflow-hidden rounded-xl border border-luxury-stone bg-luxury-sand select-none group cursor-ew-resize`}
      onTouchMove={handleTouchMove}
      onTouchStart={handleMouseDown}
      onMouseDown={handleMouseDown}
    >
      {/* Before Image (Background) */}
      <img
        id="slider-before-img"
        src={beforeImage}
        alt="Before space"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute top-4 left-4 z-10 bg-luxury-black/75 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
        <span className="text-[10px] font-mono tracking-widest text-[#D4C5B9] uppercase font-medium">
          {beforeLabel}
        </span>
      </div>

      {/* After Image Container (Overlaid & Clipped) */}
      <div
        id="slider-after-container"
        className="absolute inset-0 h-full overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          id="slider-after-img"
          src={afterImage}
          alt="After space"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: containerRef.current?.getBoundingClientRect().width || "100%" }}
        />
      </div>
      <div
        className="absolute top-4 right-4 z-10 bg-luxury-cream px-3 py-1 rounded-full border border-luxury-stone shadow-sm"
        style={{ opacity: sliderPosition < 90 ? 1 : 0, transition: "opacity 0.20s" }}
      >
        <span className="text-[10px] font-mono tracking-widest text-luxury-accent uppercase font-semibold">
          {afterLabel}
        </span>
      </div>

      {/* Vertical Slider Bar Separator Divider Line */}
      <div
        id="slider-vertical-divider"
        className="absolute top-0 bottom-0 w-[2px] bg-luxury-gold/80 hover:bg-luxury-gold cursor-ew-resize z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Handle Dial */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-luxury-cream border border-luxury-gold shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group-hover:bg-luxury-sand text-luxury-charcoal">
          <ArrowLeftRight className="w-4 h-4 text-luxury-accent" />
        </div>
      </div>

      {/* Visual Instruction Guide Overlay (fades out on first interaction) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-luxury-charcoal/90 px-4 py-2 rounded-lg border border-luxury-accent/30 text-center pointer-events-none transition-opacity duration-500 group-hover:opacity-0 delay-1000 opacity-90 backdrop-blur-md shadow-lg">
        <span className="text-[11px] font-sans text-luxury-cream flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-luxury-gold" />
          Drag or click horizontal slider to see real transformation
        </span>
      </div>
    </div>
  );
}
