/**
 * Vercel Serverless Function — Geo Detection
 * Returns the visitor's country from Vercel's IP geolocation header.
 */
module.exports = (req, res) => {
  const country =
    req.headers["x-vercel-ip-country"] ||
    req.headers["cf-ipcountry"] ||
    "CH";

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  res.status(200).json({ country: String(country).toUpperCase() });
};
