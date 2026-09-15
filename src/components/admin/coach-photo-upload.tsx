"use client";

import { PhotoUpload } from "./photo-upload";
import { uploadCoachPhoto, removeCoachPhoto } from "@/app/actions/photos";

export function CoachPhotoUpload({ coachId, photoUrl }: { coachId: string; photoUrl: string | null }) {
  return (
    <PhotoUpload
      id={coachId}
      currentUrl={photoUrl}
      label="Photo"
      shape="circle"
      onUpload={uploadCoachPhoto}
      onRemove={removeCoachPhoto}
    />
  );
}
