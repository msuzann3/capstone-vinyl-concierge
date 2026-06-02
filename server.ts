import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { buildRecommendations } from "./src/recommender";

const app = express();
app.use(express.json());

const PORT = 3000;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", recommendationEngine: "local-codex-catalog" });
});

app.post("/api/recommendations", (req, res) => {
  res.json(buildRecommendations(req.body));
});

async function startServer() {
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
    console.log(`The Vinyl Concierge server running on http://localhost:${PORT}`);
  });
}

startServer();
