/**
 * Loon HTTP Response Rewrite
 * Sets every isUsageExceeded to false and every usagePercentage to 0.
 */

const originalBody = $response.body;

try {
  const data = JSON.parse(originalBody);

  function rewriteUsage(value) {
    if (Array.isArray(value)) {
      value.forEach(rewriteUsage);
      return;
    }

    if (!value || typeof value !== "object") return;

    for (const key of Object.keys(value)) {
      if (key === "isUsageExceeded") {
        value[key] = false;
      } else if (key === "usagePercentage") {
        value[key] = 0;
      } else {
        rewriteUsage(value[key]);
      }
    }
  }

  rewriteUsage(data);
  $done({ body: JSON.stringify(data) });
} catch (error) {
  console.log(`[Usage Reset] JSON parse failed: ${error}`);
  $done({ body: originalBody });
}
