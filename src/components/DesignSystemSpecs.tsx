import React, { useState } from "react";
import { SPACE_GUIDELINES, SpecSection } from "../types";
import { Check, Copy, Layers, Type, Move, Palette, ClipboardCheck, Code } from "lucide-react";

export default function DesignSystemSpecs() {
  const [activeTab, setActiveTab] = useState<"typography" | "spacing" | "colors" | "components">("typography");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div id="design-system-specs-root" className="bg-luxury-cream border border-luxury-stone rounded-2xl overflow-hidden p-6 md:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-luxury-stone pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-luxury-stone text-luxury-accent">
              DEVELOPMENT EXPORT
            </span>
            <span className="text-[10px] font-mono text-luxury-gold tracking-widest font-semibold">
              SPECIFICATION V1.4
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-luxury-charcoal tracking-tight">
            Design &amp; Wireframe System Blueprint
          </h2>
          <p className="text-sm font-sans text-luxury-slate mt-1 max-w-2xl">
            A comprehensive blueprint outlining structural safety margins, typeface systems, visual grids, and asset guidelines designed for the $100M interior design platform.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-luxury-sand p-1.5 rounded-lg border border-luxury-stone">
          <button
            onClick={() => setActiveTab("typography")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-mono tracking-tight transition-all ${
              activeTab === "typography"
                ? "bg-luxury-charcoal text-luxury-cream shadow-sm"
                : "text-luxury-slate hover:text-luxury-charcoal"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            01. Typography
          </button>
          <button
            onClick={() => setActiveTab("spacing")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-mono tracking-tight transition-all ${
              activeTab === "spacing"
                ? "bg-luxury-charcoal text-luxury-cream shadow-sm"
                : "text-luxury-slate hover:text-luxury-charcoal"
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            02. Spacing
          </button>
          <button
            onClick={() => setActiveTab("colors")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-mono tracking-tight transition-all ${
              activeTab === "colors"
                ? "bg-luxury-charcoal text-luxury-cream shadow-sm"
                : "text-luxury-slate hover:text-luxury-charcoal"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            03. Palette
          </button>
          <button
            onClick={() => setActiveTab("components")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-mono tracking-tight transition-all ${
              activeTab === "components"
                ? "bg-luxury-charcoal text-luxury-cream shadow-sm"
                : "text-luxury-slate hover:text-luxury-charcoal"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            04. Components
          </button>
        </div>
      </div>

      {/* Copy Notification Toast */}
      {copiedText && (
        <div className="fixed bottom-6 right-6 z-50 bg-luxury-black text-luxury-cream border border-luxury-gold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <ClipboardCheck className="w-4 h-4 text-luxury-gold" />
          <span className="text-xs font-mono">Copied specification preset: "{copiedText}"</span>
        </div>
      )}

      {/* Tab: Typography */}
      {activeTab === "typography" && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-mono text-xs text-luxury-accent uppercase tracking-widest font-semibold flex items-center gap-2">
                <Code className="w-4 h-4" /> Typeface Philosophy
              </h3>
              <p className="text-sm text-luxury-slate leading-relaxed font-sans">
                Our design pairs clean displays with high-legibility geometric content to produce luxurious structural breathing room and extreme typographic balance.
              </p>
              <div className="p-4 bg-luxury-sand rounded-xl border border-luxury-stone space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-luxury-slate block">System Hierarchy API:</span>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono block text-luxury-charcoal">Display Header Style: <strong className="font-semibold">Space Grotesk</strong></span>
                  <span className="text-[11px] font-mono block text-luxury-charcoal">Structural Styling Body: <strong className="font-semibold">Inter</strong></span>
                  <span className="text-[11px] font-mono block text-luxury-charcoal">Technical Annotation Metadata: <strong className="font-semibold font-medium text-luxury-accent">JetBrains Mono</strong></span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-1">
              <h4 className="text-xs font-mono text-luxury-slate tracking-widest uppercase mb-4">TYPOGRAPHY SCULPTING CLASSES</h4>
              <div className="space-y-4">
                {/* Rule Item 1 */}
                <div className="p-4 rounded-xl border border-luxury-stone bg-[#FCFAF7] hover:border-luxury-gold transition-all relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-mono text-luxury-gold uppercase tracking-wider block mb-1">01. Super Landing Title Hero</span>
                      <h4 className="font-display text-4xl font-normal text-luxury-charcoal tracking-tight mb-2">
                        Sculpture Space
                      </h4>
                      <code className="text-[10px] font-mono text-luxury-slate bg-luxury-sand p-1.5 rounded">font-display text-5xl font-light tracking-tight text-luxury-charcoal</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard("font-display text-5xl font-light tracking-tight text-luxury-charcoal")}
                      className="p-1.5 rounded border border-luxury-stone bg-luxury-cream text-luxury-slate hover:text-luxury-charcoal hover:border-luxury-gold"
                      title="Copy styling class"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Rule Item 2 */}
                <div className="p-4 rounded-xl border border-luxury-stone bg-[#FCFAF7] hover:border-luxury-gold transition-all relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-mono text-luxury-gold uppercase tracking-wider block mb-1">02. Section Sub-Heads &amp; Title Modules</span>
                      <h4 className="font-display text-2xl font-normal text-luxury-charcoal tracking-tight mb-2">
                        Bespoke Interior Curations
                      </h4>
                      <code className="text-[10px] font-mono text-luxury-slate bg-luxury-sand p-1.5 rounded">font-display text-3xl text-luxury-charcoal tracking-tight</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard("font-display text-3xl text-luxury-charcoal tracking-tight")}
                      className="p-1.5 rounded border border-luxury-stone bg-luxury-cream text-luxury-slate hover:text-luxury-charcoal hover:border-luxury-gold"
                      title="Copy styling class"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Rule Item 3 */}
                <div className="p-4 rounded-xl border border-luxury-stone bg-[#FCFAF7] hover:border-luxury-gold transition-all relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-mono text-luxury-gold uppercase tracking-wider block mb-1">03. Body Copy Guidelines</span>
                      <p className="font-sans text-sm text-luxury-slate leading-relaxed mb-2 max-w-lg">
                        Our platform serves as a modern digital design director. Spacing, typography scale, and premium color matrices reflect real architecture, ensuring clean space and quiet elegance.
                      </p>
                      <code className="text-[10px] font-mono text-luxury-slate bg-luxury-sand p-1.5 rounded">font-sans text-sm text-luxury-slate leading-relaxed font-light</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard("font-sans text-sm text-luxury-slate leading-relaxed font-light")}
                      className="p-1.5 rounded border border-luxury-stone bg-luxury-cream text-luxury-slate hover:text-luxury-charcoal hover:border-luxury-gold"
                      title="Copy styling class"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab: Spacing */}
      {activeTab === "spacing" && (
        <section className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-mono text-xs text-luxury-accent uppercase tracking-widest font-semibold flex items-center gap-2">
                <Code className="w-4 h-4" /> Layout &amp; Margin Balance
              </h3>
              <p className="text-sm text-luxury-slate leading-relaxed font-sans">
                True architectural geometry is built on silence. We implement responsive, proportional spacing coordinates rather than static margins to create room breathing volume.
              </p>
              <div className="p-4 bg-luxury-sand rounded-xl border border-luxury-stone space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-luxury-slate block">Wireframe Guidelines:</span>
                <p className="text-[11px] text-luxury-charcoal font-sans leading-relaxed">
                  Avoid clamping card margins tighter than 24px (1.5rem). Sections must be buffered with a minimum 64px vertical clearance margin on mobile and 128px on full desktop resolutions.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <h4 className="text-xs font-mono text-luxury-slate tracking-widest uppercase">SPATIAL GRID EXPOSURE</h4>
              <div className="space-y-4 text-xs font-mono">
                {/* Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 p-3 bg-white border border-luxury-stone rounded-lg hover:border-luxury-gold transition-all">
                  <div className="w-44">
                    <span className="text-xs font-semibold text-luxury-charcoal">Micro Margin - 0.25rem</span>
                    <span className="text-[10px] text-luxury-slate block">Gap tracking, tag metrics</span>
                  </div>
                  <div className="flex-1 w-full bg-luxury-sand h-3 rounded overflow-hidden">
                    <div className="bg-luxury-accent h-full w-[4%]" />
                  </div>
                  <code className="text-[10px] bg-luxury-cream px-2 py-1 border border-luxury-stone rounded">p-1 / gap-1</code>
                </div>

                {/* Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 p-3 bg-white border border-luxury-stone rounded-lg hover:border-luxury-gold transition-all">
                  <div className="w-44">
                    <span className="text-xs font-semibold text-luxury-charcoal">Element Padding - 1rem</span>
                    <span className="text-[10px] text-luxury-slate block">Standard interior button buffers</span>
                  </div>
                  <div className="flex-1 w-full bg-luxury-sand h-3 rounded overflow-hidden">
                    <div className="bg-luxury-accent h-full w-[16%]" />
                  </div>
                  <code className="text-[10px] bg-luxury-cream px-2 py-1 border border-luxury-stone rounded">p-4 / gap-4</code>
                </div>

                {/* Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 p-3 bg-white border border-luxury-stone rounded-lg hover:border-luxury-gold transition-all">
                  <div className="w-44">
                    <span className="text-xs font-semibold text-luxury-charcoal">Card Buffer - 2rem</span>
                    <span className="text-[10px] text-luxury-slate block">Dashboard padding boundaries</span>
                  </div>
                  <div className="flex-1 w-full bg-luxury-sand h-3 rounded overflow-hidden">
                    <div className="bg-luxury-accent h-full w-[32%]" />
                  </div>
                  <code className="text-[10px] bg-luxury-cream px-2 py-1 border border-luxury-stone rounded">p-8 / gap-8</code>
                </div>

                {/* Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 p-3 bg-white border border-luxury-stone rounded-lg hover:border-luxury-gold transition-all">
                  <div className="w-44">
                    <span className="text-xs font-semibold text-luxury-charcoal">Section Block - 6rem</span>
                    <span className="text-[10px] text-luxury-slate block">Vertical divider volume space</span>
                  </div>
                  <div className="flex-1 w-full bg-luxury-sand h-3 rounded overflow-hidden">
                    <div className="bg-luxury-accent h-full w-[96%]" />
                  </div>
                  <code className="text-[10px] bg-luxury-cream px-2 py-1 border border-luxury-stone rounded">py-24 / my-24</code>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab: Colors */}
      {activeTab === "colors" && (
        <section className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-mono text-xs text-luxury-accent uppercase tracking-widest font-semibold flex items-center gap-2">
                <Code className="w-4 h-4" /> Hex Color Matrix
              </h3>
              <p className="text-sm text-luxury-slate leading-relaxed font-sans">
                Our luxury core palette avoids cheap visual saturation and bright gradients. Instead, it respects the mineral colors found in architectural structures.
              </p>
              <div className="p-4 bg-luxury-sand rounded-xl border border-luxury-stone space-y-1 text-xs">
                <span className="font-semibold block text-luxury-charcoal">Contrast Ratio Assurance</span>
                <span className="text-luxury-slate font-light block leading-relaxed">
                  All typography maintains exceeding WCAG AA minimum values to protect display legibility across lighting modes.
                </span>
              </div>
            </div>

            <div className="lg:col-span-8">
              <h4 className="text-xs font-mono text-luxury-slate tracking-widest uppercase mb-4">MAPPED STYLING HEX SWATCHES</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card */}
                <div className="p-4 bg-[#FCFAF7] border border-luxury-stone rounded-xl flex items-center gap-4 hover:border-luxury-gold transition-all relative group">
                  <div className="w-12 h-12 rounded-lg bg-luxury-cream border border-luxury-stone shadow-inner flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-display font-medium text-sm text-luxury-charcoal block">Luxury Cream Background</span>
                    <span className="font-mono text-[11px] text-luxury-slate">#FAF9F6</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("#FAF9F6")}
                    className="p-1 px-2.5 rounded text-[10px] font-mono border border-luxury-stone bg-white text-luxury-slate hover:text-luxury-charcoal hover:border-luxury-gold"
                  >
                    Copy
                  </button>
                </div>

                {/* Card */}
                <div className="p-4 bg-[#FCFAF7] border border-luxury-stone rounded-xl flex items-center gap-4 hover:border-luxury-gold transition-all relative group">
                  <div className="w-12 h-12 rounded-lg bg-luxury-sand border border-luxury-stone shadow-inner flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-display font-medium text-sm text-luxury-charcoal block">Luxury Sand Segment</span>
                    <span className="font-mono text-[11px] text-luxury-slate">#F3EFE9</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("#F3EFE9")}
                    className="p-1 px-2.5 rounded text-[10px] font-mono border border-luxury-stone bg-white text-luxury-slate hover:text-luxury-charcoal hover:border-luxury-gold"
                  >
                    Copy
                  </button>
                </div>

                {/* Card */}
                <div className="p-4 bg-[#FCFAF7] border border-luxury-stone rounded-xl flex items-center gap-4 hover:border-luxury-gold transition-all relative group">
                  <div className="w-12 h-12 rounded-lg bg-luxury-charcoal border border-luxury-stone shadow-inner flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-display font-medium text-sm text-luxury-charcoal block">Luxury Anodized Charcoal</span>
                    <span className="font-mono text-[11px] text-luxury-slate">#1A1A1A</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("#1A1A1A")}
                    className="p-1 px-2.5 rounded text-[10px] font-mono border border-luxury-stone bg-white text-luxury-slate hover:text-luxury-charcoal hover:border-luxury-gold"
                  >
                    Copy
                  </button>
                </div>

                {/* Card */}
                <div className="p-4 bg-[#FCFAF7] border border-luxury-stone rounded-xl flex items-center gap-4 hover:border-luxury-gold transition-all relative group">
                  <div className="w-12 h-12 rounded-lg bg-luxury-gold border border-luxury-stone shadow-inner flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-display font-medium text-sm text-luxury-charcoal block">Luxury Champagne Accent</span>
                    <span className="font-mono text-[11px] text-luxury-slate">#C2B095</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("#C2B095")}
                    className="p-1 px-2.5 rounded text-[10px] font-mono border border-luxury-stone bg-white text-luxury-slate hover:text-luxury-charcoal hover:border-luxury-gold"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab: Components */}
      {activeTab === "components" && (
        <section className="space-y-6 animate-fade-in col-span-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 bg-white border border-luxury-stone rounded-xl space-y-4">
              <span className="text-[10px] font-mono text-luxury-gold tracking-widest uppercase block">UX ELEMENT 01. PRESERVED SOLID BUTTON</span>
              <div className="flex gap-4 items-center">
                <button className="px-6 py-3 bg-luxury-charcoal text-luxury-cream text-xs font-mono tracking-widest uppercase hover:bg-luxury-charcoal/95 border border-luxury-charcoal transition-all rounded shadow-md">
                  RENDER LUXURY SPACE
                </button>
                <button className="px-6 py-3 border border-luxury-stone bg-luxury-cream text-luxury-accent hover:text-luxury-charcoal hover:border-luxury-gold text-xs font-mono tracking-widest uppercase transition-all rounded">
                  CANCEL DESIGN
                </button>
              </div>
              <p className="text-xs font-sans text-luxury-slate leading-relaxed">
                Primary actions are enclosed within a strict rectangular form (or minimum 2px rounding) featuring micro letter spacing and bold luxury uppercase fonts. Understated secondary links feature light border curves.
              </p>
            </div>

            <div className="p-6 bg-white border border-luxury-stone rounded-xl space-y-4">
              <span className="text-[10px] font-mono text-luxury-gold tracking-widest uppercase block">UX ELEMENT 02. PREMIUM CARD DEFINITION</span>
              <div className="p-5 bg-luxury-cream border border-luxury-stone rounded-xl space-y-2">
                <div className="flex justify-between items-center border-b border-luxury-stone pb-2">
                  <span className="text-xs font-mono text-luxury-accent">MATERAILS DECK</span>
                  <span className="text-[10px] font-mono text-luxury-slate font-semibold uppercase">03 METALS</span>
                </div>
                <h4 className="font-display font-medium text-base text-luxury-charcoal">Roman Honed Travertine</h4>
                <p className="text-xs text-luxury-slate font-light leading-relaxed">
                  Recommended for monumental hearth platforms, low-slung table elements, and bespoke custom foyer benches.
                </p>
              </div>
              <p className="text-xs font-sans text-luxury-slate leading-relaxed">
                Cards feature a 1px boundary shadow border, a very subtle header line divider separator, and absolute alignment with the surrounding grid systems.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
