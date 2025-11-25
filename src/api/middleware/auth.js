module.exports = function authMiddleware(req, res, next) {
  const secret = process.env.PANEL_SECRET;

  if (!secret) {
    console.error("❌ PANEL_SECRET manquant dans .env");
    return res.status(500).json({ error: "Server misconfigured (missing secret)" });
  }

  if (req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};

