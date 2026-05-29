const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomSuffix(len: number) {
  return Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
}

export function generateMaintenanceRef(existingRef?: string): string {
  const suffix = randomSuffix(8);
  return existingRef ? `${existingRef}-${suffix}` : `MNT-${suffix}`;
}

export function isMaintenanceRef(ref: string): boolean {
  return /^MNT-[A-Z0-9]{8}$/.test(ref) || /^ED-[A-Z0-9]{6}-[A-Z0-9]{8}$/.test(ref);
}

export function isBookingRef(ref: string): boolean {
  return /^ED-[A-Z0-9]{6}$/.test(ref);
}
