import crypto from "crypto";

/**
 * Hashes a plaintext password using Node's crypto pbkdf2Sync algorithm.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored salted hash.
 */
export function verifyPassword(password: string, combined: string): boolean {
  try {
    const [salt, hash] = combined.split(":");
    if (!salt || !hash) return false;
    const verifyHash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash));
  } catch (error) {
    return false;
  }
}
