const SHOPIFY_STOREFRONT_API_VERSION = "2024-01";

function normalizeStoreDomain(value) {
  return String(value || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/g, "");
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const storeDomain = normalizeStoreDomain(
    process.env.SHOPIFY_STORE_URL ||
      process.env.SHOPIFY_STORE_DOMAIN ||
      req.body?.storeDomain,
  );
  const accessToken = String(process.env.SHOPIFY_STOREFRONT_TOKEN || "").trim();

  if (!storeDomain || !accessToken) {
    res.status(500).json({ error: "Shopify proxy is not configured" });
    return;
  }

  const query = req.body?.query;
  const variables = req.body?.variables;

  if (typeof query !== "string" || query.trim() === "") {
    res.status(400).json({ error: "Missing GraphQL query" });
    return;
  }

  const endpoint = `https://${storeDomain}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    const body = await upstream.text();
    const requestId = upstream.headers.get("x-request-id");

    if (requestId) {
      res.setHeader("x-shopify-request-id", requestId);
    }

    res.status(upstream.status).send(body);
  } catch (error) {
    console.error("[api/shopify] Shopify proxy failed:", error);
    res.status(502).json({ error: "Shopify request failed" });
  }
};
