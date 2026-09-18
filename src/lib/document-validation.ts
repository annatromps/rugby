// Shared validation for player application documents (passport, CV, cover
// letter). Lives outside src/app/actions/documents.ts because that file has
// a "use server" directive, which requires every export to be an async
// Server Action -- a plain sync helper like this one has to live elsewhere.

export type DocumentKind = "passport" | "cv" | "coverLetter";

export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024; // 10MB -- scanned passports and CVs can run larger than a headshot
export const ALLOWED_DOCUMENT_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

export function validateDocument(file: File | null): string | null {
  if (!file || file.size === 0) return "Choose a file to upload.";
  if (!ALLOWED_DOCUMENT_TYPES.has(file.type)) return "Upload a PDF, JPG, PNG, or WEBP file.";
  if (file.size > MAX_DOCUMENT_BYTES) return "Files must be under 10MB.";
  return null;
}
