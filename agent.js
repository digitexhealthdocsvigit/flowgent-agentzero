import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Use Railway’s assigned PORT or default to 3000
const PORT = process.env.PORT || 3000;

// Your n8n webhook URL from environment variables
const WEBHOOK_URL = process.env.N8N_WEBHOOK;

// ✅ Root route — to confirm the app is running
app.get("/", (req, res) => {
  res.send("✅ Flowgent AgentZero Cloud is running!");
});

// ✅ Main POST route for processing
app.post("/run", async (req, res) => {
  try {
    // Forward the request body to your n8n webhook
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
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Flowgent AgentZero Cloud running on port ${PORT}`);
});
