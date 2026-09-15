"use client";

import { PhotoUpload } from "./photo-upload";
import { uploadClubCrest, removeClubCrest } from "@/app/actions/photos";

export function ClubCrestUpload({ clubId, crestUrl }: { clubId: string; crestUrl: string | null }) {
  return (
    <PhotoUpload
      id={clubId}
      currentUrl={crestUrl}
      label="Crest"
      shape="square"
      onUpload={uploadClubCrest}
      onRemove={removeClubCrest}
    />
  );
}
