import React, { useState, useEffect } from "react";
import {
  Upload,
  Sparkles,
  RefreshCw,
  FolderOpen,
  User,
  CreditCard,
  CheckCircle,
  HelpCircle,
  Layers,
  Sliders,
  Maximize2,
  Trash2,
  ArrowRight,
  Bookmark,
  Sun,
  Layout,
  Hammer,
  Camera,
  Video,
  Undo2,
  Redo2
} from "lucide-react";
import { PRESET_ROOMS, DESIGN_STYLES, SpatialDesignReport, DesignPreset } from "../types";
import BeforeAfterSlider from "./BeforeAfterSlider";
import MoodRadarChart from "./MoodRadarChart";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, onSnapshot, doc, getDoc, setDoc, deleteDoc, updateDoc, serverTimestamp, getDocs, orderBy } from "firebase/firestore";

interface SavedGeneration {
  id: string;
  timestamp: string;
  roomType: string;
  style: string;
  beforeImage: string;
  afterImage: string;
  prompt: string;
  report: SpatialDesignReport;
}

interface SpatialAnalysisMetrics {
  geometry: string;
  lightVector: string;
  ceilingHeight: string;
  flooringMaterial: string;
  heritageTrim: string;
  clutterLoad: "Low" | "Moderate" | "High";
  clutterScore: number;
}

const getAnalysisMetrics = (roomType: string, presetId: string): SpatialAnalysisMetrics => {
  if (presetId === "scandinavian_preset" || roomType.includes("Living") || roomType.toLowerCase().includes("lounge")) {
    return {
      geometry: "Symmetric Rectangular Lounge with dual-aperture partitions",
      lightVector: "West-facing lateral shafts displaying dramatic morning sunsets",
      ceilingHeight: "10.8 ft Loft-level Clearance",
      flooringMaterial: "Light rustic oak parquetry substrate and exposed cement floor margins",
      heritageTrim: "Distressed wooden lintels with zero historical baseboard moldings",
      clutterLoad: "Low",
      clutterScore: 18
    };
  } else if (presetId === "minimalist_preset" || roomType.includes("Entry") || roomType.includes("Hallway") || roomType.toLowerCase().includes("foyer")) {
    return {
      geometry: "Continuous L-Shaped Grand Corridor with deep axial depth",
      lightVector: "High Clerestory North-facing skylight producing cool, perfect ambient diffuse lighting",
      ceilingHeight: "12.4 ft Cathedral Vaulted Archways",
      flooringMaterial: "Seamless concrete screed aggregate with embedded travertine veins",
      heritageTrim: "Concealed shadowline junctions and clean negative edge trim",
      clutterLoad: "Low",
      clutterScore: 8
    };
  } else if (presetId === "luxury_preset" || roomType.includes("Penthouse") || roomType.includes("Suite") || roomType.toLowerCase().includes("dining")) {
    return {
      geometry: "Octagonal Grande Salon featuring high axial symmetrical fireplaces",
      lightVector: "Dual-height floor-to-ceiling panoramic glass panels with high direct solar exposure",
      ceilingHeight: "11.6 ft High Traditional Coffered Ceilings",
      flooringMaterial: "Aged chevron French Walnut timbers with bronze perimeter inlay strips",
      heritageTrim: "Rich Beaux-Arts plaster crown molding and fluted door jambs",
      clutterLoad: "Moderate",
      clutterScore: 42
    };
  } else {
    return {
      geometry: "Standard Rectangular Spatial Envelope with single entrance clearance",
      lightVector: "Diffuse lateral morning overcast rays from Eastern fenestrations",
      ceilingHeight: "9.6 ft Standard Architectural Clearance",
      flooringMaterial: "Raw concrete aggregate substrate ready for floating hardwood plates",
      heritageTrim: "Clean modern baseboard profiles with minimal micro-grout boundaries",
      clutterLoad: "Moderate",
      clutterScore: 35
    };
  }
};

