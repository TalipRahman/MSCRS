/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client helper to prevent crash on startup if key is missing.
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured. Please add it via Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Dynamic Recommendation Engine API
app.post("/api/recommendations", async (req, res) => {
  try {
    const { cityName, state, population, scores, missingIndicators, projects, language = "ms" } = req.body;
    
    if (!cityName) {
      res.status(400).json({ error: "City name is required" });
      return;
    }

    const ratingsStr = Object.entries(scores || {})
      .map(([cat, val]) => `- ${cat}: ${val}%`)
      .join("\n");

    const projectsStr = (projects || [])
      .map((p: any) => `- [${p.status}] ${p.name}: ${p.descriptionMs || p.descriptionEn} (Bajet: RM${(p.budget || 0).toLocaleString()})`)
      .join("\n");

    const missingStr = (missingIndicators || [])
      .map((m: any) => `- [${m.category}] ${m.nameMs} / ${m.nameEn}: ${m.descriptionMs}`)
      .join("\n");

    const promptLanguage = language === "en" ? "English" : "Bahasa Melayu";

    const prompt = `
Anda adalah Perunding Strategik AI rasmi bagi Sistem Pengiktirafan Bandar Pintar Malaysia (MSCRS - Malaysia Smart City Recognition System).
Sila analisis parameter bandar ini dan jana Laporan Cadangan Peningkatan Bandar Pintar (Smart City Elevation Report) mengikut standard PLANMalaysia dan MS ISO 37122.

Maklumat Bandar:
- Nama: ${cityName}
- Negeri: ${state}
- Kepadatan Penduduk: ${population}

Skor Kategori Semasa (Maksimum 100%):
${ratingsStr}

Projek Aktif/Sedia Ada:
${projectsStr || "- Tiada projek berdaftar lagi."}

Indikator Standard Tergantung (Unfulfilled Indicators):
${missingStr || "- Semua indikator asas sedia ada dipenuhi!"}

Sila jana kandungan strategik yang matang, komprehensif dan profesional dalam **${promptLanguage}** yang mengandungi bahagian berikut dengan struktur Markdown yang kemas:

1. **🏙️ Analisis Prestasi Semasa (Performance Evaluation)**:
   - Terangkan kekuatan semasa (kenal pasti kategori yang mempunyai kedudukan paling tinggi).
   - Kenal pasti jurang kelemahan terbesar (terutamanya kategori berkelayakan rendah seperti Mobility atau Environment jika bersesuaian).

2. **🚀 Cadangan Projek Berimpak Tinggi (High-Impact Initiatives)**:
   - Cadangkan 2 senario projek baharu yang khusus dan realistik berasaskan senarai "Indikator Tergantung" bandar ini.
   - Sediakan anggaran belanjawan (Budget MYR) munasabah bagi setiap projek, jangka masa pelaksanaan (timeline), serta agensi peneraju nasional/tempatan (contoh: DBKL, MDEC, PLANMalaysia, Agensi Angkasa Malaysia).

3. **📍 Peta Jalan Tindakan Pengiktirafan (Rating Advancement Roadmap)**:
   - Cadangkan langkah konkrit untuk pihak berkuasa tempatan (PBT) dalam masa 6-12 bulan untuk meningkatkan penarafan ke tahap seterusnya (Gangsa, Perak, Emas, Platinum).

Guna nada rasmi bercirikan dasar awam Malaysia (tegas, bervisi, dan jelas). Elakkan pengulangan kata-kata jargon yang meleret. Tunjukkan kefahaman tinggi terhadap realiti sosioekonomi bandar tersebut.
`;

    // Attempt to invoke Gemini API with safe fallback
    try {
      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      res.json({
        recommendation: response.text || "Tiada output maklum balas dari penjana AI.",
        isMock: false,
      });
    } catch (aiError: any) {
      console.warn("Gemini API call failed, generating professional mock response fallback:", aiError.message);
      
      // Generate highly high-quality fallback based on city parameters in case key is missing
      const fallbackMs = `### 🏙️ Laporan Strategik Kecerdasan Buatan (Fallback Sistem)

*Nota: Kunci API Gemini tidak dikesan atau tiada sambungan. Laporan ini merupakan cadangan standard berasaskan Kerangka Bandar Pintar Malaysia.*

#### 1. Analisis Prestasi Semasa (${cityName})
- **Kekuatan Utama**: Berdasarkan rekod, kategori **${Object.entries(scores || {}).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'Gabenor Pintar'}** menunjukkan prestasi memberangsangkan. Ini melambangkan tadbir urus digital sedia ada yang kukuh untuk dijadikan asas perkembangan sistem.
- **Kelemahan Terendah**: Dimensi **${Object.entries(scores || {}).sort((a: any, b: any) => a[1] - b[1])[0]?.[0] || 'Mobiliti Pintar'}** memerlukan perhatian mendesak berikutan terdapat beberapa indikator standard MS ISO 37122 sedia ada yang belum dipenuhi secara optimum.

#### 2. Cadangan Projek Berimpak Tinggi (Fokus PBT)
- **Cadangan 1: Rangkaian Sensor Bersepadu & Amaran Awal Risiko**
  - **Fokus**: Menangani pengurusan bencana bandar secara proaktif berikutan cabaran perubahan iklim tempatan.
  - **Anggaran Kos**: RM 4.5 Juta | **Timeline**: 9 Bulan
  - **Agensi Peneraju**: PLANMalaysia, NADMA & Jabatan Pengairan dan Saliran (JPS).
- **Cadangan 2: Rangkaian Letak Kereta Pintar Berasaskan Aplikasi Komuniti**
  - **Fokus**: Implementasi penderia lot letak kereta di kawasan perniagaan padat bagi meminimumkan pelepasan karbon mikro.
  - **Anggaran Kos**: RM 2.8 Juta | **Timeline**: 6 Bulan
  - **Agensi Peneraju**: Majlis Bandaraya tempatan bersama MDEC.

#### 3. Peta Jalan Peningkatan Penarafan
1. Mengintegrasikan semua pengurusan perkhidmatan kaunter ke portal sehenti digital (single sign-on).
2. Memperkukuh rangkaian data terbuka (Open Data Portal) dengan kemas kini berkala setiap suku tahunan bagi menggalakkan inovasi pihak ketiga.
3. Melaksanakan projek rintis mikromobiliti berteduh di laluan perniagaan utama.
`;

      const fallbackEn = `### 🏙️ Strategic AI Recommendation Report (Fallback Advisory)

*Note: The Gemini API key is either missing or unconfigured. This advisory is compiled using standard pre-calculated recommendations under the MS ISO 37122 Smart City standards.*

#### 1. Performance Evaluation (${cityName})
- **Major Strengths**: The category **${Object.entries(scores || {}).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'Smart Governance'}** has shown high digital viability, laying down the groundwork for cross-departmental integration.
- **Critical Gaps**: Your lowest scoring area, **${Object.entries(scores || {}).sort((a: any, b: any) => a[1] - b[1])[0]?.[0] || 'Smart Mobility'}**, requires urgent intervention by introducing direct, citizen-facing smart micro-infrastructure.

#### 2. High-Impact Initiatives
- **Initiative 1: AI-Powered Municipal Operations Command Hub**
  - **Focus**: Unifying CCTV streams and disaster warning points into an operational visual screen.
  - **Est Budget**: MYR 6.5M | **Timeline**: 12 Months
  - **Lead Agencies**:PLANMalaysia, MDEC, and Local State Agencies.
- **Initiative 2: Hyperlocal Public Eco-Transit Loops**
  - **Focus**: Launching low-cost autonomous community shuttles linked to real-time bus arrival applications.
  - **Est Budget**: MYR 12M | **Timeline**: 18 Months
  - **Lead Agencies**: Ministry of Transport & Local Municipal Infrastructure teams.

#### 3. Rating Advancement Roadmap
1. Digitize remaining manual licensing documents to clear the Smart Governance bottleneck.
2. Form partnerships with private telecommunication players for widespread public Wi-Fi access.
3. Establish dedicated incubation setups inside high school clusters to support Smart People criteria.
`;

      res.json({
        recommendation: language === "en" ? fallbackEn : fallbackMs,
        isMock: true,
        message: "Menggunakan pelan tindakan asas alternatif akibat ketiadaan kunci API."
      });
    }
  } catch (err: any) {
    console.error("Critical server error in recommendations controller:", err);
    res.status(500).json({ error: "Sila cuba lagi. Ralat pelayan: " + err.message });
  }
});

// Configure Vite integration for dev and production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
});
