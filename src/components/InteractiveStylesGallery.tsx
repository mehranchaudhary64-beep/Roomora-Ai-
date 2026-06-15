import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Upload,
  ArrowRight,
  Sliders,
  CheckCircle,
  Layers,
  ArrowLeftRight,
  Maximize2,
  RefreshCw,
  Award
} from "lucide-react";
import { DESIGN_STYLES, PRESET_ROOMS } from "../types";
import BeforeAfterSlider from "./BeforeAfterSlider";

// Complete high-fidelity matrix mapping of Preset Rooms * Styles to Unsplash gorgeous outputs
const TRANSFORMATION_MATRIX: Record<string, Record<string, string>> = {
  scandinavian_preset: {
    "Luxe Editorial": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200",
    "Scandinavian Modern": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200",
    "Japandi Minimalist": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200",
    "Mid-Century Atelier": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200",
    "Industrial Brutalist": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200",
    "Contemporary Classic": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200"
  },
  minimalist_preset: {
    "Luxe Editorial": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200",
    "Scandinavian Modern": "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200",
    "Japandi Minimalist": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200",
    "Mid-Century Atelier": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200",
    "Industrial Brutalist": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200",
    "Contemporary Classic": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200"
  },
  luxury_preset: {
    "Luxe Editorial": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200",
    "Scandinavian Modern": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200",
    "Japandi Minimalist": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200",
    "Mid-Century Atelier": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200",
    "Industrial Brutalist": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200",
    "Contemporary Classic": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200"
  }
};

// Curated handcrafted designers notes explaining each style transformation details
const STYLE_DESIGNERS_NOTES: Record<string, string> = {
  "Luxe Editorial": "Achieved through extreme axial alignment and material luxury. By placing bookmatched Arabescato marble as the focal hearth and panels of French Walnut alongside high-shine champagne brass, we establish a sense of majestic scale and absolute editorial confidence.",
  "Scandinavian Modern": "Focused purely on daylight optimization and structural subtraction. We introduce soft lime-washed oak boards paired with textured Pebble Bouclé. This approach channels natural vertical afternoon lighting to form a warm, diffuse, and silent domestic retreat.",
  "Japandi Minimalist": "A study in organic textures, asymmetry, and raw balance. Low seating platforms are grounded on premium tatami mats, contrasted with heavy Shou Sugi Ban trims and warm, hand-honed clay plasters that absorb glare to foster absolute meditation.",
  "Mid-Century Atelier": "Curates custom vintage geometries. Teak storage plinths are contrasted with polished tubular chrome frames and honey cognac saddle leathers. We balanced the low-to-the-floor sightlines by incorporating high, textured linen sheers.",
  "Industrial Brutalist": "Focuses on architectural honesty. We contrast bead-blasted raw concrete wall aggregates with rugged, patinated steel panels. The seating features deep distressed hide surfaces, highlighted by high-contrast linear black architectural downlights.",
  "Contemporary Classic": "A harmonious layout pairing historic heritage with modern minimalist volume. We contrast neoclassical plaster crown moldings with low, monolithic geometric bouclé lounges, utilizing clean brass rods to anchor lighting coordinates."
};

// Core color swatches associated with each style for the custom interactive color palette cards
const STYLE_SWATCHES: Record<string, { colorName: string; hex: string; role: string }[]> = {
  "Luxe Editorial": [
    { colorName: "Travertine Ivory", hex: "#EFEBE4", role: "Drywall finish (50%)" },
    { colorName: "French Walnut", hex: "#3A2A1E", role: "Veneer millwork (30%)" },
    { colorName: "Polished Brass", hex: "#C5B28F", role: "Metal accents (10%)" },
    { colorName: "Mink Cashmere", hex: "#7D756C", role: "Upholstery (10%)" }
  ],
  "Scandinavian Modern": [
    { colorName: "Alabaster White", hex: "#F3F2EE", role: "Primary canvas (60%)" },
    { colorName: "Nordic Ash", hex: "#D4C5B9", role: "Timber plates (25%)" },
    { colorName: "Pebble Bouclé", hex: "#E3DFD5", role: "Upholstery (10%)" },
    { colorName: "Carbon Contrast", hex: "#2A2A2A", role: "Fixture accents (5%)" }
  ],
  "Japandi Minimalist": [
    { colorName: "Earthen Clay", hex: "#EBE3D5", role: "Clay partitions (60%)" },
    { colorName: "Shou Sugi Ban", hex: "#232324", role: "Charred panels (20%)" },
    { colorName: "Natural Rye Oak", hex: "#CEBFA8", role: "Structural frames (15%)" },
    { colorName: "Moss Sage Linen", hex: "#7E857C", role: "Soft accents (5%)" }
  ],
  "Mid-Century Atelier": [
    { colorName: "Saffron Teak", hex: "#9E5E38", role: "Main cabinetry (50%)" },
    { colorName: "Cognac Hide", hex: "#6E3E26", role: "Lounge leather (30%)" },
    { colorName: "Polished Chrome", hex: "#D1D5DB", role: "Tubular frames (10%)" },
    { colorName: "Bone Linen", hex: "#F9F6F0", role: "Wall covers (10%)" }
  ],
  "Industrial Brutalist": [
    { colorName: "BeadConcrete", hex: "#9CA3AF", role: "Wall partitions (60%)" },
    { colorName: "Matte Black Steel", hex: "#111827", role: "Hears & joinery (25%)" },
    { colorName: "Distressed Umber", hex: "#4B5563", role: "Lounge hide (10%)" },
    { colorName: "Acidized Copper", hex: "#065F46", role: "Vessel details (5%)" }
  ],
  "Contemporary Classic": [
    { colorName: "Flawless Chalk", hex: "#FAF8F5", role: "Plaster ceilings (60%)" },
    { colorName: "Heritage Ivory", hex: "#E5E1D8", role: "Moulding relief (25%)" },
    { colorName: "Deep Navy Velvet", hex: "#1E3A8A", role: "Seating weight (10%)" },
    { colorName: "Honed Quartzite", hex: "#D1C7BD", role: "Hearth structures (5%)" }
  ]
};

