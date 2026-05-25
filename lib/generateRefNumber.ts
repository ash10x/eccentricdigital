const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateRefNumber(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return `ED-${suffix}`;
}
