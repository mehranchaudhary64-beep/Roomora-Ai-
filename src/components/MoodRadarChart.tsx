import React, { useState } from "react";
import { Sliders, HelpCircle, Sparkles, Award } from "lucide-react";

export interface MoodAttribute {
  id: string;
  name: string;
  desc: string;
  lowLabel: string;
  highLabel: string;
}

export const MOOD_ATTRIBUTES: MoodAttribute[] = [
  {
    id: "acousticWarmth",
    name: "Acoustic Warmth",
    desc: "Sound absorption capability, wood density, bouclé, and soft fabric dampening.",
    lowLabel: "Hard Echoic",
    highLabel: "Muffled Sanctuary"
  },
  {
    id: "lightDiffusion",
    name: "Light Diffusion",
    desc: "Soft daylight scattering, door/window apertures, sheers, and translucent paper.",
    lowLabel: "Dramatic Shafts",
    highLabel: "Perfect Ambient Glow"
  },
  {
    id: "spatialDensity",
    name: "Spatial Density",
    desc: "Proportion of active footprint occupied by furniture, adhering to the 35% empty space rule.",
    lowLabel: "Sparsely Floating",
    highLabel: "Curated Layers"
  },
  {
    id: "materialTextility",
    name: "Material Textility",
    desc: "Tactile surface roughness, hand-honed travertine pore levels, plaster grit, and rough wool.",
    lowLabel: "Sterile Smooth",
    highLabel: "Highly Organic"
  },
  {
    id: "circadianResonance",
    name: "Circadian Resonance",
    desc: "Aesthetic affinity with sunrise, twilight golden hours, and natural solar cycles.",
    lowLabel: "Static Studio",
    highLabel: "Circadian Bond"
  },
  {
    id: "structuralSincerity",
    name: "Structural Sincerity",
    desc: "Integrity of structural elements, exposed timber joins, raw concrete beams, and honest masonry.",
    lowLabel: "Concealed Gypsum",
    highLabel: "Raw Structural Pride"
  }
];

export interface RadarData {
  acousticWarmth: number;
  lightDiffusion: number;
  spatialDensity: number;
  materialTextility: number;
  circadianResonance: number;
  structuralSincerity: number;
}

export const RADAR_PROFILES: Record<string, { label: string; scores: RadarData; color: string; fill: string }> = {
  "Scandinavian Modern": {
    label: "Scandinavian Modern",
    scores: {
      acousticWarmth: 85,
      lightDiffusion: 90,
      spatialDensity: 45,
      materialTextility: 70,
      circadianResonance: 80,
      structuralSincerity: 65
    },
    color: "#C2B095", // Gold
    fill: "rgba(194,176,149,0.3)"
  },
  "Japandi Minimalist": {
    label: "Japandi Minimalist",
    scores: {
      acousticWarmth: 75,
      lightDiffusion: 85,
      spatialDensity: 30,
      materialTextility: 80,
      circadianResonance: 90,
      structuralSincerity: 85
    },
    color: "#6b7280", // Slate
    fill: "rgba(107,114,128,0.25)"
  },
  "Luxe Editorial (High Luxury)": {
    label: "Luxe Editorial",
    scores: {
      acousticWarmth: 90,
      lightDiffusion: 65,
      spatialDensity: 60,
      materialTextility: 95,
      circadianResonance: 50,
      structuralSincerity: 55
    },
    color: "#8E7C68", // Bronze
    fill: "rgba(142,124,104,0.3)"
  },
  "Mid-Century Atelier": {
    label: "Mid-Century Atelier",
    scores: {
      acousticWarmth: 80,
      lightDiffusion: 70,
      spatialDensity: 55,
      materialTextility: 75,
      circadianResonance: 70,
      structuralSincerity: 80
    },
    color: "#b45309", // Warm Amber
    fill: "rgba(180,83,9,0.2)"
  },
  "Industrial Brutalist": {
    label: "Industrial Brutalist",
    scores: {
      acousticWarmth: 35,
      lightDiffusion: 60,
      spatialDensity: 40,
      materialTextility: 65,
      circadianResonance: 60,
      structuralSincerity: 98
    },
    color: "#1a1a1a", // Deep Charcoal
    fill: "rgba(26,26,26,0.3)"
  },
  "Contemporary Classic": {
    label: "Contemporary Classic",
    scores: {
      acousticWarmth: 80,
      lightDiffusion: 75,
      spatialDensity: 65,
      materialTextility: 85,
      circadianResonance: 65,
      structuralSincerity: 50
    },
    color: "#4f46e5", // Classic Blue
    fill: "rgba(79,70,229,0.2)"
  }
};

