"use client";

import { DocumentUpload } from "./document-upload";
import { uploadPlayerDocument, removePlayerDocument } from "@/app/actions/documents";
import type { DocumentKind } from "@/lib/document-validation";

export function PlayerDocumentUpload({
  playerId,
  passportUrl,
  passportFileName,
  cvUrl,
  cvFileName,
  coverLetterUrl,
  coverLetterFileName,
}: {
  playerId: string;
  passportUrl: string | null;
  passportFileName: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  coverLetterUrl: string | null;
  coverLetterFileName: string | null;
}) {
  const handleUpload = (id: string, kind: string, formData: FormData) =>
    uploadPlayerDocument(id, kind as DocumentKind, formData);
  const handleRemove = (id: string, kind: string) => removePlayerDocument(id, kind as DocumentKind);

  return (
    <div className="space-y-2">
      <DocumentUpload
        id={playerId}
        kind="passport"
        label="Passport / ID"
        currentUrl={passportUrl}
        currentFileName={passportFileName}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
      <DocumentUpload
        id={playerId}
        kind="cv"
        label="CV"
        currentUrl={cvUrl}
        currentFileName={cvFileName}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
      <DocumentUpload
        id={playerId}
        kind="coverLetter"
        label="Cover letter"
        currentUrl={coverLetterUrl}
        currentFileName={coverLetterFileName}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
    </div>
  );
}
