import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy init of Gemini Client
let googleGenAI: any = null;
function getGeminiClient() {
  if (!googleGenAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey !== "") {
      try {
        googleGenAI = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
        console.log("Successfully initialized Gemini API Client.");
      } catch (error) {
        console.error("Error creating GoogleGenAI Client:", error);
      }
    }
  }
  return googleGenAI;
}

// Fallback high-fidelity presets when Gemini is unconfigured or fails
const FALLBACK_DESIGNS: Record<string, any> = {
  scandinavian: {
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
  },
  minimalist: {
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
  },
  japandi: {
    vision: "A harmonized marriage of wabi-sabi simplicity and warm Scandinavian functionality, honoring raw, aged materials and exquisite timber joinery.",
    palette: [
      { colorName: "Earthen Clay", hex: "#EBE3D5", role: "Primary textured walls, lime-wash or clay plaster (60%)" },
      { colorName: "Charred Shou Sugi Ban Wood", hex: "#232324", role: "Millwork trim, custom sliding shoji screens, accent frames (20%)" },
      { colorName: "Warm Natural Rye Oak", hex: "#CEBFA8", role: "Built-in low platform joinery, dining table, and shelving (15%)" },
      { colorName: "Moss Sage Linen", hex: "#7E857C", role: "Subtle textile cushions, custom glazed tea-dishes (5%)" }
    ],
    layoutAdvice: [
      "Center furniture design near the tatami baseline; utilize extremely low floor cushion modules and platform tables.",
      "Use timber louvers/shoji panels to create permeable room partitions instead of solid drywall partitions.",
      "Form an asymmetric balance; keep visual layout slightly offset, reflecting organic natural patterns."
    ],
    materialSymphony: [
      { material: "Shou Sugi Ban Timber", application: "Decorative vertical wall paneling and focal storage cabinet fronts" },
      { material: "Washi Rice Paper", application: "Artisanal sliding partitions and translucent pendant light fixtures" },
      { material: "Matte-glazed River Clay Stoneware", application: "Integrated basin sinks, raw pottery decor, and textured wall accents" }
    ],
    lightingPlan: [
      { fixtureType: "Artisanal Washi Paper Lantern Globe", spec: "Warm textured amber glow (2200K) hanging low over low seating platforms" },
      { fixtureType: "Floor-level Uplight Spot", spec: "Casts delicate silhouettes of a dwarf maple branch across clay walls" }
    ],
    suggestedFurniturePieces: [
      { name: "Low-platform Solid Oak Bed/Sofa", stylingTip: "Opt for a linen base mattress with raw selvedge edges for organic texture." },
      { name: "Bentwood Shoji Armchair", stylingTip: "Pair with an organic wool or cotton rug in an unstructured, raw pebble shape." },
      { name: "Asymmetric Shou Sugi Ban Board", stylingTip: "Style with a single ceramic sake carafe or antique brass incense vessel." }
    ],
    designersNotes: "The low-profile tatami couch grounds the room beautifully, allowing the textured Earthen clay plaster to reflect soft shadows. The burnt Shou Sugi Ban accents are introduced as high-contrast anchors to balance the light traveling through the translucent washi paper globe."
  },
  luxury: {
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
};

// Design consultation API route using server-side Gemini 3.5-flash with multimodal vision
app.post("/api/design/consult", async (req, res) => {
  const { roomType, style, lightingPreference, materialsFocus, customPrompt, image } = req.body;

  if (!roomType || !style) {
    return res.status(400).json({ error: "Missing required fields: roomType and style." });
  }

  const normalizedStyle = style.toLowerCase();
  const selectKey = Object.keys(FALLBACK_DESIGNS).find(k => normalizedStyle.includes(k)) || "scandinavian";
  const fallbackData = FALLBACK_DESIGNS[selectKey] || FALLBACK_DESIGNS.scandinavian;

  // Resolve image base64 if available (either uploaded local base64 or remote URL)
  let imageBase64: string | null = null;
  let imageMimeType = "image/jpeg";

  if (image) {
    if (image.startsWith("http://") || image.startsWith("https://")) {
      try {
        console.log(`[Server] Fetching remote preset image from URL: ${image}`);
        const imgResponse = await fetch(image);
        if (imgResponse.ok) {
          const arrayBuffer = await imgResponse.arrayBuffer();
          imageBase64 = Buffer.from(arrayBuffer).toString("base64");
          const contentType = imgResponse.headers.get("content-type");
          if (contentType) imageMimeType = contentType;
        }
      } catch (err) {
        console.error("Failed to fetch remote preset image on server:", err);
      }
    } else if (image.startsWith("data:")) {
      try {
        imageMimeType = image.split(";")[0]?.split(":")[1] || "image/jpeg";
        imageBase64 = image.replace(/^data:image\/\w+;base64,/, "");
        console.log("[Server] Successfully parsed uploaded room file base64.");
      } catch (err) {
        console.error("Failed to parse uploaded room file base64:", err);
      }
    }
  }

  const ai = getGeminiClient();

  if (!ai) {
    console.log("No Gemini API client initialized. Returning premium template mock responses.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return res.json({
      success: true,
      source: "premium_preset",
      design: {
        ...fallbackData,
        vision: `[Simulated Concept] A bespoke ${style} tailored for this elegant ${roomType}. ${fallbackData.vision}`,
        analysis: {
          geometry: "Symmetric Architectural Envelope observed from preset contours",
          lightVector: `Diffuse vertical light oriented for ${lightingPreference || "Morning"}`,
          ceilingHeight: "10.4 ft Headroom Clearance",
          flooringMaterial: "Raw plasterboard aggregate base substrate",
          heritageTrim: "Contemporary thin shadowline profile lines",
          clutterLoad: "Low",
          clutterScore: 22
        }
      }
    });
  }

  // Define structured JSON Schema for Gemini design output
  const designSchema = {
    type: Type.OBJECT,
    properties: {
      vision: {
        type: Type.STRING,
        description: "A premium 2-sentence architectural and interior design vision statement for the suite."
      },
      palette: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            colorName: { type: Type.STRING, description: "Name of the paint tone or natural material, e.g., Pale Alabaster, Patinated Bronze" },
            hex: { type: Type.STRING, description: "HEX color code, e.g., #FAF6F0" },
            role: { type: Type.STRING, description: "Spatial distribution strategy, e.g., Primary Ground Walls (60%), Accent Metals (5%)" }
          },
          required: ["colorName", "hex", "role"]
        },
        description: "A tailored high-end 3 to 4 color interior palette."
      },
      layoutAdvice: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 highly custom layout, spacing, scale and arrangement rules specifically for the room type."
      },
      materialSymphony: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            material: { type: Type.STRING, description: "Upscale material descriptor, e.g., Ribbed Travertine, Fluted Ash Wood, Brushed Bronze" },
            application: { type: Type.STRING, description: "Where and how to apply this material, e.g., monolithic hearth mantel, custom floor trim, dining console" }
          },
          required: ["material", "application"]
        },
        description: "3 premium organic material combinations."
      },
      lightingPlan: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            fixtureType: { type: Type.STRING, description: "High-end design catalog equivalent, e.g., Minimal Plaster Cove LED, Cast-Glass Wall Sconce" },
            spec: { type: Type.STRING, description: "Warmth temperature, glow distribution, and physical location specifications." }
          },
          required: ["fixtureType", "spec"]
        },
        description: "2 custom lighting fixtures and distribution plans to build correct ambiance."
      },
      suggestedFurniturePieces: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the high-design furniture piece, e.g., Low-slung bouclé lounge sofa" },
            stylingTip: { type: Type.STRING, description: "Creative director coordinate tip to dress or style this specific furniture piece." }
          },
          required: ["name", "stylingTip"]
        },
        description: "3 signature luxury furniture selections."
      },
      designersNotes: {
        type: Type.STRING,
        description: "Bespoke handcrafted narrative of Designer's Notes containing personalized explanations of choices. Sound artistic, warm, authoritative, and elite."
      },
      analysis: {
        type: Type.OBJECT,
        properties: {
          geometry: { type: Type.STRING, description: "Detailed room shape, alignment and planar layout detected from the image, e.g. Symmetric Rectangular Lounge with dual-aperture partitions" },
          lightVector: { type: Type.STRING, description: "Calculated daylight direction and aperture illumination observed in the image, e.g. West-facing lateral shafts displaying dramatic morning sunsets" },
          ceilingHeight: { type: Type.STRING, description: "Estimated physical vertical clearance of the space in the image, e.g. 10.8 ft Loft-level Clearance" },
          flooringMaterial: { type: Type.STRING, description: "Identified flooring material or base substrate in the image, e.g. Raw concrete aggregate ready for floating hardwood plates" },
          heritageTrim: { type: Type.STRING, description: "Observed baseboard, crown molding, or decorative wood trims in the image, e.g. Distressed wooden lintels" },
          clutterLoad: { type: Type.STRING, description: "Estimated clutter load density from image: Low, Moderate, High" },
          clutterScore: { type: Type.INTEGER, description: "Estimated spatial clutter percentage (0-100)" }
        },
        required: ["geometry", "lightVector", "ceilingHeight", "flooringMaterial", "heritageTrim", "clutterLoad", "clutterScore"],
        description: "Actual visual metrics evaluated directly from the room's source image."
      }
    },
    required: ["vision", "palette", "layoutAdvice", "materialSymphony", "lightingPlan", "suggestedFurniturePieces", "designersNotes", "analysis"]
  };

  const promptMessage = `
    You are an avant-garde principal architectural spatial designer and creative director with 15+ years of experience designing premium, high-end, human-centered luxury residences.
    
    Synthesize a completely custom, bespoke, pixel-perfect interior design blueprint and analyze the client's room.
    ${imageBase64 ? "An image of the current empty or raw room is attached. Perform an exceptionally precise visual analysis of this actual space to fill in the 'analysis' fields." : "Analyze the characteristics of the requested space."}
    
    Client Configuration:
    Spatial Type: ${roomType}
    Desired Architectural Style: ${style}
    Lighting Atmosphere: ${lightingPreference || "Atmospheric warm white"}
    Primary Material/Textural focus: ${materialsFocus || "Natural timber and premium matte stone"}
    Bespoke Client Directives: ${customPrompt || "N/A"}

    Your design output MUST be incredibly sophisticated, relying on luxury minimalist spatial guidelines. Focus on absolute human ergonomics, negative space, lighting orientation, and natural texturing.
    Write using the vocabulary of architectural legends (like Pierre Yovanovitch, Vincent Van Duysen, Axel Vervoordt, and Kelly Wearstler). Avoid promotional marketing fluff, avoid overly generic recommendations, and instead deliver a distinct, professional bespoke design study report.
  `;

  const contentsParts: any[] = [];
  if (imageBase64) {
    contentsParts.push({
      inlineData: {
        mimeType: imageMimeType,
        data: imageBase64,
      }
    });
  }
  contentsParts.push({ text: promptMessage });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: contentsParts },
      config: {
        systemInstruction: "You are an elite, highly professional lead spatial architect and bespoke interior designer. You output high-end spatial design systems and color/material/furniture curated guides in structured formats.",
        temperature: 0.25,
        responseMimeType: "application/json",
        responseSchema: designSchema
      }
    });

    const parsedResponse = JSON.parse(response.text.trim());

    // REDESIGN IMAGE GENERATION SECTION:
    // Generate a beautiful redesigned afterImage using gemini-2.5-flash-image based on the uploaded empty room!
    let finalAfterImage: string | null = null;

    if (imageBase64) {
      try {
        console.log("[Server Image Engine] Initiating custom redesign generation with gemini-2.5-flash-image...");
        const imagePart = {
          inlineData: {
            mimeType: imageMimeType,
            data: imageBase64,
          },
        };

        const textPart = {
          text: `A fully redesigned, ultra-realistic photo of the exact room in this image transformed into a gorgeous, highly polished ${style} masterwork. Preserve the original walls, window frames, doors, and basic structural outlines, but fully re-furnish and style it with clean modern ${style} elements, low-profile boutique furniture (like ${parsedResponse.suggestedFurniturePieces?.[0]?.name || "a modern sofa"}), natural luxury flooring, warm ${lightingPreference || "ambient light"}, and organic ${materialsFocus} textures. Breathtaking Architectural Digest style output.`
        };

        const imageRes = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: {
            parts: [imagePart, textPart]
          }
        });

        if (imageRes && imageRes.candidates?.[0]?.content?.parts) {
          for (const p of imageRes.candidates[0].content.parts) {
            if (p.inlineData?.data) {
              finalAfterImage = `data:image/png;base64,${p.inlineData.data}`;
              console.log("[Server Image Engine] Successfully generated base64 redesigned interior image.");
              break;
            }
          }
        }
      } catch (imageErr) {
        console.warn("[Server Image Engine] Image generation failed or timed out. Graceful preset fallback will handle this.", imageErr);
      }
    }

    return res.json({
      success: true,
      source: "gemini_api_direct",
      design: parsedResponse,
      afterImage: finalAfterImage
    });
  } catch (err: any) {
    console.error("Gemini Generation failed:", err);
    return res.status(500).json({
      error: "Bespoke compilation failed. Returning local luxury preset coordinates.",
      fallback: true,
      design: fallbackData
    });
  }
});

// Serve health status
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Main Server Setup
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Server middleware connection
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware mounted.");
  } else {
    // Live Production Static Serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from folder:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bespoke luxury app running smoothly on http://localhost:${PORT}`);
  });
}

initializeServer().catch(err => {
  console.error("Failed to initialize architectural server:", err);
});
