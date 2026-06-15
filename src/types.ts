export interface ColorPaletteItem {
  colorName: string;
  hex: string;
  role: string;
}

export interface MaterialItem {
  material: string;
  application: string;
}

export interface LightingItem {
  fixtureType: string;
  spec: string;
}

export interface FurnitureItem {
  name: string;
  stylingTip: string;
}

export interface SpatialDesignReport {
  vision: string;
  palette: ColorPaletteItem[];
  layoutAdvice: string[];
  materialSymphony: MaterialItem[];
  lightingPlan: LightingItem[];
  suggestedFurniturePieces: FurnitureItem[];
  designersNotes?: string;
  analysis?: {
    geometry: string;
    lightVector: string;
    ceilingHeight: string;
    flooringMaterial: string;
    heritageTrim: string;
    clutterLoad: "Low" | "Moderate" | "High";
    clutterScore: number;
  };
}

export interface DesignPreset {
  id: string;
  name: string;
  style: string;
  roomType: string;
  beforeImage: string;
  afterImage: string;
  tagline: string;
  desc: string;
  curatedReport: SpatialDesignReport;
}

export interface SpecSection {
  title: string;
  description: string;
  rules: { name: string; value: string; desc: string }[];
}

export const PRESET_ROOMS: DesignPreset[] = [
  {
    id: "scandinavian_preset",
    name: "Aura Residence, Living Room",
    style: "Scandinavian Modern",
    roomType: "Living Room",
    beforeImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200", // empty light rustic room
    afterImage: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200", // crisp organic scandinavian
    tagline: "Unification of light and organic ash lumber.",
    desc: "A living environment designed to reflect seasonal sunlight. Soft-minimalist textures combine with light-toned oak to elevate volume and spatial tranquility.",
    curatedReport: {
      vision: "A light-filled sanctuary combining functional wood craftsmanship, tactile textiles, and deep charcoal contrasts to establish a soft-minimalist refuge.",
      palette: [
        { colorName: "Alabaster White", hex: "#F3F2EE", role: "Primary Canvas (60%) for light reflection" },
        { colorName: "Nordic Ash", hex: "#D4C5B9", role: "Structural elements, wall paneling, and cabinetry (20%)" },
        { colorName: "Pebble Bouclé", hex: "#E3DFD5", role: "Large upholstery, soft texture grounding (15%)" },
        { colorName: "Carbon Contrast", hex: "#2A2A2A", role: "Accent lines, architectural hardware, light fixtures (5%)" }
      ],
      layoutAdvice: [
        "Arrange seating around physical vistas rather than a television monitor, introducing low-slung profiles to maximize vertical clearance.",
        "Incorporate negative space: Leave at least 35% of the floor footprint empty to foster spatial breathing room.",
        "Keep major paths aligned to window apertures, allowing natural pedestrian flow to coincide with circadian light paths."
      ],
      materialSymphony: [
        { material: "Honed Bleached Ash Wood", application: "Full plank timber flooring and custom slatted room divider screens" },
        { material: "Heavy-Weave Belgian Linen", application: "Floor-to-ceiling draped panels and bespoke lounge chair cushioning" },
        { material: "Pitted Travertine Stone", application: "Low, monolithic cylindrical side tables and mantle sculpture blocks" }
      ],
      lightingPlan: [
        { fixtureType: "Low-Slung Plaster Dome Pendant", spec: "Suspended 32 inches above main surface level, fitted with a 2700K warm LED" },
        { fixtureType: "Recessed Cove Grazer Sconce", spec: "Washes upwards along the textured lime-paint feature wall to emphasize grain" }
      ],
      suggestedFurniturePieces: [
        { name: "Low-profile Bouclé Sofa", stylingTip: "Ground the frame with an ivory wool rug featuring a high-pile geometric line design." },
        { name: "Organic-moulded Oak Armchair", stylingTip: "Adorn with a single, highly textured charcoal-knit throw." },
        { name: "Monolithic Travertine Plinth", stylingTip: "Keep accessories minimal—place a single branch in a raw stoneware vase." }
      ],
      designersNotes: "We selected the custom Pebble Bouclé fabric and light-washed ash wood elements to maximize tactile contrast without cluttering the floor footprint. The low-slung, floating silhouettes create an expansive field of view, allowing natural morning daylight to graze the lime-washed walls beautifully."
    }
  },
  {
    id: "minimalist_preset",
    name: "The Monolith Foyer & Salon",
    style: "Japandi Minimalist",
    roomType: "Entry Hall / Lounge",
    beforeImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200", // empty modern gray walls
    afterImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200", // stunning high travertine corridor
    tagline: "Structural geometry and pristine sandstone lines.",
    desc: "A lesson in spatial subtraction. Features seamless microcement and a majestic travertine plinth that frames light as it passes through deep architectural apertures.",
    curatedReport: {
      vision: "A pure composition of architectural form and shadow where every material is distilled, establishing absolute mental clarity through pristine geometry.",
      palette: [
        { colorName: "Pure Chalk Ivory", hex: "#FAF8F5", role: "All surfaces & ceilings (70%) to dissolve spatial boundaries" },
        { colorName: "Warm Obsidian", hex: "#1C1C1D", role: "Structural steel lines & bespoke structural columns (15%)" },
        { colorName: "Smoked Travertine", hex: "#C7BFB3", role: "Natural monolithic focal table & secondary stone hearth (10%)" },
        { colorName: "Linen Sand", hex: "#E9E5DD", role: "Tactile floor textiles, balancing hard geometric surfaces (5%)" }
      ],
      layoutAdvice: [
        "Employ fully recessed architectural alignments; ensure all cabinetry and sliding elements recess flat into wall cavities.",
        "Position a single monumental furniture piece (like a travertine console) to draw the eye as the sole structural gravity point.",
        "Remove all visual barriers; optimize sightlines to cross-ventilate outdoor scenery deeply into the interior zone."
      ],
      materialSymphony: [
        { material: "Microcement Mortar", application: "Seamless flooring extending from the entryway through to the outdoor deck" },
        { material: "Brushed Architectural Bronze", application: "Sleek plumbing mixers, light switches, and micro-trim transitions" },
        { material: "Honed Roman Travertine", application: "A 12-foot monolithic island or low-slung fireside bench" }
      ],
      lightingPlan: [
        { fixtureType: "Linear Recessed Dark-Light Apertures", spec: "Black-finish ceiling tracks with deep-set anti-glare spots at 2400K warmth" },
        { fixtureType: "Monolithic Cast-Glass Sconce", spec: "Provides high-contrast diffuse ambient washing next to entryway zones" }
      ],
      suggestedFurniturePieces: [
        { name: "Seamless Architectural Bench", stylingTip: "Arrange alongside a raw limestone wall with absolutely no secondary clutter." },
        { name: "Low-profile Canvas Armchair", stylingTip: "Contrast with a monolithic dark bronze side plate or absolute minimal floor lamp." },
        { name: "Architectural Travertine Coffee Table", stylingTip: "Allow natural veins to shine-no ornaments, just simple physical weight." }
      ],
      designersNotes: "The monolithic Roman travertine table serves as the primary axial anchor for this foyer space. By adhering strictly to our 35% negative space guideline, the surrounding sandstone walls and raw bronze trims catch dramatic afternoon shadows, highlighting the architectural geometry."
    }
  },
  {
    id: "luxury_preset",
    name: "Beaux-Arts Penthouse, Grande Salon",
    style: "Luxe Editorial",
    roomType: "Penthouse Lounge",
    beforeImage: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1200", // empty wood room older style
    afterImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200", // gorgeous luxury lounge walnut & stone
    tagline: "Timeless volume, walnut paneling, and marble core.",
    desc: "An editorial-grade layout crafted around a majestic custom hearth of Arabescato marble, surrounded by walnut partitions and lush mink cashmere textures.",
    curatedReport: {
      vision: "An editorial tribute to timeless high-end living, displaying sculptural stones, rich walnuts, polished metal accents, and deep plush velvets.",
      palette: [
        { colorName: "Travertine Ivory cream", hex: "#EFEBE4", role: "Primary wall canvas, cashmere paint finish (50%)" },
        { colorName: "Rich French Walnut", hex: "#3A2A1E", role: "High-gloss statement paneling, fluted pillars, and credenzas (25%)" },
        { colorName: "Champagne Polished Brass", hex: "#C5B28F", role: "Custom hardware, mirror frames, trim details, inlay banding (10%)" },
        { colorName: "Smokey Mink Velvet", hex: "#7D756C", role: "Deep lounge furniture, bespoke accent chaise, tailored draping (15%)" }
      ],
      layoutAdvice: [
        "Implement formal axial symmetry. Center architectural furniture along majestic focal fireplaces, custom portals, or monumental high-vistas.",
        "Drape walls in silk panels or fluted walnut columns to add sophisticated vertical rhythm.",
        "Design spacious, deep seating pools where layout invites conversation, bordered by sculptural stone side consoles."
      ],
      materialSymphony: [
        { material: "Polished French Walnut Wood", application: "Full-height vertical acoustic wall panels and bespoke bar console" },
        { material: "Statuario Arabescato Marble", application: "Monolithic bookmatched fireplace mantel and kitchen counter slabs" },
        { material: "Heavy Italian Mink Cashmere", application: "Deep-seated tailored sofas and floor-to-ceiling pleated drapes" }
      ],
      lightingPlan: [
        { fixtureType: "Architectural Sculptural Brass Chandelier", spec: "Focal dining centerpiece with dimmable amber candle-glow emulation" },
        { fixtureType: "Integrated LED Baseboard Reveal", spec: "Produces a subtle floating feeling below bespoke dark timber cabinetry" }
      ],
      suggestedFurniturePieces: [
        { name: "Sculptural Arabescato Marble Bench", stylingTip: "Set as an entry statement, contrasted with heavy, polished dark walnut walls." },
        { name: "Luxe Mink Cashmere Lounge Chair", stylingTip: "Pair with a brass side table holding an open art tome from Phaidon or Assouline." },
        { name: "Monolithic Fluted Credenza", stylingTip: "Accessorize with custom hand-blown amber glass objects and sculptural bronze." }
      ],
      designersNotes: "We anchored the Beaux-Arts Penthouse layout with a majestic bookmatched Arabescato fireplace mantel. We balanced its intense grey texturing by wrapping adjacent walls in deep French Walnut panels and smokey mink velvet, offering a handcrafted, editorial weight suitable for elite hospitality."
    }
  }
];