// Simulated spatial analysis metrics when users upload custom photos in the gallery
const DEFAULT_SPATIAL_METRICS = {
  geometry: "Standard Rectangular Spatial Envelope with single entrance clearance",
  lightVector: "Diffuse lateral morning overcast rays from Eastern fenestrations",
  ceilingHeight: "9.6 ft Standard Architectural Clearance",
  flooringMaterial: "Raw concrete aggregate substrate ready for floating hardwood plates",
  heritageTrim: "Clean modern baseboard profiles with minimal micro-grout boundaries",
  clutterLoad: "Moderate",
  clutterScore: 35
};

export default function InteractiveStylesGallery() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("scandinavian_preset");
  const [selectedStyleName, setSelectedStyleName] = useState<string>("Luxe Editorial");

  // Switch to preset empty room sandbox
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
  };

  const currentPreset = PRESET_ROOMS.find(p => p.id === selectedPresetId) || PRESET_ROOMS[0];

  // Base raw "Before" image
  const beforeImage = currentPreset.beforeImage;

  // Transformed "After" image
  const afterImage = TRANSFORMATION_MATRIX[selectedPresetId]?.[selectedStyleName] || currentPreset.afterImage;

  // Fetch swatches & designers notes
  const swatches = STYLE_SWATCHES[selectedStyleName] || STYLE_SWATCHES["Luxe Editorial"];
  const notes = STYLE_DESIGNERS_NOTES[selectedStyleName] || STYLE_DESIGNERS_NOTES["Luxe Editorial"];

  return (
    <div id="interactive-styles-gallery-root" className="space-y-8">
      
      {/* Preset Picker Panel */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-wider font-bold block">
          STYLE DICTIONARY EXPLORER
        </span>
        <div className="flex justify-center gap-3">
          {PRESET_ROOMS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-4 py-2 text-xs font-mono rounded border transition-all ${
                selectedPresetId === preset.id
                  ? "bg-white text-luxury-charcoal border-luxury-accent shadow-sm"
                  : "bg-transparent text-luxury-slate border-luxury-stone hover:border-luxury-gold"
              }`}
            >
              {preset.roomType}
            </button>
          ))}
        </div>
      </div>

      {/* Image Slider Comparison Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-luxury-sand border border-luxury-stone rounded-2xl overflow-hidden p-6 md:p-8">
        
        {/* Left Column: Visual transformation slider */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-widest font-bold block">
              TRANSFORMATION SIMULATION SCREEN
            </span>
            <span className="text-[10px] text-luxury-slate font-mono font-medium flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-luxury-accent" />
              Slide handle to compare styles
            </span>
          </div>

          <div className="p-3 bg-white border border-luxury-stone rounded-2xl shadow-xl">
            <BeforeAfterSlider
              beforeImage={beforeImage}
              afterImage={afterImage}
              beforeLabel="Raw Empty Environment"
              afterLabel={`${selectedStyleName} Synthesis`}
            />
          </div>
        </div>

        {/* Right Column: Style Tags & Designer's Handcrafted Notes */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E7C68] font-bold block">
              CYCLE DESIGN ESTHETIC ERAS
            </span>
            
            {/* Style list tags button group */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2">
              {DESIGN_STYLES.map(style => (
                <button
                  key={style.name}
                  onClick={() => setSelectedStyleName(style.name)}
                  className={`px-3 py-2.5 text-left rounded text-[11px] font-mono tracking-tight border transition-all ${
                    selectedStyleName === style.name
                      ? "bg-luxury-charcoal text-white border-luxury-charcoal shadow-sm font-semibold"
                      : "bg-white text-luxury-slate border-luxury-stone hover:border-luxury-gold"
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Elite Designer's Observations & Insights */}
          <div className="p-5 bg-white border border-luxury-stone rounded-xl space-y-4">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-luxury-accent uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
              Handcrafted Designer's Notes
            </div>
            
            <p className="text-xs font-sans italic text-luxury-charcoal leading-relaxed font-light">
              "{notes}"
            </p>

            {/* Custom Color Swatches matching specific style chosen */}
            <div className="pt-3 border-t border-luxury-stone space-y-2.5">
              <span className="text-[9px] font-mono text-[#8E7C68] uppercase font-bold block">Swatches Deck:</span>
              <div className="grid grid-cols-2 gap-3">
                {swatches.map((sw, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded border border-luxury-stone shrink-0"
                      style={{ backgroundColor: sw.hex }}
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-display font-medium text-luxury-charcoal block truncate leading-none">
                        {sw.colorName}
                      </span>
                      <span className="text-[8px] font-mono text-luxury-slate block transform scale-95 origin-left leading-none mt-0.5">
                        {sw.hex} • {sw.role.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
