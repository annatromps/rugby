"use client";

import { PhotoUpload } from "./photo-upload";
import { uploadPlayerPhoto, removePlayerPhoto } from "@/app/actions/photos";

export function PlayerPhotoUpload({ playerId, photoUrl }: { playerId: string; photoUrl: string | null }) {
  return (
    <PhotoUpload
      id={playerId}
      currentUrl={photoUrl}
      label="Photo"
      shape="circle"
      onUpload={uploadPlayerPhoto}
      onRemove={removePlayerPhoto}
    />
  );
}