interface MoodRadarChartProps {
  selectedStyle: string;
  onStyleChange?: (style: string) => void;
}

export default function MoodRadarChart({ selectedStyle, onStyleChange }: MoodRadarChartProps) {
  const [compareStyle, setCompareStyle] = useState<string | null>(null);
  const [hoveredAttr, setHoveredAttr] = useState<MoodAttribute | null>(null);

  // Fallback map if exact match has casing variances
  const normalizedMatchName = (styleName: string): string => {
    const list = Object.keys(RADAR_PROFILES);
    const matched = list.find(s => s.toLowerCase().includes(styleName.toLowerCase()) || styleName.toLowerCase().includes(s.toLowerCase()));
    return matched || "Scandinavian Modern";
  };

  const primaryKey = normalizedMatchName(selectedStyle);
  const primaryProfile = RADAR_PROFILES[primaryKey];
  const compareProfile = compareStyle ? RADAR_PROFILES[compareStyle] : null;

  // Radar geometry configuration
  const width = 340;
  const height = 340;
  const padding = 65;
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2 - padding;

  const N = MOOD_ATTRIBUTES.length;

  // Calculate coordinates for a score (0 to 100) on a given axis index
  const getCoordinates = (index: number, score: number) => {
    const angle = (2 * Math.PI * index) / N - Math.PI / 2;
    const factor = (score / 100) * r;
    const x = cx + factor * Math.cos(angle);
    const y = cy + factor * Math.sin(angle);
    return { x, y };
  };

  // Concentric circle ticks grid levels (20, 40, 60, 80, 100)
  const gridLevels = [25, 50, 75, 100];
  const gridPoints = gridLevels.map(level => {
    const points: string[] = [];
    for (let i = 0; i < N + 1; i++) {
      const { x, y } = getCoordinates(i % N, level);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  });

  // Calculate polygon points for Primary Style
  const primaryPoints = MOOD_ATTRIBUTES.map((attr, idx) => {
    const score = primaryProfile.scores[attr.id as keyof RadarData] || 50;
    const { x, y } = getCoordinates(idx, score);
    return `${x},${y}`;
  }).join(" ");

  // Calculate polygon points for Comparison Style
  const comparePoints = compareProfile
    ? MOOD_ATTRIBUTES.map((attr, idx) => {
        const score = compareProfile.scores[attr.id as keyof RadarData] || 50;
        const { x, y } = getCoordinates(idx, score);
        return `${x},${y}`;
      }).join(" ")
    : "";

  return (
    <div id="mood-radar-chart-root" className="bg-white border border-luxury-stone rounded-xl p-5 shadow-sm hover:border-luxury-gold transition-all select-none">
      
      {/* Title Segment */}
      <div className="flex justify-between items-start border-b border-luxury-stone pb-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-luxury-gold uppercase tracking-widest font-bold">
            <Award className="w-3.5 h-3.5" />
            Aesthetic Matrix Analysis
          </div>
          <h4 className="font-display font-medium text-sm text-luxury-charcoal mt-1">
            Spatial Mood Radar
          </h4>
        </div>
        
        {/* Helper info bullet */}
        <div className="relative group">
          <HelpCircle className="w-4 h-4 text-luxury-slate cursor-help hover:text-luxury-charcoal" />
          <div className="absolute right-0 top-6 w-56 p-3 bg-luxury-charcoal text-white text-[10px] font-sans leading-relaxed rounded shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            Hover over the radar attributes to read precise editorial guidelines and engineering rules defined for this style.
          </div>
        </div>
      </div>

      {/* Select Switcher / Compare options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-[9px] font-mono uppercase tracking-widest text-luxury-accent font-semibold block mb-1">
            Primary Profile
          </label>
          <select
            value={primaryKey}
            onChange={(e) => onStyleChange && onStyleChange(e.target.value)}
            className="w-full bg-luxury-sand text-luxury-charcoal text-xs font-sans rounded p-1.5 border border-luxury-stone focus:outline-none focus:border-luxury-gold"
          >
            {Object.keys(RADAR_PROFILES).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[9px] font-mono uppercase tracking-widest text-luxury-accent font-semibold block mb-1">
            Compare Overlay
          </label>
          <select
            value={compareStyle || ""}
            onChange={(e) => setCompareStyle(e.target.value || null)}
            className="w-full bg-luxury-sand text-luxury-charcoal text-xs font-sans rounded p-1.5 border border-luxury-stone focus:outline-none focus:border-luxury-gold"
          >
            <option value="">-- No Overlay --</option>
            {Object.keys(RADAR_PROFILES)
              .filter(key => key !== primaryKey)
              .map((key) => (
                <option key={key} value={key}>
                  vs {key}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Main SVG Radar Plot Frame */}
      <div className="relative flex justify-center items-center py-2 bg-[#FCFAF7] border border-luxury-stone/50 rounded-lg overflow-hidden">
        
        <svg width={width} height={height} className="mx-auto block">
          
          {/* Concentric helper grids */}
          {gridPoints.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              className="fill-none stroke-luxury-stone/60 stroke-1"
              strokeDasharray={idx < 3 ? "2 2" : "0"}
            />
          ))}

          {/* Radial Axis dividers */}
          {MOOD_ATTRIBUTES.map((_, idx) => {
            const inner = getCoordinates(idx, 0);
            const outer = getCoordinates(idx, 100);
            return (
              <line
                key={idx}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                className="stroke-luxury-stone stroke-1"
              />
            );
          })}

          {/* Compare Overlay Area */}
          {compareProfile && (
            <g>
              <polygon
                points={comparePoints}
                className="transition-all duration-500 ease-out"
                style={{
                  fill: compareProfile.fill,
                  stroke: compareProfile.color,
                  strokeWidth: 1.5,
                  strokeDasharray: "3 3"
                }}
              />
              {MOOD_ATTRIBUTES.map((attr, idx) => {
                const val = compareProfile.scores[attr.id as keyof RadarData] || 50;
                const { x, y } = getCoordinates(idx, val);
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={3}
                    fill={compareProfile.color}
                    className="opacity-80"
                  />
                );
              })}
            </g>
          )}

          {/* Primary Style Area Filled Polygon */}
          <polygon
            points={primaryPoints}
            className="transition-all duration-500 ease-out"
            style={{
              fill: primaryProfile.fill,
              stroke: primaryProfile.color,
              strokeWidth: 2
            }}
          />

          {/* Primary Data Point nodes dots \& Hover interceptors */}
          {MOOD_ATTRIBUTES.map((attr, idx) => {
            const score = primaryProfile.scores[attr.id as keyof RadarData] || 50;
            const { x, y } = getCoordinates(idx, score);
            const outer = getCoordinates(idx, 100);

            // Compute alignment positions of textual axis labels
            const angleVal = (idx * 2 * Math.PI) / N - Math.PI / 2;
            const labelDist = r + 16;
            const lx = cx + labelDist * Math.cos(angleVal);
            const ly = cy + labelDist * Math.sin(angleVal) + 3;

            let textAnchor = "middle";
            if (Math.cos(angleVal) > 0.1) textAnchor = "start";
            else if (Math.cos(angleVal) < -0.1) textAnchor = "end";

            return (
              <g
                key={attr.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredAttr(attr)}
                onMouseLeave={() => setHoveredAttr(null)}
              >
                {/* Visual Label Text */}
                <text
                  x={lx}
                  y={ly}
                  textAnchor={textAnchor}
                  className={`font-mono transition-all text-[9.5px] font-medium ${
                    hoveredAttr?.id === attr.id
                      ? "fill-luxury-charcoal font-bold scale-105"
                      : "fill-[#8E7C68]"
                  }`}
                >
                  {attr.name}
                </text>

                {/* Micro circle node on the interactive score point */}
                <circle
                  cx={x}
                  cy={y}
                  r={hoveredAttr?.id === attr.id ? 6 : 4}
                  fill={primaryProfile.color}
                  className="stroke-white stroke-2 shadow-sm transition-all duration-300"
                />

                {/* Broad transparent trigger region for easier hover targeting */}
                <circle
                  cx={lx}
                  cy={ly - 2}
                  r={16}
                  fill="transparent"
                />
              </g>
            );
          })}

        </svg>

        {/* Central visual indicator tag representing selected style color */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded border border-luxury-stone/50 shadow-sm text-[8px] font-mono font-bold text-luxury-charcoal">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryProfile.color }} />
          {primaryProfile.label}
        </div>
        
        {compareProfile && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded border border-luxury-stone/50 shadow-sm text-[8px] font-mono font-bold text-[#8E7C68]">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 stroke-stone-600 stroke-1 border border-white" />
            Comparison: {compareProfile.label}
          </div>
        )}

      </div>

      {/* Interactive Tooltip descriptions under the chart */}
      <div className="mt-4 min-h-[75px] bg-luxury-sand/40 border border-luxury-stone rounded-lg p-3 text-left transition-all relative">
        {hoveredAttr ? (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-widest font-bold">
                {hoveredAttr.name} Analysis
              </span>
              <span className="text-[9px] font-mono text-luxury-charcoal uppercase bg-white px-2 py-0.5 rounded border border-luxury-stone font-bold shadow-sm">
                Score: {primaryProfile.scores[hoveredAttr.id as keyof RadarData]}/100
              </span>
            </div>
            <p className="text-[11px] font-sans text-[#5E5D57] font-light leading-relaxed">
              {hoveredAttr.desc}
            </p>
            <div className="mt-1.5 flex justify-between text-[9px] font-mono text-luxury-slate font-medium">
              <span>Low Level: {hoveredAttr.lowLabel}</span>
              <span>High Level: {hoveredAttr.highLabel}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full text-luxury-slate py-2">
            <Sliders className="w-4 h-4 text-luxury-gold/70 animate-bounce mb-1" />
            <p className="text-[10px] font-mono tracking-wide uppercase text-luxury-accent">
              Hover over axes or titles above to view criteria details
            </p>
          </div>
        )}
      </div>

      {/* Comparison Scoreboard Strip */}
      {compareProfile && (
        <div className="mt-3 border border-luxury-stone rounded-lg overflow-hidden text-xs bg-white text-left font-sans shadow-sm">
          <div className="bg-luxury-stone/30 px-3 py-1.5 border-b border-luxury-stone font-mono text-[9px] font-bold text-luxury-charcoal uppercase tracking-wider">
            Comparative Index
          </div>
          <div className="p-2.5 space-y-2">
            {MOOD_ATTRIBUTES.map(attr => {
              const valA = primaryProfile.scores[attr.id as keyof RadarData] || 50;
              const valB = compareProfile.scores[attr.id as keyof RadarData] || 50;
              const diff = valA - valB;
              return (
                <div key={attr.id} className="flex justify-between items-center text-[11px]">
                  <span className="font-mono text-luxury-slate font-bold">{attr.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-luxury-charcoal" style={{ color: primaryProfile.color }}>
                      {valA}
                    </span>
                    <span className="text-luxury-stone">|</span>
                    <span className="font-mono text-[#8E7C68]">
                      {valB}
                    </span>
                    <span className={`font-mono text-[9px] px-1 rounded ${diff > 0 ? "bg-emerald-50 text-emerald-700" : diff < 0 ? "bg-amber-50 text-amber-700" : "bg-neutral-50 text-neutral-600"}`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
