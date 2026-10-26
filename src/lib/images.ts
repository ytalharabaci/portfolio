import fs from "node:fs";
import path from "node:path";

export interface ImageSize {
  width: number;
  height: number;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");
const PUBLIC_ROOT = path.join(process.cwd(), "public");
const cache = new Map<string, ImageSize | null>();

function readHeader(file: string, bytes = 64 * 1024): Buffer | null {
  try {
    const fd = fs.openSync(file, "r");
    try {
      const buffer = Buffer.alloc(bytes);
      const read = fs.readSync(fd, buffer, 0, bytes, 0);
      return buffer.subarray(0, read);
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return null;
  }
}

function parseWebp(b: Buffer): ImageSize | null {
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") return null;
  const chunk = b.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  }
  if (chunk === "VP8 ") {
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const bits = b.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  return null;
}

function parsePng(b: Buffer): ImageSize | null {
  if (b.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function parseGif(b: Buffer): ImageSize | null {
  if (b.toString("ascii", 0, 3) !== "GIF") return null;
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
}

function parseJpeg(b: Buffer): ImageSize | null {
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) return null;
    const marker = b[offset + 1];
    const length = b.readUInt16BE(offset + 2);
    // SOF0..SOF15, excluding DHT (C4), JPG (C8) and DAC (CC)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: b.readUInt16BE(offset + 5), width: b.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}

function readSize(file: string): ImageSize | null {
  const header = readHeader(file);
  if (!header || header.length < 30) return null;
  try {
    return parseWebp(header) ?? parsePng(header) ?? parseGif(header) ?? parseJpeg(header);
  } catch {
    return null;
  }
}

/**
 * Resolves the intrinsic size of an image referenced from markdown.
 * `src` may be relative to the post folder (`content/<bucket>/`) or root-absolute (`/banners/...` in `public/`).
 */
export function getImageSize(src: string, bucket?: string): ImageSize | null {
  if (/^(?:[a-z]+:)?\/\//i.test(src) || src.startsWith("data:")) return null;

  let decoded: string;
  try {
    decoded = decodeURI(src.split(/[?#]/)[0]);
  } catch {
    return null;
  }

  let file: string;
  if (decoded.startsWith("/")) {
    file = path.join(PUBLIC_ROOT, decoded);
  } else if (bucket) {
    file = path.join(CONTENT_ROOT, bucket, decoded);
  } else {
    return null;
  }

  if (!cache.has(file)) {
    cache.set(file, readSize(file));
  }
  return cache.get(file) ?? null;
}
