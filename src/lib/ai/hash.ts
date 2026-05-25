/* SHA-256 hex helper. Web Crypto on the server (Node 20+) + browser. */

export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return "sha-unavailable";
  // BufferSource for subtle.digest must reference an ArrayBuffer view.
  const view = new Uint8Array(bytes);
  const buf = await subtle.digest("SHA-256", view);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