export const DESIGN_STYLES = [
  {
    name: "Luxe Editorial",
    desc: "A tribute to global luxury hospitality. Structural marble slabs, deep dark walnuts, champagne brass, and deep tailored cashmere wools form an interior of high architectural drama.",
    sampleImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600"
  },
  {
    name: "Scandinavian Modern",
    desc: "The ultimate realization of soft warmth. Relying on pale lime-washed oak, heavy Belgian linens, floating chalk wall modules, and warm negative contours that optimize ambient lighting.",
    sampleImage: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=600"
  },
  {
    name: "Japandi Minimalist",
    desc: "A meditation on the wabi-sabi philosophy combined with Nordic order. Features low floor platforms, charred Shou Sugi Ban accents, textured sand clay plaster, and translucent rice paper screens.",
    sampleImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600"
  },
  {
    name: "Mid-Century Atelier",
    desc: "Curated vintage modernism. Tapered executive desks, warm teak timbers, polished steel frames, leather-weave loungers, and dynamic visual art backdrops with warm cognac colors.",
    sampleImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600"
  },
  {
    name: "Industrial Brutalist",
    desc: "Sophisticated urban structure. Features cast micro-beaded concrete walls, black structural steel channels, exposed pipe highlights, polished dark granite surfaces, and rugged distressed leather.",
    sampleImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600"
  },
  {
    name: "Contemporary Classic",
    desc: "The pairing of heritage ornament and minimalist luxury. High-contrast plaster crown moulding offset by monolithic low sofas, structural brass lighting rods, and soft neutral wool rugs.",
    sampleImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600"
  }
];

