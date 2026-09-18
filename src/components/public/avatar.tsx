import Image from "next/image";

// Shared avatar for player/coach headshots and club crests. Falls back to
// a plain initials tile when no image has been uploaded yet, so every
// card and profile page looks finished from day one rather than showing
// a broken image or empty gap.
export function Avatar({
  src,
  alt,
  initials,
  size = 48,
  shape = "circle",
  anonymous = false,
}: {
  src: string | null;
  alt: string;
  initials: string;
  size?: number;
  shape?: "circle" | "square";
  // True for a signed-out visitor looking at a real (non-demo) person who
  // hasn't been revealed yet -- shows a generic silhouette instead of the
  // initials fallback, since initials are still a fragment of their name.
  anonymous?: boolean;
}) {
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`shrink-0 border border-slate-200 object-cover ${shapeClass}`}
      />
    );
  }

  if (anonymous) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center border border-slate-200 bg-slate-100 text-slate-400 ${shapeClass}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width={Math.round(size * 0.55)} height={Math.round(size * 0.55)}>
          <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.9 0-9.8 1.6-9.8 5.7v1.9h19.6v-1.9c0-4.1-5.9-5.7-9.8-5.7z" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center border border-slate-200 bg-brand-navy/10 font-semibold text-brand-navy ${shapeClass}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
