// ==========================
// Flowgent AgentZero Cloud
// Production Server
// ==========================

import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ==========================
// Environment Configuration
// ==========================
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.N8N_WEBHOOK;
const API_KEY = process.env.AGENTZERO_API_KEY || "default-key"; // Optional: set in Railway Variables

// ==========================
// Root Route
// ==========================
app.get("/", (req, res) => {
  res.send("✅ Flowgent AgentZero Cloud is running!");
});

// ==========================
// Health Check Route
// ==========================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Flowgent AgentZero Cloud",
    uptime: `${Math.round(process.uptime())} seconds`,
    timestamp: new Date().toISOString(),
  });
});

// ==========================
// Main /run Endpoint
// ==========================
app.post("/run", async (req, res) => {
  try {
    // 🔐 API Key Check
    const clientKey = req.headers["x-api-key"];
    if (!clientKey || clientKey !== API_KEY) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - missing or invalid API key",
      });
    }

    // 🔄 Validate Environment Setup
    if (!WEBHOOK_URL) {
      return res.status(500).json({
        success: false,
        error: "N8N_WEBHOOK is not configured in environment variables",
      });
    }

    // 🚀 Forward Payload to n8n Workflow
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    res.json({
      success: true,
      n8nResponse: data,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ==========================
// Start Server
// ==========================
app.listen(PORT, () => {
  console.log(`✅ Flowgent AgentZero Cloud running on port ${PORT}`);
});