export const SPACE_GUIDELINES: SpecSection[] = [
  {
    title: "Typography Grid System",
    description: "Premium display type scale set to Inter and Space Grotesk. Proportional tracking matches Apple typography rules.",
    rules: [
      { name: "Super Display Title", value: "Space Grotesk, 4.5rem (72px)", desc: "Font weight 300/400. Letter tracking -0.04em. Used in premium landing headers." },
      { name: "Section Header", value: "Space Grotesk, 2.25rem (36px)", desc: "Font weight 400. Letter tracking -0.02em. Strict vertical spacing." },
      { name: "Sub-Heads", value: "Inter, 1.25rem (20px)", desc: "Font weight 500. Letter tracking -0.01em. Medium contrast colors." },
      { name: "Core Body", value: "Inter, 0.975rem (15.6px)", desc: "Font weight 300. Line-height 1.625. Deep neutral stone gray." },
      { name: "Aesthetic Specs/Tags", value: "JetBrains Mono, 0.75rem (12px)", desc: "Font weight 400. Letter tracking 0.1em uppercase. Warm luxury gold." }
    ]
  },
  {
    title: "Spatial Padding & Spacing Scale",
    description: "Pure multi-layered structural padding based on strict modular grid ratios to establish structural silence.",
    rules: [
      { name: "Micro Margins", value: "0.25rem - 0.5rem (4px - 8px)", desc: "Used for tag tags, arrow offsets, and button-label links." },
      { name: "Component Gap", value: "1.5rem (24px)", desc: "Layout separation spacing for input blocks and feature grid lists." },
      { name: "Container Spacing", value: "4rem - 6rem (64px - 96px)", desc: "Strict vertical buffer padding between prime webpage sections." },
      { name: "Maximum Content Width", value: "80rem (1280px) max-w-7xl", desc: "Fluidly centered layout. Prevents stretch on extra-wide monitors." }
    ]
  },
  {
    title: "Luxury Color Hex Standards",
    description: "Premium human-designed palette reflecting luxury organic materials and architectural surfaces.",
    rules: [
      { name: "Luxury Cream", value: "#FAF9F6", desc: "Primary Canvas Background (Soft eye-safe off-white)" },
      { name: "Luxury Charcoal", value: "#1A1A1A", desc: "Structural elements, deep contrast cards and solid buttons" },
      { name: "Luxury Gold", value: "#C2B095", desc: "Aesthetic borders, interactive state focus, premium titles" },
      { name: "Luxury Sand", value: "#F3EFE9", desc: "Zonal segment backdrops and soft card layouts" },
      { name: "Luxury Stone", value: "#EAE5DE", desc: "Secondary hairline borders, dividers, subtle button frames" }
    ]
  }
];