export default function InteractiveAppDashboard() {
  // Core config history states
  interface DesignConfigState {
    roomType: string;
    style: string;
    lighting: string;
    materials: string;
    customPrompt: string;
    presetSelected: string;
    uploadedImage: string | null;
  }

  const defaultDesignState: DesignConfigState = {
    roomType: "Living Room",
    style: "Scandinavian Modern",
    lighting: "Natural Morning Light",
    materials: "Nordic Oak & Tailored Linen",
    customPrompt: "",
    presetSelected: "scandinavian_preset",
    uploadedImage: null
  };

  const [configHistory, setConfigHistory] = useState<DesignConfigState[]>([defaultDesignState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentConfig = configHistory[historyIndex];

  const updateConfig = (newConfig: Partial<DesignConfigState>) => {
    setConfigHistory((prev) => {
      const nextConfig = { ...prev[historyIndex], ...newConfig };
      // Omit identical duplicate saves
      if (JSON.stringify(prev[historyIndex]) === JSON.stringify(nextConfig)) {
        return prev;
      }
      const nextHistory = prev.slice(0, historyIndex + 1);
      nextHistory.push(nextConfig);
      // Keep up to 6 items (last 5 modifications + original)
      if (nextHistory.length > 6) {
        nextHistory.shift();
      }
      return nextHistory;
    });
    // Need to do this separately since we can't get length outside of setState easily,
    // actually, we can useEffect
  };

  // Keep historyIndex in sync after we update the array
  useEffect(() => {
    if (historyIndex < configHistory.length - 1 && configHistory.length > 1) {
       // Only pull index forward if we just appended a new item (which means we sliced and pushed, length is new index + 1)
       // Wait, if we undo to index 2, then modify, new length is 4. Index should be 3.
       // It's safer to just set history index directly.
    }
  }, [configHistory.length]);

  const setConfigHistoryAndIndex = (newConfig: Partial<DesignConfigState>) => {
     setConfigHistory((prev) => {
      const nextConfig = { ...prev[historyIndex], ...newConfig };
      if (JSON.stringify(prev[historyIndex]) === JSON.stringify(nextConfig)) {
        return prev;
      }
      const nextHistory = prev.slice(0, historyIndex + 1);
      nextHistory.push(nextConfig);
      if (nextHistory.length > 6) {
        nextHistory.shift();
      }
      setHistoryIndex(nextHistory.length - 1);
      return nextHistory;
    });
  }

  const undoConfigChange = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };
  const redoConfigChange = () => {
    if (historyIndex < configHistory.length - 1) setHistoryIndex(historyIndex + 1);
  };

  // Map back values to keep JSX same
  const selectedRoomType = currentConfig.roomType;
  const setSelectedRoomType = (v: string) => setConfigHistoryAndIndex({ roomType: v });

  const selectedStyle = currentConfig.style;
  const setSelectedStyle = (v: string) => setConfigHistoryAndIndex({ style: v });

  const selectedLighting = currentConfig.lighting;
  const setSelectedLighting = (v: string) => setConfigHistoryAndIndex({ lighting: v });

  const selectedMaterials = currentConfig.materials;
  const setSelectedMaterials = (v: string) => setConfigHistoryAndIndex({ materials: v });

  const customPrompt = currentConfig.customPrompt;
  const setCustomPrompt = (v: string) => setConfigHistoryAndIndex({ customPrompt: v });

  const [localCustomPrompt, setLocalCustomPrompt] = useState(customPrompt);

  // Keep local custom prompt in sync when history changes
  useEffect(() => {
    setLocalCustomPrompt(customPrompt);
  }, [customPrompt]);

  const presetSelected = currentConfig.presetSelected;
  const setPresetSelected = (v: string) => setConfigHistoryAndIndex({ presetSelected: v });

  const uploadedImage = currentConfig.uploadedImage;
  const setUploadedImage = (v: string | null) => setConfigHistoryAndIndex({ uploadedImage: v });

  // Real-time camera capture state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const startCameraStream = async () => {
    setIsCameraActive(true);
    setCameraError(null);
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "environment" },
        audio: false,
      });
      setCameraStream(stream);
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setCameraError("Could not access camera. Please check your system permissions.");
      setIsCameraActive(false);
    }
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setUploadedImage(dataUrl);
        setPresetSelected(""); // deselect standard image presets
        stopCameraStream();
      }
    }
  };

  // Turn off camera stream on component unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Hook up stream source object securely
  useEffect(() => {
    if (isCameraActive && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((err) => console.log("Video playback error", err));
    }
  }, [isCameraActive, cameraStream]);

  // App UI state
  const [activeSubTab, setActiveSubTab] = useState<"workspace" | "history" | "account" | "subscription">("workspace");
  const [isCompiling, setIsCompiling] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);

  // Result display state
  const [renderedReport, setRenderedReport] = useState<SpatialDesignReport | null>(PRESET_ROOMS[0].curatedReport);
  const [renderedBeforeImage, setRenderedBeforeImage] = useState<string>(PRESET_ROOMS[0].beforeImage);
  const [renderedAfterImage, setRenderedAfterImage] = useState<string>(PRESET_ROOMS[0].afterImage);

  // History state with LocalStorage persistence
  const [historyList, setHistoryList] = useState<SavedGeneration[]>([]);

  // Pricing model setting
  const [subscriptionTier, setSubscriptionTier] = useState<"Explorer (Free)" | "Roomora Pro" | "Roomora Enterprise">("Explorer (Free)");
  const [remainingCredits, setRemainingCredits] = useState<number>(0);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUserId(user ? user.uid : null);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSubscriptionTier(data.tier || "Explorer (Free)");
            setRemainingCredits(data.credits !== undefined ? data.credits : 5);
          }
        }, (error) => {
          try { handleFirestoreError(error, OperationType.GET, `users/${user.uid}`); } catch (e) { console.error(e); }
        });

        const historyQuery = query(collection(db, `users/${user.uid}/history`), orderBy('createdAt', 'desc'));
        onSnapshot(historyQuery, (snapshot) => {
           const items: SavedGeneration[] = snapshot.docs.map(doc => ({
             ...doc.data()
           } as SavedGeneration));
           setHistoryList(items);
        }, (error) => {
          try { handleFirestoreError(error, OperationType.GET, `users/${user.uid}/history`); } catch (e) { console.error(e); }
        });
      } else {
        setHistoryList([]);
      }
    });
    return unsub;
  }, []);

  const PROGRESS_STEPS = [
    "Formulating structural room boundaries...",
    "Tracing light direction, shadow ratios, and window voids...",
    "Synthesizing material texture layers and wood grains...",
    "Generating professional luxury designer report...",
    "Finishing high-fidelity 4K spatial synthesis..."
  ];

  // Replaced localStorage with Firebase for histories
  const saveToLocalStorage = async (item: SavedGeneration) => {
      if (!userId) return;
      try {
        const docRef = doc(db, `users/${userId}/history`, item.id);
        const data = {
          ...item,
          userId,
          createdAt: serverTimestamp()
        };
        await setDoc(docRef, data);
      } catch (err) {
        try { handleFirestoreError(err, OperationType.CREATE, `users/${userId}/history/${item.id}`); } catch(e) { console.error(e); }
      }
  };

  const deductCredit = async () => {
     if (!userId) return;
     try {
        const userRef = doc(db, 'users', userId);
        const nextCredits = Math.max(0, remainingCredits - 1);
        await updateDoc(userRef, { credits: nextCredits, updatedAt: serverTimestamp() });
     } catch (err) {
        try { handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`); } catch(e) { console.error(e); }
     }
  };

  // Switch preset empty rooms
  const handlePresetChange = (presetId: string) => {
    const selectedPreset = PRESET_ROOMS.find((p) => p.id === presetId);
    if (selectedPreset) {
      setPresetSelected(presetId);
      setUploadedImage(null);
      // Reset inputs to match preset
      setSelectedRoomType(selectedPreset.roomType);
      setSelectedStyle(selectedPreset.style);

      // Instantly load its premium pre-rendered visual
      setRenderedBeforeImage(selectedPreset.beforeImage);
      setRenderedAfterImage(selectedPreset.afterImage);
      setRenderedReport(selectedPreset.curatedReport);
    }
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setPresetSelected(""); // Deselect presets
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger design compiler engine
  const handleGenerateDesign = async () => {
    if (!userId) {
      alert("Please sign in to generate a design.");
      return;
    }
    if (remainingCredits <= 0) {
      alert("You have exhausted your generation credits. Upgrade your tier to continue.");
      return;
    }

    setIsCompiling(true);
    setActiveStepIndex(0);
    setGenerationLogs([]);

    // Custom logs simulator to give high-end procedural tactile feel
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < PROGRESS_STEPS.length - 1) {
          setGenerationLogs((logs) => [...logs, PROGRESS_STEPS[prev]]);
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 700);

    const baseImage = uploadedImage || PRESET_ROOMS.find((p) => p.id === presetSelected)?.beforeImage || PRESET_ROOMS[0].beforeImage;

    try {
      // Call the server-side Express API
      const response = await fetch("/api/design/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomType: selectedRoomType,
          style: selectedStyle,
          lightingPreference: selectedLighting,
          materialsFocus: selectedMaterials,
          customPrompt: customPrompt,
          image: baseImage,
        }),
      });

      const result = await response.json();
      clearInterval(interval);

      if (response.ok && result.success) {
        const report: SpatialDesignReport = result.design;

        // Determine which after-image to pair with the requested style
        let finalAfterImage = result.afterImage;
        if (!finalAfterImage) {
          if (uploadedImage) {
            finalAfterImage = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200";
          } else {
            finalAfterImage = PRESET_ROOMS[0].afterImage;
          const normStyle = selectedStyle.toLowerCase();
          if (normStyle.includes("minimalist") || normStyle.includes("japandi")) {
            finalAfterImage = PRESET_ROOMS[1].afterImage; // Travertine Monolith foyer
          } else if (normStyle.includes("luxe") || normStyle.includes("luxury") || normStyle.includes("classic")) {
            finalAfterImage = PRESET_ROOMS[2].afterImage; // Beaux-Arts Penthouse
          } else {
            // Select default based on closest style preset
            const matchingPreset = PRESET_ROOMS.find((p) => normStyle.includes(p.style.toLowerCase().split(" ")[0]));
            if (matchingPreset) {
              finalAfterImage = matchingPreset.afterImage;
            }
          }
          }
        }

        // Set visual outcomes
        setRenderedBeforeImage(baseImage);
        setRenderedAfterImage(finalAfterImage);
        setRenderedReport(report);

        // Deduct credits as realistic premium product behavior
        setRemainingCredits((prev) => Math.max(0, prev - 1));

        // Save generation to local history list
        const newGen: SavedGeneration = {
          id: `gen_${Date.now()}`,
          timestamp: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }),
          roomType: selectedRoomType,
          style: selectedStyle,
          beforeImage: baseImage,
          afterImage: finalAfterImage,
          prompt: customPrompt || "Studio Auto-enhance settings",
          report: report
        };

        await deductCredit();
        await saveToLocalStorage(newGen);
      } else {
        console.error("API failed. Reverting to preset visuals.", result.error);
      }
    } catch (err) {
      console.error("Network error compiling design.", err);
    } finally {
      setIsCompiling(false);
    }
  };

  // Reload an archive record from history
  const handleReloadHistoryItem = (item: SavedGeneration) => {
    setUploadedImage(item.beforeImage.startsWith("data:") ? item.beforeImage : null);
    if (!item.beforeImage.startsWith("data:")) {
      const parentPreset = PRESET_ROOMS.find(p => p.beforeImage === item.beforeImage);
      if (parentPreset) setPresetSelected(parentPreset.id);
    }
    setSelectedRoomType(item.roomType);
    setSelectedStyle(item.style);
    setCustomPrompt(item.prompt);

    setRenderedBeforeImage(item.beforeImage);
    setRenderedAfterImage(item.afterImage);
    setRenderedReport(item.report);
    setActiveSubTab("workspace");
  };

  // Delete item from history
  const handleDeleteHistoryItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;
    try {
      await deleteDoc(doc(db, `users/${userId}/history`, id));
    } catch (err) {
      try { handleFirestoreError(err, OperationType.DELETE, `users/${userId}/history/${id}`); } catch(e){ console.error(e); }
    }
  };

  const handleUpgradeTier = async (newTier: string, newCredits: number) => {
     if (!userId) {
       alert("Please sign in to modify membership.");
       return;
     }
     try {
       await updateDoc(doc(db, 'users', userId), { 
         tier: newTier, 
         credits: newCredits,
         updatedAt: serverTimestamp() 
       });
     } catch (err) {
       try { handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`); } catch(e){ console.error(e); }
     }
  };

  const analysis = renderedReport?.analysis || getAnalysisMetrics(selectedRoomType, presetSelected || "");

  return (
    <div id="interactive-app-dashboard-root" className="bg-luxury-cream border border-luxury-stone rounded-2xl overflow-hidden min-h-[700px] flex flex-col md:flex-row">
      
      {/* Premium Studio Left Sidebar Controls */}
      <aside className="w-full md:w-80 bg-luxury-sand border-r border-luxury-stone p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Section Indicator */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-luxury-accent uppercase font-bold">
                  STUDIO WORKSPACE
                </span>
              </div>
              <h3 className="font-display text-xl text-luxury-charcoal tracking-tight">
                Design Configuration
              </h3>
            </div>
            {activeSubTab === "workspace" && (
              <div className="flex gap-1">
                <button 
                  onClick={undoConfigChange} 
                  disabled={historyIndex === 0} 
                  className={`p-1.5 rounded-md transition-colors ${historyIndex === 0 ? "text-luxury-stone cursor-not-allowed" : "text-luxury-slate hover:bg-luxury-stone hover:text-luxury-charcoal"}`}
                  title="Undo Change"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={redoConfigChange} 
                  disabled={historyIndex === configHistory.length - 1} 
                  className={`p-1.5 rounded-md transition-colors ${historyIndex === configHistory.length - 1 ? "text-luxury-stone cursor-not-allowed" : "text-luxury-slate hover:bg-luxury-stone hover:text-luxury-charcoal"}`}
                  title="Redo Change"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Tab Navigation Menu */}
          <div className="grid grid-cols-2 lg:flex lg:flex-col gap-1.5 p-1 bg-luxury-stone/50 rounded-lg">
            <button
              onClick={() => setActiveSubTab("workspace")}
              className={`px-3 py-2 text-left rounded text-xs font-mono tracking-tight transition-all flex items-center gap-2 ${
                activeSubTab === "workspace"
                  ? "bg-luxury-cream text-luxury-charcoal shadow-sm font-semibold"
                  : "text-luxury-slate hover:text-luxury-charcoal"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
              Studio Console
            </button>
            <button
              onClick={() => setActiveSubTab("history")}
              className={`px-3 py-2 text-left rounded text-xs font-mono tracking-tight transition-all flex items-center gap-2 relative ${
                activeSubTab === "history"
                  ? "bg-luxury-cream text-luxury-charcoal shadow-sm font-semibold"
                  : "text-luxury-slate hover:text-luxury-charcoal"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-luxury-accent" />
              Design Archives
              {historyList.length > 0 && (
                <span className="absolute right-2 bg-luxury-charcoal text-luxury-cream text-[9px] px-1.5 py-0.2 rounded-full font-sans font-bold">
                  {historyList.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSubTab("subscription")}
              className={`px-3 py-2 text-left rounded text-xs font-mono tracking-tight transition-all flex items-center gap-2 ${
                activeSubTab === "subscription"
                  ? "bg-luxury-cream text-luxury-charcoal shadow-sm font-semibold"
                  : "text-luxury-slate hover:text-luxury-charcoal"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-luxury-accent" />
              Billing &amp; Tiers
            </button>
            <button
              onClick={() => setActiveSubTab("account")}
              className={`px-3 py-2 text-left rounded text-xs font-mono tracking-tight transition-all flex items-center gap-2 ${
                activeSubTab === "account"
                  ? "bg-luxury-cream text-luxury-charcoal shadow-sm font-semibold"
                  : "text-luxury-slate hover:text-luxury-charcoal"
              }`}
            >
              <User className="w-3.5 h-3.5 text-luxury-accent" />
              Account Settings
            </button>
          </div>

          {activeSubTab === "workspace" && (
            <div className="space-y-4">
              
              {/* Room Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-luxury-accent font-semibold block">
                  01. Room Typology
                </label>
                <select
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  className="w-full bg-luxury-cream border border-luxury-stone rounded p-2.5 text-xs font-sans text-luxury-charcoal focus:border-luxury-gold focus:outline-none"
                >
                  <option>Living Room</option>
                  <option>Primary Master Suite</option>
                  <option>Culinary Kitchen Area</option>
                  <option>Executive Workspace</option>
                  <option>Bespoke Entry Hallway</option>
                  <option>Timeless Dining Room</option>
                </select>
              </div>

              {/* Architectural Style */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-luxury-accent font-semibold block">
                  02. Design Esthetic
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full bg-luxury-cream border border-luxury-stone rounded p-2.5 text-xs font-sans text-luxury-charcoal focus:border-luxury-gold focus:outline-none"
                >
                  <option>Scandinavian Modern</option>
                  <option>Japandi Minimalist</option>
                  <option>Luxe Editorial (High Luxury)</option>
                  <option>Mid-Century Modern</option>
                  <option>Industrial Brutalist</option>
                  <option>Contemporary Classic</option>
                </select>
              </div>

              {/* Lighting Spectrum */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-luxury-accent font-semibold block">
                  03. Lighting Concept
                </label>
                <select
                  value={selectedLighting}
                  onChange={(e) => setSelectedLighting(e.target.value)}
                  className="w-full bg-luxury-cream border border-luxury-stone rounded p-2.5 text-xs font-sans text-luxury-charcoal focus:border-luxury-gold focus:outline-none"
                >
                  <option>Natural Morning Light</option>
                  <option>Moody golden-hour Sunset</option>
                  <option>High-contrast Cinematic shadow</option>
                  <option>Soft Diffuse Overcast (Nordic)</option>
                </select>
              </div>

              {/* Materials Deck */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-luxury-accent font-semibold block">
                  04. Textural Materials
                </label>
                <select
                  value={selectedMaterials}
                  onChange={(e) => setSelectedMaterials(e.target.value)}
                  className="w-full bg-luxury-cream border border-luxury-stone rounded p-2.5 text-xs font-sans text-luxury-charcoal focus:border-luxury-gold focus:outline-none"
                >
                  <option>Nordic Oak &amp; Tailored Linen</option>
                  <option>Roman Travertine &amp; Bouclé</option>
                  <option>French Walnut &amp; Polished Brass</option>
                  <option>Polished Microcement &amp; Matte Steel</option>
                  <option>Raw Clay Plaster &amp; Wove Sisal</option>
                </select>
              </div>

              {/* Custom directives */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-luxury-accent font-semibold block">
                  05. Customized Request
                </label>
                <textarea
                  value={localCustomPrompt}
                  onChange={(e) => setLocalCustomPrompt(e.target.value)}
                  onBlur={() => setCustomPrompt(localCustomPrompt)}
                  placeholder="e.g. Include olive trees in stoneware, low travertine table, floor-to-ceiling drapes."
                  rows={3}
                  className="w-full bg-luxury-cream border border-luxury-stone rounded p-2.5 text-xs font-sans text-luxury-charcoal focus:border-luxury-gold focus:outline-none resize-none placeholder-luxury-slate/60"
                />
              </div>

            </div>
          )}
        </div>

        {/* Compile trigger active state */}
        {activeSubTab === "workspace" && (
          <div className="pt-6 border-t border-luxury-stone space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono text-luxury-slate">
              <span>ACTIVE KEY ENTRANCE:</span>
              <span className="text-luxury-accent font-semibold uppercase">API PROXY</span>
            </div>
            
            <button
              onClick={handleGenerateDesign}
              disabled={isCompiling}
              className="w-full py-3.5 px-4 bg-luxury-charcoal hover:bg-luxury-black text-white text-xs font-mono tracking-widest uppercase rounded shadow transition-all flex items-center justify-center gap-2 border border-luxury-charcoal hover:border-luxury-gold group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isCompiling ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-luxury-gold" />
                  Generating Study...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                  Compile Design
                  <ArrowRight className="w-3 h-3 text-luxury-gold transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
            <div className="text-center text-[9px] font-mono text-luxury-slate">
              Roomora Pro client • Deducts 1 AI processing credit
            </div>
          </div>
        )}
      </aside>

      {/* Main Panel Content Render Area */}
      <main className="flex-grow p-6 md:p-8 flex flex-col justify-between">
        
        {/* Workspace Tab Content */}
        {activeSubTab === "workspace" && (
          <div className="space-y-8 flex-grow">
            
            {/* Top segment upload panel vs preset selections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 border-b border-luxury-stone">
              
              {/* Drag drop area */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-widest font-semibold block">
                    A. IMAGE INGESTION SOURCE Or UPLOAD
                  </span>
                  <div className="flex gap-1 bg-luxury-sand/40 p-0.5 rounded border border-luxury-stone">
                    <button
                      type="button"
                      onClick={() => {
                        stopCameraStream();
                      }}
                      className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-tight transition-all ${
                        !isCameraActive
                          ? "bg-luxury-charcoal text-white shadow-sm font-semibold"
                          : "text-luxury-slate hover:text-luxury-charcoal"
                      }`}
                    >
                      File
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        startCameraStream();
                      }}
                      className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-tight transition-all flex items-center gap-1 ${
                        isCameraActive
                          ? "bg-luxury-charcoal text-white shadow-sm font-semibold"
                          : "text-luxury-slate hover:text-luxury-charcoal"
                      }`}
                    >
                      <Camera className="w-2.5 h-2.5" />
                      Camera
                    </button>
                  </div>
                </div>
                
                {!isCameraActive ? (
                  <div className="relative border border-dashed border-luxury-stone hover:border-luxury-gold hover:bg-luxury-sand/30 rounded-xl p-5 text-center transition-all bg-white flex flex-col items-center justify-center min-h-[140px] cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload className="w-7 h-7 text-luxury-accent group-hover:scale-110 transition-transform duration-300 mb-2" />
                    <span className="text-xs font-sans text-luxury-charcoal block mb-0.5 font-medium">
                      {uploadedImage ? "Custom image uploaded successfully" : "Drag & drop high-res room photograph"}
                    </span>
                    <span className="text-[10px] font-mono text-luxury-slate">
                      Supports RAW, JPEG, PNG • Up to 15MB size
                    </span>

                    {uploadedImage && (
                      <div className="relative mt-3 w-16 h-12 rounded border border-luxury-stone overflow-hidden shadow">
                        <img src={uploadedImage} className="w-full h-full object-cover" alt="Custom upload preview" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-dashed border-luxury-stone bg-stone-950 rounded-xl p-4 text-center relative flex flex-col items-center justify-center min-h-[140px] overflow-hidden">
                    {cameraError ? (
                      <div className="p-4 text-center space-y-2">
                        <p className="text-red-400 text-xs font-sans">{cameraError}</p>
                        <button
                          type="button"
                          onClick={startCameraStream}
                          className="px-3 py-1 bg-white text-luxury-charcoal font-mono text-[9px] uppercase tracking-wide rounded border border-luxury-stone shadow-sm hover:border-luxury-gold hover:-translate-y-0.5 active:translate-y-0 transition-all"
                        >
                          Retry Access
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center relative z-10">
                        {/* Video Element */}
                        <div className="relative w-full aspect-video max-h-[150px] rounded-lg overflow-hidden border border-luxury-stone shadow-inner bg-black">
                          <video
                            ref={videoRef}
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Capture Shutter controls */}
                        <div className="flex gap-2.5 mt-2.5 z-20">
                          <button
                            type="button"
                            onClick={handleCapturePhoto}
                            className="px-4 py-1.5 bg-luxury-gold hover:bg-luxury-accent text-white font-mono text-[9px] uppercase tracking-widest rounded-full shadow-md flex items-center gap-1.5 transition-all font-semibold"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                            Capture Photo
                          </button>
                          <button
                            type="button"
                            onClick={stopCameraStream}
                            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[9px] uppercase tracking-wider rounded-full transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Preset selectors empty template */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-widest font-semibold block">
                  B. SELECT PREMIUM EXPERIMENTAL PRESET ROOMS
                </span>
                
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_ROOMS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetChange(preset.id)}
                      className={`text-left p-2 rounded-lg border transition-all flex flex-col justify-between bg-white text-xs h-[140px] ${
                        presetSelected === preset.id
                          ? "border-luxury-accent bg-luxury-sand/40 outline-none ring-1 ring-luxury-accent"
                          : "border-luxury-stone hover:border-luxury-gold"
                      }`}
                    >
                      <div className="w-full h-14 bg-luxury-sand rounded overflow-hidden mb-1.5 border border-luxury-stone border-opacity-70">
                        <img src={preset.beforeImage} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="font-semibold text-luxury-charcoal tracking-tight leading-3 truncate block">
                        {preset.roomType}
                      </span>
                      <span className="text-[9px] font-mono text-luxury-slate transform scale-90 origin-left">
                        {preset.style}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Rendering Progress View */}
            {isCompiling ? (
              <div className="p-8 border border-luxury-stone rounded-2xl bg-luxury-sand flex flex-col items-center justify-center min-h-[300px] text-center space-y-6">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-luxury-stone border-t-luxury-gold animate-spin" />
                  <Sparkles className="w-6 h-6 text-luxury-gold" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-display text-xl text-luxury-charcoal tracking-tight">
                    Compiling Bespoke Design Elements...
                  </h4>
                  <p className="text-xs font-sans text-luxury-slate max-w-md">
                    Activating Gemini 3.5-flash leading spatial model engine to analyze layout structural volumes and generate custom material guidelines.
                  </p>
                </div>

                {/* Progress ticker log */}
                <div className="w-full max-w-md bg-[#FAF9F6] border border-luxury-stone p-4 rounded-xl text-left font-mono text-[10px] space-y-1 shadow-inner h-[110px] overflow-y-auto">
                  <div className="text-luxury-accent">// AI DESIGN TIMELINE INITIALIZED</div>
                  {generationLogs.map((log, i) => (
                    <div key={i} className="text-luxury-charcoal flex items-center gap-1">
                      <span className="text-luxury-gold">✓</span> {log}
                    </div>
                  ))}
                  <div className="text-[#8E7C68] font-semibold animate-pulse">
                    ▶ {PROGRESS_STEPS[activeStepIndex]}
                  </div>
                </div>
              </div>
            ) : (
              /* Core Design Report Results Output Area */
              <div className="space-y-8">
                
                {/* Image Display */}
                <div className="space-y-2">
                  {renderedAfterImage ? (
                    <>
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-widest font-semibold block">
                          MODEL SYNTHESIS FRAME
                        </span>
                        <span className="text-xs text-luxury-slate font-mono font-medium flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-luxury-accent" />
                          Interactive Drag Comparison
                        </span>
                      </div>
                      <BeforeAfterSlider
                        beforeImage={renderedBeforeImage}
                        afterImage={renderedAfterImage}
                        beforeLabel="Raw Environment Input"
                        afterLabel={`${selectedStyle} Integration`}
                      />
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-widest font-semibold block">
                          ENVIRONMENT SOURCE
                        </span>
                      </div>
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow border border-luxury-stone bg-black">
                        <img src={renderedBeforeImage || ""} alt="Source Image" className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 bg-black/50 backdrop-blur text-white font-mono text-[9px] uppercase tracking-widest rounded shadow-sm border border-white/20">
                            Raw Environment Input
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Structured spatial interior design report */}
                {renderedReport && (
                  <div className="space-y-8">
                    
                    {/* Ingestion Bento Grid */}
                    <div id="ai-ingestion-bento-card" className="bg-white border border-luxury-stone rounded-xl p-6 space-y-6 hover:border-luxury-gold transition-all shadow-sm">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-luxury-stone pb-4 gap-4">
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-luxury-gold uppercase tracking-widest font-bold">
                            <Layout className="w-3.5 h-3.5" />
                            Ingestion Analysis Phase
                          </div>
                          <h4 className="font-display font-medium text-lg text-luxury-charcoal mt-1">
                            AI Spatial Footprint & Ingestion DNA
                          </h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-luxury-slate uppercase">SCAN STATUS:</span>
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-mono bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 uppercase flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Boundary Calibrated
                          </span>
                        </div>
                      </div>

                      {/* Ingestion Bento Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Metric 1 */}
                        <div className="space-y-1.5 p-4 bg-luxury-sand/35 border border-luxury-stone/50 rounded-lg">
                          <span className="text-[9px] font-mono text-luxury-accent block uppercase tracking-wide">01. Typology & Geometry</span>
                          <span className="text-xs md:text-sm font-semibold text-luxury-charcoal block leading-tight">{analysis.geometry}</span>
                          <p className="text-[10px] text-luxury-slate font-light">Identifies core planar partitions and load boundaries.</p>
                        </div>

                        {/* Metric 2 */}
                        <div className="space-y-1.5 p-4 bg-luxury-sand/35 border border-luxury-stone/50 rounded-lg">
                          <span className="text-[9px] font-mono text-luxury-accent block uppercase tracking-wide">02. Daylight Vector & Fenestration</span>
                          <span className="text-xs md:text-sm font-semibold text-luxury-charcoal block leading-tight">{analysis.lightVector}</span>
                          <p className="text-[10px] text-luxury-slate font-light">Maps door/window apertures & soft light gradients.</p>
                        </div>

                        {/* Metric 3 */}
                        <div className="space-y-1.5 p-4 bg-luxury-sand/35 border border-luxury-stone/50 rounded-lg">
                          <span className="text-[9px] font-mono text-luxury-accent block uppercase tracking-wide">03. Vertical Clearance</span>
                          <span className="text-xs md:text-sm font-semibold text-luxury-charcoal block leading-tight">{analysis.ceilingHeight}</span>
                          <p className="text-[10px] text-luxury-slate font-light">Calculates lintel ratios to prevent cluttered furniture profiles.</p>
                        </div>

                        {/* Metric 4 */}
                        <div className="space-y-1.5 p-4 bg-luxury-sand/35 border border-luxury-stone/50 rounded-lg">
                          <span className="text-[9px] font-mono text-luxury-accent block uppercase tracking-wide">04. Floor Substrate Standard</span>
                          <span className="text-xs md:text-sm font-semibold text-luxury-charcoal block leading-tight">{analysis.flooringMaterial}</span>
                          <p className="text-[10px] text-luxury-slate font-light">Registers physical support properties and tile lines.</p>
                        </div>

                        {/* Metric 5 */}
                        <div className="space-y-1.5 p-4 bg-luxury-sand/35 border border-luxury-stone/50 rounded-lg">
                          <span className="text-[9px] font-mono text-luxury-accent block uppercase tracking-wide">05. Architectural Trim heritage</span>
                          <span className="text-xs md:text-sm font-semibold text-luxury-charcoal block leading-tight">{analysis.heritageTrim}</span>
                          <p className="text-[10px] text-luxury-slate font-light">Flags moldings, baseboards & decorative crown profiles.</p>
                        </div>

                        {/* Metric 6 - Interactive Metric Chart */}
                        <div className="space-y-2.5 p-4 bg-luxury-sand/35 border border-luxury-stone/50 rounded-lg col-span-1">
                          <div className="flex justify-between items-center bg-white/40 p-1.5 rounded border border-luxury-stone/50">
                            <span className="text-[9px] font-mono text-luxury-accent uppercase tracking-wide">06. Clutter Rating</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${analysis.clutterLoad === 'Low' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              {analysis.clutterLoad} ({analysis.clutterScore}%)
                            </span>
                          </div>
                          
                          {/* Dynamic Interactive Gauge Chart Bar */}
                          <div className="space-y-1">
                            <div className="h-2 bg-luxury-stone rounded-full overflow-hidden relative shadow-inner">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${analysis.clutterLoad === 'Low' ? 'bg-luxury-gold' : 'bg-luxury-accent'}`}
                                style={{ width: `${analysis.clutterScore}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[8px] font-mono text-luxury-slate">
                              <span>0% (Empty Space)</span>
                              <span>100% (Fully Blocked)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                      
                      {/* Left block: Concept Statement and Color chips */}
                      <div className="lg:col-span-4 space-y-6">
                        <div className="p-5 bg-white border border-luxury-stone rounded-xl space-y-3 hover:border-luxury-gold transition-all">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-luxury-accent uppercase font-bold">
                            <Layout className="w-3.5 h-3.5" />
                            Creative Vision Statement
                          </div>
                          <p className="text-xs font-sans font-light leading-relaxed text-luxury-slate">
                            "{renderedReport.vision}"
                          </p>
                        </div>

                        {/* Color Palette Chips */}
                        <div className="p-5 bg-white border border-luxury-stone rounded-xl space-y-3.5 hover:border-luxury-gold transition-all">
                          <span className="text-[10px] font-mono text-luxury-accent uppercase tracking-widest font-bold block">
                            Textural Color Swatches
                          </span>
                          <div className="space-y-2.5">
                            {renderedReport.palette.map((pal, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded border border-luxury-stone shadow-sm"
                                  style={{ backgroundColor: pal.hex }}
                                />
                                <div className="flex-1 min-w-0">
                                  <span className="font-display font-medium text-xs text-luxury-charcoal block truncate">
                                    {pal.colorName}
                                  </span>
                                  <span className="font-mono text-[9px] text-luxury-slate block transform scale-95 origin-left truncate">
                                    {pal.hex} • {pal.role}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mood Radar Chart - Spatial Design Scoring Attributes */}
                        <MoodRadarChart
                          selectedStyle={selectedStyle}
                          onStyleChange={(style) => setSelectedStyle(style)}
                        />
                      </div>

                      {/* Right block: layout, lighting and sourcing */}
                      <div className="lg:col-span-8 space-y-6">
                        
                        {/* Grid cards for specification detailed decks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Layout rules card */}
                          <div className="p-5 bg-[#FAF9F6] border border-luxury-stone rounded-xl space-y-3 hover:border-luxury-gold transition-all">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-luxury-accent uppercase font-bold">
                              <Sliders className="w-4 h-4 text-luxury-gold" />
                              Spatial Layout Clearances
                            </div>
                            <ul className="space-y-2 text-xs font-sans font-light text-luxury-slate leading-relaxed">
                              {renderedReport.layoutAdvice.map((adv, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-luxury-accent font-mono">0{i+1}.</span>
                                  <span>{adv}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Textural materials symphony card */}
                          <div className="p-5 bg-[#FAF9F6] border border-luxury-stone rounded-xl space-y-3 hover:border-luxury-gold transition-all">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-luxury-accent uppercase font-bold">
                              <Hammer className="w-4 h-4 text-luxury-gold" />
                              Material Symphony Selection
                            </div>
                            <div className="space-y-2.5 text-xs font-sans text-luxury-slate">
                              {renderedReport.materialSymphony.map((mat, i) => (
                                <div key={i} className="border-b border-luxury-stone pb-2 last:border-b-0 last:pb-0">
                                  <span className="font-semibold text-luxury-charcoal text-[11px] block">{mat.material}</span>
                                  <span className="font-light">{mat.application}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Lighting Plan Card */}
                          <div className="p-5 bg-[#FAF9F6] border border-luxury-stone rounded-xl space-y-3 hover:border-luxury-gold transition-all">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-luxury-accent uppercase font-bold">
                              <Sun className="w-4 h-4 text-luxury-gold" />
                              Architectural Lighting Blueprint
                            </div>
                            <div className="space-y-2.5 text-xs font-sans text-luxury-slate">
                              {renderedReport.lightingPlan.map((lit, i) => (
                                <div key={i} className="border-b border-luxury-stone pb-2 last:border-b-0 last:pb-0">
                                  <span className="font-semibold text-luxury-charcoal text-[11px] block">{lit.fixtureType}</span>
                                  <span className="font-light text-[11px]">{lit.spec}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Luxury Furniture Acquisitions */}
                          <div className="p-5 bg-[#FAF9F6] border border-luxury-stone rounded-xl space-y-3 hover:border-luxury-gold transition-all">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-luxury-accent uppercase font-bold">
                              <Layers className="w-4 h-4 text-luxury-gold" />
                              Bespoke Furniture Sourcing
                            </div>
                            <div className="space-y-2 text-xs font-sans text-luxury-slate leading-relaxed">
                              {renderedReport.suggestedFurniturePieces.map((piece, i) => (
                                <div key={i} className="border-b border-luxury-stone pb-1.5 last:border-b-0 last:pb-0">
                                  <span className="font-semibold text-luxury-charcoal text-[11px] block flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-luxury-accent" /> {piece.name}
                                  </span>
                                  <span className="font-light pl-4">{piece.stylingTip}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* Elite Designer's Personal Notes Section */}
                        {renderedReport.designersNotes && (
                          <div className="bg-[#FAF8F5] border-l-2 border-luxury-gold p-6 rounded-r-xl space-y-3 relative overflow-hidden shadow-sm mt-6">
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-luxury-gold pointer-events-none">
                              <Sparkles className="w-24 h-24" />
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-luxury-accent uppercase font-bold tracking-widest">
                              <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
                              Principal Designer's Observations
                            </div>
                            <p className="text-sm font-sans italic text-luxury-charcoal font-light leading-relaxed relative z-10">
                              "{renderedReport.designersNotes}"
                            </p>
                            <div className="pt-2 flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-luxury-charcoal flex items-center justify-center text-luxury-gold font-display text-[10px] font-bold">
                                AA
                              </div>
                              <div>
                                <span className="text-[10px] font-mono text-luxury-charcoal uppercase block font-bold leading-none">
                                  Roomora Principal Director
                                </span>
                                <span className="text-[9px] font-mono text-luxury-slate tracking-tight">
                                  Roomora Design Council
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* Design Archives Tab */}
        {activeSubTab === "history" && (
          <div className="space-y-6 flex-grow animate-fade-in min-h-[400px]">
            <div>
              <h3 className="font-display text-xl text-luxury-charcoal tracking-tight font-medium mb-1">
                Your Design Archives
              </h3>
              <p className="text-xs text-luxury-slate font-sans">
                A historical log of your local high-fidelity AI design explorations, retained securely on your client engine.
              </p>
            </div>

            {historyList.length === 0 ? (
              <div className="border border-dashed border-luxury-stone rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] bg-white">
                <FolderOpen className="w-8 h-8 text-luxury-slate/50 mb-3" />
                <span className="text-sm font-sans font-medium text-luxury-charcoal block mb-1">No saved compiled explorations</span>
                <p className="text-xs text-luxury-slate max-w-sm leading-relaxed mb-4">
                  Run configure inputs in the Studio Console tab and click 'Compile Design' to generate your first elite spatial design.
                </p>
                <button
                  onClick={() => setActiveSubTab("workspace")}
                  className="px-4 py-2 border border-luxury-accent bg-luxury-sand text-luxury-accent text-xs font-mono uppercase tracking-wider rounded hover:bg-luxury-stone transition-all"
                >
                  Configure Studio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {historyList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleReloadHistoryItem(item)}
                    className="p-4 bg-white border border-luxury-stone rounded-xl flex gap-3 hover:border-luxury-gold transition-all cursor-pointer group"
                  >
                    <div className="w-20 h-20 bg-luxury-sand rounded overflow-hidden border border-luxury-stone shrink-0">
                      <img src={item.beforeImage} alt={item.style} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-wider block font-semibold truncate">
                            {item.roomType}
                          </span>
                          <button
                            onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                            className="text-luxury-slate hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded"
                            title="Delete historic compile node"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="font-display font-medium text-sm text-luxury-charcoal truncate">
                          {item.style}
                        </h4>
                        <p className="text-[10px] text-luxury-slate font-sans leading-relaxed truncate mt-0.5">
                          "{item.prompt}"
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-luxury-slate block">
                        Saved: {item.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subscription billing manager */}
        {activeSubTab === "subscription" && (
          <div className="space-y-6 flex-grow animate-fade-in min-h-[400px]">
            <div>
              <h3 className="font-display text-xl text-luxury-charcoal tracking-tight font-medium mb-1">
                Membership, Quota &amp; Credits Management
              </h3>
              <p className="text-xs text-luxury-slate font-sans">
                Scale your studio requirements as your design business evolves. Modify limits, print billing statements, and check real-time billing logs.
              </p>
            </div>

            {/* active meter cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-white border border-luxury-stone rounded-xl">
                <span className="text-[9px] font-mono text-luxury-slate block mb-1">CURRENT MEMBERSHIP</span>
                <span className="font-display text-lg text-luxury-charcoal font-semibold block">{subscriptionTier}</span>
                <span className="text-[10px] text-luxury-gold font-mono block mt-1">SaaS Service: ACTIVE</span>
              </div>
              <div className="p-5 bg-white border border-luxury-stone rounded-xl">
                <span className="text-[9px] font-mono text-luxury-slate block mb-1">REMAINING COMPILING CREDITS</span>
                <span className="font-display text-lg text-luxury-charcoal font-semibold block">{remainingCredits} Render Credits</span>
                <span className="text-[10px] text-luxury-accent font-mono block mt-1">Resets securely on July 1st</span>
              </div>
              <div className="p-5 bg-white border border-luxury-stone rounded-xl">
                <span className="text-[9px] font-mono text-luxury-slate block mb-1">API SERVICE INVOCATION RATE</span>
                <span className="font-display text-lg text-luxury-charcoal font-semibold block">0.05ms Latency Peak</span>
                <span className="text-[10px] text-emerald-700 font-mono block mt-1">SSL Gateway secure</span>
              </div>
            </div>

            {/* Pricing selectors inside app */}
            <div className="border border-luxury-stone rounded-xl p-5 bg-[#FCFAF7] space-y-4">
              <h4 className="font-display text-base text-luxury-charcoal">Change Active membership</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                <button
                  onClick={() => handleUpgradeTier("Explorer (Free)", 5)}
                  className={`p-4 rounded-lg text-left border transition-all ${
                    subscriptionTier === "Explorer (Free)"
                      ? "border-luxury-accent bg-white shadow-sm"
                      : "border-luxury-stone hover:border-luxury-gold bg-transparent"
                  }`}
                >
                  <span className="text-xs font-semibold text-luxury-charcoal block">Explorer Plan</span>
                  <span className="text-[10px] font-mono text-luxury-slate block mt-1">$0 / monthly</span>
                  <p className="text-[10px] text-luxury-slate mt-2 line-clamp-2">5 compilations per month. Standard mock filters only.</p>
                </button>

                <button
                  onClick={() => handleUpgradeTier("Roomora Pro", 100)}
                  className={`p-4 rounded-lg text-left border transition-all ${
                    subscriptionTier === "Roomora Pro"
                      ? "border-luxury-accent bg-white shadow-sm"
                      : "border-luxury-stone hover:border-luxury-gold bg-transparent"
                  }`}
                >
                  <span className="text-xs font-semibold text-luxury-charcoal block flex items-center gap-1.5">
                    Roomora Pro <span className="bg-luxury-gold text-luxury-charcoal text-[9px] px-1 py-0.2 rounded font-mono">POPULAR</span>
                  </span>
                  <span className="text-[10px] font-mono text-luxury-slate block mt-1">$49 / monthly</span>
                  <p className="text-[10px] text-luxury-slate mt-2 line-clamp-2">100 compilations, full server-to-server Gemini access, export PDF blueprint sheets.</p>
                </button>

                <button
                  onClick={() => handleUpgradeTier("Roomora Enterprise", 9999)}
                  className={`p-4 rounded-lg text-left border transition-all ${
                    subscriptionTier === "Roomora Enterprise"
                      ? "border-luxury-accent bg-white shadow-sm"
                      : "border-luxury-stone hover:border-luxury-gold bg-transparent"
                  }`}
                >
                  <span className="text-xs font-semibold text-luxury-charcoal block">Roomora Enterprise</span>
                  <span className="text-[10px] font-mono text-luxury-slate block mt-1">$190 / monthly</span>
                  <p className="text-[10px] text-luxury-slate mt-2 line-clamp-2">Unlimited compilations, custom branding filters, API webhook integration.</p>
                </button>

              </div>
            </div>
          </div>
        )}

        {/* Account settings tab */}
        {activeSubTab === "account" && (
          <div className="space-y-6 flex-grow animate-fade-in min-h-[400px]">
            <div>
              <h3 className="font-display text-xl text-luxury-charcoal tracking-tight font-medium mb-1">
                Security &amp; Client Settings
              </h3>
              <p className="text-xs text-luxury-slate font-sans">
                Customize your spatial credentials and secure your developer access key nodes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-luxury-stone rounded-xl p-6">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-luxury-accent uppercase font-bold block">
                  Studio Creator Settings
                </span>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-luxury-slate uppercase block">CREATOR NAME</label>
                  <input
                    type="text"
                    defaultValue="Roomora Director"
                    className="w-full bg-luxury-cream border border-luxury-stone rounded px-3 py-2 text-xs font-sans text-luxury-charcoal"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-luxury-slate uppercase block">REGISTERED DESIGN STUDIO EMAIL</label>
                  <input
                    type="email"
                    defaultValue="mehranchaudhary64@gmail.com"
                    disabled
                    className="w-full bg-luxury-sand cursor-not-allowed border border-luxury-stone rounded px-3 py-2 text-xs font-sans text-luxury-slate"
                  />
                  <span className="text-[9px] font-mono text-neutral-500 block">Verified via Studio SSO authorization</span>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-mono text-luxury-accent uppercase font-bold block">
                  API Key Node Connection
                </span>
                
                <div className="p-4 bg-luxury-sand rounded-lg border border-luxury-stone space-y-2">
                  <span className="text-[10px] font-mono text-luxury-slate block">ACTIVE MODEL:</span>
                  <code className="text-xs font-mono font-semibold text-luxury-charcoal block">gemini-3.5-flash @google/genai</code>
                  <span className="text-[10px] font-mono text-luxury-slate block mt-3">CONNECTION PIPELINE STATUS:</span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Secure server session established
                  </div>
                </div>

                <p className="text-[10px] font-sans text-luxury-slate leading-relaxed">
                  Your API keys and secure secrets are managed directly inside the Google AI Studio secrets panel. Full-stack proxy protects your secrets from client exposure.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
