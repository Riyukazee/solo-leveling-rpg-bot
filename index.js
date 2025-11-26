require("./src/bot.js");

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("./src/api/middleware/auth");

const api = express();
api.use(cors());
api.use(express.json());

// LOAD ROUTES
const routesPath = path.join(__dirname, "src", "api", "routes");

if (!fs.existsSync(routesPath)) {
  console.error("❌ Le dossier src/api/routes n'existe pas !");
} else {
  console.log("📁 Chargement des routes panel...");

  fs.readdirSync(routesPath).forEach(file => {
    if (file.endsWith(".js")) {
      const route = require(path.join(routesPath, file));
      api.use("/admin", authMiddleware, route);
      console.log("✅ Route chargée :", file);
    }
  });
}

// START API SERVER
api.listen(3001, () => {
  console.log("🌐 API PANEL ONLINE on port 3001");
});
