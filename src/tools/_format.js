/**
 * Shared MCP response formatting helper.
 * All tool files use this instead of manually constructing MCP responses.
 *
 * Includes automatic payload measurement, truncation at hard ceiling,
 * and context-consumption warnings at configurable thresholds.
 */

// ── Thresholds (bytes of JSON text) ──
const WARN_THRESHOLD  = 50_000;   // 50 KB  → attach _context_warning
const HIGH_THRESHOLD  = 100_000;  // 100 KB → attach _context_alert
const HARD_CEILING    = 200_000;  // 200 KB → truncate + attach _truncated flag

export function jsonResult(obj, isError = false) {
  let text = JSON.stringify(obj, null, 2);
  const bytes = Buffer.byteLength(text, 'utf8');

  // Hard ceiling — truncate and replace payload with a stub
  if (bytes > HARD_CEILING) {
    const truncated = text.slice(0, HARD_CEILING);
    const stub = {
      ...( typeof obj === 'object' && obj !== null ? { success: obj.success } : {} ),
      _truncated: true,
      _original_bytes: bytes,
      _returned_bytes: HARD_CEILING,
      _context_alert: `Response truncated from ${(bytes / 1024).toFixed(1)} KB to ${(HARD_CEILING / 1024).toFixed(1)} KB. Use filters (study_filter, summary, count) to reduce payload.`,
      _partial_data: truncated,
    };
    text = JSON.stringify(stub, null, 2);
    process.stderr.write(`[mcp-guard] TRUNCATED: ${(bytes / 1024).toFixed(1)} KB → ${(HARD_CEILING / 1024).toFixed(1)} KB ceiling\n`);
  }
  // High threshold — alert
  else if (bytes > HIGH_THRESHOLD) {
    if (typeof obj === 'object' && obj !== null) {
      obj._context_alert = `Large response: ${(bytes / 1024).toFixed(1)} KB. Consider using study_filter, summary=true, or smaller count to reduce context consumption.`;
    }
    text = JSON.stringify(obj, null, 2);
    process.stderr.write(`[mcp-guard] ALERT: response is ${(bytes / 1024).toFixed(1)} KB (>${(HIGH_THRESHOLD / 1024).toFixed(0)} KB threshold)\n`);
  }
  // Warn threshold — soft notice
  else if (bytes > WARN_THRESHOLD) {
    if (typeof obj === 'object' && obj !== null) {
      obj._context_warning = `Response is ${(bytes / 1024).toFixed(1)} KB. Approaching heavy consumption territory.`;
    }
    text = JSON.stringify(obj, null, 2);
    process.stderr.write(`[mcp-guard] WARNING: response is ${(bytes / 1024).toFixed(1)} KB (>${(WARN_THRESHOLD / 1024).toFixed(0)} KB threshold)\n`);
  }

  return {
    content: [{ type: 'text', text }],
    ...(isError && { isError: true }),
  };
}
