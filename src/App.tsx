import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Sliders,
  Maximize2,
  Bookmark,
  Shield,
  Layers,
  HelpCircle,
  Code,
  Layout,
  Instagram,
  Heart,
  Globe,
  Award,
  Zap,
  Volume2,
  Ruler,
  ChevronDown,
  Mail,
  UserCheck,
  Sun
} from "lucide-react";
import BeforeAfterSlider from "./components/BeforeAfterSlider";
import DesignSystemSpecs from "./components/DesignSystemSpecs";
import InteractiveAppDashboard from "./components/InteractiveAppDashboard";
import InteractiveStylesGallery from "./components/InteractiveStylesGallery";
import { PRESET_ROOMS, DESIGN_STYLES } from "./types";
import { auth, db, googleProvider } from "./lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function App() {
  // Navigation view router: landing, studio, specs
  const [currentView, setCurrentView] = useState<"landing" | "studio" | "specs">("landing");
  const [userId, setUserId] = useState<string | null>(null);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUserId(user ? user.uid : null);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
           await setDoc(userRef, {
             uid: user.uid,
             email: user.email,
             tier: "Explorer (Free)",
             credits: 5,
             createdAt: serverTimestamp(),
             updatedAt: serverTimestamp()
           });
        }
      }
    });
    return unsub;
  }, []);
  
  // Interactive UI configurations
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");
  const [selectedGalleryStyle, setSelectedGalleryStyle] = useState<number>(0);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // FAQ List
  const FAQ_ITEMS = [
    {
      q: "How does the spatial AI model synthesize room acoustics and scale?",
      a: "Our core spatial design engine uses advanced generative parameters trained on luxury architectural guidelines. Rather than applying superficial filter modifications, it maps physical boundaries, analyzes light vectors from door and window apertures, and synthesizes accurate material reflections to preserve natural ergonomics."
    },
    {
      q: "Can I upload photographs of raw, unfinished, or highly cluttered environments?",
      a: "Absolutely. The engine excels at reading through clutter or structural raw states, tracing the baseline drywall partitions, structural lintels, and window openings to construct a pristine layout baseline before modeling your chosen design style."
    },
    {
      q: "How does the custom corporate consultation service operate?",
      a: "For Studio Enterprise users, we offer high-throughput API keys, dedicated rendering channels, and customized material matrices. You can seed the model with specific furniture catalogs or acoustic-coefficient materials to enforce rigid commercial corporate guidelines."
    },
    {
      q: "Is there any persistent export option for CAD, BIM, or vector systems?",
      a: "Our Atelier Pro and Enterprise plans allow users to export compiled design blueprints, paint swatches, lighting lists, and dimensional spatial estimates directly into high-fidelity PDF spreadsheets suitable for contractors."
    }
  ];

  const handleSubNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail("");
      }, 5000);
    }
  };

  const selectedGalleryInfo = DESIGN_STYLES[selectedGalleryStyle];

  return (
    <div id="application-root" className="min-h-screen bg-luxury-cream text-luxury-charcoal font-sans antialiased selection:bg-luxury-gold selection:text-luxury-charcoal flex flex-col justify-between">
      
      {/* Premium Luxury Header / Navigation */}
      <header className="sticky top-0 z-40 bg-luxury-cream/85 backdrop-blur-md border-b border-luxury-stone">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView("landing")}>
            <div className="w-8 h-8 rounded bg-luxury-charcoal flex items-center justify-center text-luxury-gold border border-luxury-accent/30 font-display font-medium text-lg">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base font-semibold tracking-wider text-luxury-charcoal uppercase leading-none">
                ATELIER AURA
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#8E7C68] uppercase font-bold mt-0.5">
                Spatial Intelligence • AI
              </span>
            </div>
          </div>

          {/* Nav middle links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setCurrentView("landing")}
              className={`text-xs font-mono tracking-wider uppercase transition-all ${
                currentView === "landing" ? "text-luxury-accent font-semibold" : "text-luxury-slate hover:text-luxury-charcoal"
              }`}
            >
              Exhibition
            </button>
            <button
              onClick={() => {
                setCurrentView("landing");
                setTimeout(() => {
                  document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="text-xs font-mono tracking-wider uppercase text-luxury-slate hover:text-luxury-charcoal transition-all"
            >
              Aesthetic Logic
            </button>
            <button
              onClick={() => {
                setCurrentView("landing");
                setTimeout(() => {
                  document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="text-xs font-mono tracking-wider uppercase text-luxury-slate hover:text-luxury-charcoal transition-all"
            >
              Plans
            </button>
            <button
              onClick={() => setCurrentView("specs")}
              className={`text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                currentView === "specs" ? "text-luxury-accent font-semibold" : "text-luxury-slate hover:text-luxury-charcoal"
              }`}
            >
              <Code className="w-3.5 h-3.5 text-luxury-gold" />
              Design System System Specs
            </button>
          </nav>

          {/* CTA Button switch */}
          <div className="flex items-center gap-4">
            {userId ? (
              <button
                onClick={() => signOut(auth)}
                className="px-4 py-2 border border-luxury-stone hover:border-luxury-gold text-luxury-charcoal text-[10px] font-mono tracking-widest uppercase rounded bg-white transition-all shadow-sm"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => signInWithPopup(auth, googleProvider)}
                className="px-4 py-2 border border-luxury-stone hover:border-luxury-gold text-luxury-charcoal text-[10px] font-mono tracking-widest uppercase rounded bg-white transition-all shadow-sm"
              >
                Sign In
              </button>
            )}

            {currentView !== "studio" ? (
              <button
                onClick={() => setCurrentView("studio")}
                className="px-5 py-2.5 bg-luxury-charcoal hover:bg-luxury-black border border-luxury-charcoal hover:border-luxury-gold text-luxury-cream text-xs font-mono tracking-widest uppercase rounded shadow transition-all flex items-center gap-2 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                Spatial Studio App
                <ArrowRight className="w-3 h-3 text-luxury-gold transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentView("landing")}
                className="px-5 py-2.5 border border-luxury-stone hover:border-luxury-gold text-luxury-charcoal text-xs font-mono tracking-widest uppercase rounded bg-white transition-all shadow-sm"
              >
                Return to Exhibition
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Primary Application Route Dispatcher */}
      <div className="flex-grow">
        
        {/* VIEW: ARCHITECTURAL DASHBOARD STUDIO WORKSPACE */}
        {currentView === "studio" && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Context breadcrumb header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase bg-luxury-stone text-[#8E7C68]">
                    STUDY MODE ACTIVE
                  </span>
                  <span className="text-[10px] font-mono text-luxury-gold tracking-widest uppercase">
                    GEMINI-3.5-FLASH COMPLIANT
                  </span>
                </div>
                <h1 className="font-display text-3xl text-luxury-charcoal tracking-tight font-medium">
                  Bespoke Design Lab Workspace
                </h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentView("specs")}
                  className="px-4 py-2 border border-luxury-stone hover:border-luxury-gold bg-white text-luxury-slate hover:text-luxury-charcoal text-xs font-mono uppercase tracking-wider rounded transition-all"
                >
                  Inspect Structural Code Rules
                </button>
              </div>
            </div>

            {/* Complete studio dashboard */}
            <InteractiveAppDashboard />
          </div>
        )}

        {/* VIEW: SYSTEM PLATES & CODE SPECS */}
        {currentView === "specs" && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <DesignSystemSpecs />
          </div>
        )}

        {/* VIEW: MAIN LUXURY LANDING MARKETING HOME */}
        {currentView === "landing" && (
          <div>
            
            {/* HERO SECTION */}
            <section id="hero-section" className="relative py-20 px-6 md:py-28 overflow-hidden bg-[#FAF9F6] border-b border-luxury-stone">
              <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
                
                {/* Visual Label */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-luxury-stone rounded-full shadow-sm animate-fade-in">
                  <Award className="w-3.5 h-3.5 text-luxury-gold" />
                  <span className="text-[10px] font-mono tracking-widest text-[#8E7C68] uppercase font-semibold">
                    100M STARTUP CONCEPT • HUMAN-CENTERED AI DESIGN
                  </span>
                </div>

                {/* Main majestic typography */}
                <div className="space-y-4 max-w-4xl mx-auto">
                  <h1 className="font-display font-light text-5xl md:text-7xl lg:text-8xl text-luxury-charcoal tracking-tight leading-none">
                    Spaces where mind <br className="hidden md:inline" />
                    finds <span className="italic font-normal">tranquility.</span>
                  </h1>
                  <p className="font-sans text-base md:text-lg text-luxury-slate max-w-2xl mx-auto font-light leading-relaxed">
                    Designed for avant-garde spatial architects and editorial homeowners. Harness server-side AI spatial models to compile human-grade interior blueprints in absolute high-fidelity.
                  </p>
                </div>

                {/* Hero CTAs */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button
                    onClick={() => setCurrentView("studio")}
                    className="w-full sm:w-auto px-8 py-4 bg-luxury-charcoal hover:bg-luxury-black text-white text-xs font-mono tracking-widest uppercase shadow-xl transition-all rounded border border-luxury-charcoal hover:border-luxury-gold flex items-center justify-center gap-2 group"
                  >
                    <Sparkles className="w-4 h-4 text-luxury-gold" />
                    Enter Spatial Studio
                    <ArrowRight className="w-3.5 h-3.5 text-luxury-gold transition-transform group-hover:translate-x-1" />
                  </button>
                  <button
                    onClick={() => setCurrentView("specs")}
                    className="w-full sm:w-auto px-8 py-4 border border-luxury-stone hover:border-luxury-gold bg-white text-luxury-charcoal text-xs font-mono tracking-widest uppercase transition-all rounded shadow-sm flex items-center justify-center gap-2"
                  >
                    <Code className="w-4 h-4 text-luxury-accent" />
                    Inspect Design System Rules
                  </button>
                </div>

                {/* Master Before and After Slider in Hero */}
                <div className="max-w-5xl mx-auto pt-10">
                  <div className="p-3 bg-white border border-luxury-stone rounded-2xl shadow-xl">
                    <BeforeAfterSlider
                      beforeImage={PRESET_ROOMS[0].beforeImage}
                      afterImage={PRESET_ROOMS[0].afterImage}
                      beforeLabel="Empty Bare Concrete Environment"
                      afterLabel="Aura Studio AI • Elegant Oak Lounge"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* STATISTICS / SOCIAL PROOF STRIP */}
            <section className="py-12 bg-white border-b border-luxury-stone">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <span className="block font-display text-3xl md:text-4xl text-luxury-charcoal font-light">38,500+</span>
                    <span className="block text-[10px] font-mono text-[#8E7C68] tracking-widest uppercase mt-1 font-semibold">Residences Rendered</span>
                  </div>
                  <div>
                    <span className="block font-display text-3xl md:text-4xl text-luxury-charcoal font-light">4.92 / 5.0</span>
                    <span className="block text-[10px] font-mono text-[#8E7C68] tracking-widest uppercase mt-1 font-semibold">Client Satisfaction</span>
                  </div>
                  <div>
                    <span className="block font-display text-3xl md:text-4xl text-luxury-charcoal font-light">128+</span>
                    <span className="block text-[10px] font-mono text-[#8E7C68] tracking-widest uppercase mt-1 font-semibold">Editorial Styles Compiled</span>
                  </div>
                  <div>
                    <span className="block font-display text-3xl md:text-4xl text-luxury-charcoal font-light">0.05ms</span>
                    <span className="block text-[10px] font-mono text-[#8E7C68] tracking-widest uppercase mt-1 font-semibold">Latency Peak</span>
                  </div>
                </div>

                {/* Prominent Architectural Firms Affiliation Badges */}
                <div className="mt-12 pt-8 border-t border-luxury-stone flex flex-wrap justify-center items-center gap-8 md:gap-16 text-center opacity-70">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#8E7C68] font-bold">ATELIER VAN DUYSEN</span>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#8E7C68] font-bold">YOVANOVITCH CO.</span>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#8E7C68] font-bold">KENGO KUMA WORLD</span>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#8E7C68] font-bold">AXEL VERVOORDT SYSTEM</span>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="py-20 px-6 bg-luxury-sand border-b border-luxury-stone">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-[10px] font-mono text-luxury-gold tracking-widest uppercase font-bold">THE CREATIVE PIPELINE</span>
                  <h2 className="font-display text-3xl md:text-4xl text-luxury-charcoal tracking-tight">
                    How Atelier Aura Models Spaces
                  </h2>
                  <p className="text-sm font-sans text-luxury-slate font-light leading-relaxed">
                    A three-step human-centered logical flow that transforms uploaded snapshots into cohesive material specifications and visual clarity.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Step 1 */}
                  <div className="p-6 bg-white border border-luxury-stone rounded-xl space-y-4 shadow-sm hover:border-luxury-gold transition-all">
                    <span className="font-display text-4xl text-[#EAE5DE] font-semibold block">01</span>
                    <h3 className="font-display text-lg text-luxury-charcoal font-medium">Ingest Spatial Photo</h3>
                    <p className="text-xs font-sans text-luxury-slate leading-relaxed font-light">
                      Upload any photograph of your empty structure, historical salon, or unfinished drywall framing. Our boundary model immediately detects structural clearances and door contours.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-6 bg-white border border-luxury-stone rounded-xl space-y-4 shadow-sm hover:border-luxury-gold transition-all">
                    <span className="font-display text-4xl text-[#EAE5DE] font-semibold block">02</span>
                    <h3 className="font-display text-lg text-luxury-charcoal font-medium">Refine Aesthetic Rules</h3>
                    <p className="text-xs font-sans text-luxury-slate leading-relaxed font-light">
                      Select your architectural style, from soft Scandinavian Modern to highly formaluxe Editorial. Specify materials and custom directivestext inputs to enforce absolute material discipline.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-6 bg-white border border-luxury-stone rounded-xl space-y-4 shadow-sm hover:border-luxury-gold transition-all">
                    <span className="font-display text-4xl text-[#EAE5DE] font-semibold block">03</span>
                    <h3 className="font-display text-lg text-luxury-charcoal font-medium">Synthesize Design System</h3>
                    <p className="text-xs font-sans text-luxury-slate leading-relaxed font-light">
                      Run the design compilation. The high-capacity server-side model generates complete travertine swatches, lighting fixture placement coordinates, and specific furniture selections.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* MODERN DESIGN STYLES EXHIBITION GALLERY */}
            <section className="py-20 px-6 bg-white border-b border-luxury-stone">
              <div className="max-w-7xl mx-auto space-y-12">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-luxury-gold tracking-widest uppercase font-bold">STYLES EXHIBITION</span>
                    <h2 className="font-display text-3xl md:text-4xl text-luxury-charcoal tracking-tight">
                      Curate Timeless Architectural Eras
                    </h2>
                  </div>
                  <p className="text-xs font-sans text-luxury-slate max-w-md font-light leading-relaxed">
                    Click each design style tag to view the editorial description and spatial characteristics crafted in our spatial laboratory.
                  </p>
                </div>

                {/* High-Fidelity Interactive Style Cycling & Spatial Ingestion In-situ demonstration */}
                <InteractiveStylesGallery />

              </div>
            </section>

            {/* DESIGNER AI FEATURES SECTION */}
            <section id="features-section" className="py-20 px-6 bg-luxury-sand border-b border-luxury-stone">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-[10px] font-mono text-luxury-gold tracking-widest uppercase font-bold">INTELLIGENT CRITERIA</span>
                  <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A] tracking-tight">
                    Spatial AI Engineered For Sophisticated Eyes
                  </h2>
                  <p className="text-sm font-sans text-luxury-slate font-light leading-relaxed">
                    Developed with high attention to detail. Every lighting model, texture synthesis mapping, and architectural line divider represents real designer logic.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Feature 1 */}
                  <div className="p-6 bg-white border border-luxury-stone rounded-xl space-y-3 hover:border-luxury-gold transition-all">
                    <Sun className="w-6 h-6 text-luxury-accent" />
                    <h4 className="font-display text-base font-semibold text-luxury-charcoal">Circadian Lighting Paths</h4>
                    <p className="text-xs font-sans text-luxury-slate leading-relaxed font-light">
                      Our engine estimates window orientations, diffusing morning light rays and soft sunset shadows beautifully across microcement floors.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="p-6 bg-white border border-luxury-stone rounded-xl space-y-3 hover:border-luxury-gold transition-all">
                    <Ruler className="w-6 h-6 text-luxury-accent" />
                    <h4 className="font-display text-base font-semibold text-luxury-charcoal">Structural clearance ratios</h4>
                    <p className="text-xs font-sans text-luxury-slate leading-relaxed font-light">
                      Adheres strictly to human clearance parameters. We avoid cluttered, cramped arrangements, leaving 35% of room footprints empty to preserve mental calm.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="p-6 bg-white border border-luxury-stone rounded-xl space-y-3 hover:border-luxury-gold transition-all">
                    <Bookmark className="w-6 h-6 text-luxury-accent" />
                    <h4 className="font-display text-base font-semibold text-luxury-charcoal">Organic Material deck</h4>
                    <p className="text-xs font-sans text-luxury-slate leading-relaxed font-light">
                      Includes refined selections of physical materials: honed Roman travertine, Charred Shou Sugi Ban boards, heavy Belgian linen upholstery, and brushed bronze metals.
                    </p>
                  </div>

                  {/* Feature 4 */}
                  <div className="p-6 bg-white border border-luxury-stone rounded-xl space-y-3 hover:border-luxury-gold transition-all">
                    <Volume2 className="w-6 h-6 text-luxury-accent" />
                    <h4 className="font-display text-base font-semibold text-luxury-charcoal">Atmospheric Volume Balance</h4>
                    <p className="text-xs font-sans text-luxury-slate leading-relaxed font-light">
                      Balances wood density with soft fabrics, simulating acoustic warmth and visual calm tailored to each room's dimensions.
                    </p>
                  </div>

                  {/* Feature 5 */}
                  <div className="p-6 bg-white border border-luxury-stone rounded-xl space-y-3 hover:border-luxury-gold transition-all">
                    <Layers className="w-6 h-6 text-luxury-accent" />
                    <h4 className="font-display text-base font-semibold text-luxury-charcoal">Bespoke furniture curations</h4>
                    <p className="text-xs font-sans text-luxury-slate leading-relaxed font-light">
                      We specify furniture selections (e.g., low-slung plaster cove elements, bouclé wool sofas) with style tips to ground layouts beautifully.
                    </p>
                  </div>

                  {/* Feature 6 */}
                  <div className="p-6 bg-white border border-luxury-stone rounded-xl space-y-3 hover:border-luxury-gold transition-all">
                    <Shield className="w-6 h-6 text-luxury-accent" />
                    <h4 className="font-display text-base font-semibold text-luxury-charcoal">Raw Clutter removal</h4>
                    <p className="text-xs font-sans text-luxury-slate leading-relaxed font-light">
                      Reads through messy walls or temporary partitions. Traces the underlying spatial footprint to design a pristine physical canvas.
                    </p>
                  </div>

                </div>
              </div>
            </section>

            {/* PREMIUM PRICING SUBSCRIPTION CARD MODULES */}
            <section id="pricing-section" className="py-20 px-6 bg-white border-b border-luxury-stone">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-[10px] font-mono text-luxury-gold tracking-widest uppercase font-bold">FLEXIBLE ATELIER ACCORD LIMITS</span>
                  <h2 className="font-display text-3xl md:text-4xl text-luxury-charcoal tracking-tight font-medium animate-fade-in">
                    Transparent, Value-Focused Subscriptions
                  </h2>
                  <p className="text-sm font-sans text-luxury-slate max-w-md mx-auto font-light leading-relaxed">
                    Choose an billing cadence that matches your design studio demands. Annual plans unlock an elite 20% membership saving.
                  </p>

                  {/* Period switcher action slider strip */}
                  <div className="pt-4 flex justify-center items-center gap-3">
                    <span className={`text-xs font-mono uppercase tracking-wider ${billingPeriod === "monthly" ? "text-luxury-charcoal font-semibold" : "text-luxury-slate"}`}>Monthly Billings</span>
                    <button
                      onClick={() => setBillingPeriod(prev => prev === "monthly" ? "annual" : "monthly")}
                      className="w-12 h-6 rounded-full bg-luxury-stone p-1 relative flex items-center transition-all focus:outline-none"
                    >
                      <div className={`w-4 h-4 rounded-full bg-luxury-charcoal transition-all ${billingPeriod === "annual" ? "translate-x-6 bg-luxury-accent" : ""}`} />
                    </button>
                    <span className={`text-xs font-mono uppercase tracking-wider ${billingPeriod === "annual" ? "text-luxury-charcoal font-semibold" : "text-luxury-slate"} flex items-center gap-1.5`}>
                      Annual Plan <span className="bg-luxury-accent text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">20% off</span>
                    </span>
                  </div>
                </div>

                {/* Grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Card 1 */}
                  <div className="p-8 bg-[#FCFAF7] border border-luxury-stone rounded-xl flex flex-col justify-between min-h-[440px] hover:border-luxury-gold transition-all relative">
                    <div className="space-y-6">
                      <span className="text-[10px] font-mono text-[#8E7C68] tracking-widest uppercase block font-semibold">Free Explore</span>
                      <div>
                        <span className="font-display text-5xl font-light text-luxury-charcoal">$0</span>
                        <span className="text-[11px] font-mono text-luxury-slate uppercase tracking-wider ml-1">/ monthly</span>
                      </div>
                      <p className="text-xs font-sans text-luxury-slate leading-relaxed font-light">
                        For enthusiasts and spatial design students. Test different styles and experiment with our real-time spatial simulator on curated preset suites.
                      </p>
                      
                      <div className="pt-4 border-t border-luxury-stone text-xs font-sans text-luxury-slate space-y-2">
                        <div className="flex items-center gap-1.5">✓ 5 AI Compilations / month</div>
                        <div className="flex items-center gap-1.5">✓ Classic-6 style access</div>
                        <div className="flex items-center gap-1.5">✓ Standard resolution renderings</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentView("studio")}
                      className="w-full mt-8 py-3 px-4 border border-luxury-stone hover:border-luxury-gold text-luxury-charcoal bg-white font-mono text-xs uppercase tracking-widest rounded transition-all"
                    >
                      Get Started Free
                    </button>
                  </div>

                  {/* Card 2 Recommended */}
                  <div className="p-8 bg-white border-2 border-luxury-accent rounded-xl flex flex-col justify-between min-h-[440px] hover:border-luxury-accent transition-all relative shadow-lg">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-luxury-accent text-white text-[10px] font-mono tracking-widest uppercase font-bold py-1 px-3.5 rounded-full border border-luxury-stone shadow-sm">
                      RECOMMENDED MEMBERSHIP
                    </div>
                    
                    <div className="space-y-6">
                      <span className="text-[10px] font-mono text-luxury-gold tracking-widest uppercase block font-bold">Atelier Pro</span>
                      <div>
                        <span className="font-display text-5xl font-light text-luxury-charcoal">
                          {billingPeriod === "annual" ? "$39" : "$49"}
                        </span>
                        <span className="text-[11px] font-mono text-luxury-slate uppercase tracking-wider ml-1">/ monthly</span>
                      </div>
                      <p className="text-xs font-sans text-[#5E5D57] leading-relaxed font-light">
                        For elite editorial homeowners and custom residential creators. Full access to server-side model nodes and downloadable specification sheets.
                      </p>
                      
                      <div className="pt-4 border-t border-luxury-stone text-xs font-sans text-luxury-slate space-y-2">
                        <div className="flex items-center gap-1.5">✓ 100 high-fidelity AI Compilations / month</div>
                        <div className="flex items-center gap-1.5">✓ Full access to Luxury, Japandi &amp; Scandinavian</div>
                        <div className="flex items-center gap-1.5">✓ Complete paint, lighting, and layout spreadsheets</div>
                        <div className="flex items-center gap-1.5">✓ Export beautiful 4K high-resolution sheets</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentView("studio")}
                      className="w-full mt-8 py-3.5 px-4 bg-luxury-charcoal hover:bg-luxury-black text-white text-xs font-mono uppercase tracking-widest rounded shadow hover:border hover:border-luxury-gold transition-all"
                    >
                      Acquire Atelier Pro
                    </button>
                  </div>

                  {/* Card 3 */}
                  <div className="p-8 bg-[#FCFAF7] border border-luxury-stone rounded-xl flex flex-col justify-between min-h-[440px] hover:border-luxury-gold transition-all relative">
                    <div className="space-y-6">
                      <span className="text-[10px] font-mono text-[#8E7C68] tracking-widest uppercase block font-semibold font-bold">Studio Enterprise</span>
                      <div>
                        <span className="font-display text-5xl font-light text-luxury-charcoal">
                          {billingPeriod === "annual" ? "$150" : "$190"}
                        </span>
                        <span className="text-[11px] font-mono text-luxury-slate uppercase tracking-wider ml-1">/ monthly</span>
                      </div>
                      <p className="text-xs font-sans text-luxury-slate leading-relaxed font-light">
                        For multi-designer architectural studios and real estate developments requiring extreme rendering throughput, visual libraries, and custom styling profiles.
                      </p>
                      
                      <div className="pt-4 border-t border-luxury-stone text-xs font-sans text-luxury-slate space-y-2">
                        <div className="flex items-center gap-1.5">✓ Unlimited high-capacity spatial generations</div>
                        <div className="flex items-center gap-1.5">✓ Dedicated system rendering pipelines</div>
                        <div className="flex items-center gap-1.5">✓ Seed your custom furniture catalogues</div>
                        <div className="flex items-center gap-1.5">✓ Developer API access &amp; webhook logs</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentView("studio")}
                      className="w-full mt-8 py-3 px-4 border border-luxury-stone hover:border-luxury-gold text-luxury-charcoal bg-white font-mono text-xs uppercase tracking-widest rounded transition-all"
                    >
                      Connect Enterprise
                    </button>
                  </div>

                </div>
              </div>
            </section>

            {/* ACCORDION FAQ SECTION */}
            <section className="py-20 px-6 bg-luxury-sand border-b border-luxury-stone">
              <div className="max-w-4xl mx-auto space-y-12">
                
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-[10px] font-mono text-luxury-gold tracking-widest uppercase font-bold">FAQ SERVICE INTERSECTION</span>
                  <h2 className="font-display text-3xl text-luxury-charcoal tracking-tight font-medium">
                    Common Questions &amp; Answers
                  </h2>
                  <p className="text-xs font-sans text-luxury-slate leading-relaxed font-light">
                    Review specifications about spatial calculations, photograph ingestion, and subscription credit management rules.
                  </p>
                </div>

                {/* FAQ Items accordion list */}
                <div className="space-y-4">
                  {FAQ_ITEMS.map((item, index) => {
                    const isExpanded = expandedFaqIndex === index;
                    return (
                      <div
                        key={index}
                        className="bg-white border border-luxury-stone rounded-xl overflow-hidden hover:border-luxury-gold transition-all"
                      >
                        <button
                          onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                          className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                        >
                          <span className="text-xs md:text-sm font-display font-medium text-luxury-charcoal">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-luxury-accent transition-transform duration-300 shrink-0 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        
                        <div
                          className={`px-6 overflow-hidden transition-all duration-300 ease-out ${
                            isExpanded ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <p className="text-xs font-sans text-[#5E5D57] font-light leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>

            {/* ELEGANT NEWSLETTER STRIP */}
            <section className="py-16 px-6 bg-luxury-charcoal text-luxury-cream text-center relative overflow-hidden">
              <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                <span className="text-[10px] font-mono text-luxury-gold tracking-widest uppercase block font-bold">THE ATELIER BULLETIN</span>
                <h2 className="font-display text-3xl font-light">Join the Circle</h2>
                <p className="text-xs font-sans text-stone-300 font-light leading-relaxed max-w-md mx-auto">
                  Receive selective architectural portfolios, material releases, and advancements in spatial engineering delivered bi-weekly.
                </p>

                {newsletterSubscribed ? (
                  <div className="p-4 bg-white/10 border border-luxury-gold/50 rounded-xl max-w-sm mx-auto flex items-center justify-center gap-2 animate-fade-in">
                    <UserCheck className="w-4 h-4 text-luxury-gold animate-bounce" />
                    <span className="text-xs font-mono text-luxury-cream">Email address verified. Welcome to Atelier.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubNewsletter} className="flex gap-2 max-w-md mx-auto">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Write your email address"
                      required
                      className="flex-grow bg-white/10 border border-white/20 px-4 py-3 text-xs placeholder-stone-400 font-sans focus:border-luxury-gold focus:outline-none text-white rounded"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 bg-white text-luxury-charcoal hover:bg-luxury-gold hover:text-luxury-charcoal uppercase text-xs font-mono tracking-widest rounded transition-all"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </section>

          </div>
        )}

      </div>

      {/* ULTRA-PREMIUM LUXURY FOOTER */}
      <footer className="bg-[#FAF9F6] border-t border-luxury-stone py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-luxury-stone">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-luxury-charcoal flex items-center justify-center text-luxury-gold border border-white/10 font-display font-medium text-base">
                A
              </div>
              <span className="font-display text-sm font-semibold tracking-wider text-luxury-charcoal uppercase">
                ATELIER AURA
              </span>
            </div>
            <p className="text-[11px] font-sans text-luxury-slate font-light leading-relaxed">
              Synthesizing high-end human-designed interior specifications through secure server-side AI model nodes to deliver absolute structural sanctuary.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-mono text-luxury-accent uppercase font-bold tracking-widest mb-3">EXHIBIT CHANNELS</h4>
            <ul className="space-y-2 text-xs font-sans text-luxury-slate font-light">
              <li><button onClick={() => setCurrentView("landing")} className="hover:text-luxury-charcoal transition-colors">Digital Portfoliorender</button></li>
              <li><button onClick={() => setCurrentView("landing")} className="hover:text-luxury-charcoal transition-colors">Residential Archives</button></li>
              <li><button onClick={() => setCurrentView("landing")} className="hover:text-luxury-charcoal transition-colors">Custom Commercial Ateliers</button></li>
              <li><button onClick={() => setCurrentView("landing")} className="hover:text-luxury-charcoal transition-colors">Lighting Lumens Studies</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-mono text-luxury-accent uppercase font-bold tracking-widest mb-3">ENGINE SPEC REFERENCES</h4>
            <ul className="space-y-2 text-xs font-sans text-luxury-slate font-light">
              <li><button onClick={() => setCurrentView("specs")} className="hover:text-luxury-charcoal transition-colors">Typography scale specs</button></li>
              <li><button onClick={() => setCurrentView("specs")} className="hover:text-luxury-charcoal transition-colors">Spatial padding boundaries</button></li>
              <li><button onClick={() => setCurrentView("specs")} className="hover:text-luxury-charcoal transition-colors">Travertine Hex standards</button></li>
              <li><button onClick={() => setCurrentView("specs")} className="hover:text-luxury-charcoal transition-colors">Bespoke button codes</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-mono text-luxury-accent uppercase font-bold tracking-widest mb-3">SYSTEM NODES</h4>
            <ul className="space-y-2 text-xs font-sans text-[#5E5D57] font-light">
              <li className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-luxury-gold" /> Server Status: Secure 100%</li>
              <li className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-luxury-gold" /> SSL Endpoint Protected</li>
              <li className="text-[10px] text-luxury-slate font-mono mt-2 uppercase">Atelier client: Active</li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-mono text-luxury-slate">
          <span>© {new Date().getFullYear()} ATELIER AURA CO. ALL REGISTERED RIGHTS SECURED.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[10px]">CRAFTED WITH <Heart className="w-3 h-3 text-rose-700 animate-pulse" /> FOR SOULFUL ARCHITECTURES</span>
            <Instagram className="w-4 h-4 cursor-pointer hover:text-luxury-gold transition-colors" />
          </div>
        </div>
      </footer>

    </div>
  );
}
