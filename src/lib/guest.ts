/** Reads ?to=Ayesha from the URL and returns a cleaned display name (or null). */
export function getGuestName(): string | null {
  try {
    const raw = new URLSearchParams(window.location.search).get("to");
    if (!raw) return null;
    const clean = raw
      .replace(/[<>]/g, "") // strip angle brackets
      .trim()
      .slice(0, 40);
    if (!clean) return null;
    // Title-case simple names, leave others as typed.
    return clean
      .split(/\s+/)
      .map((w) => (/^[a-z]/.test(w) ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");
  } catch {
    return null;
  }
}
