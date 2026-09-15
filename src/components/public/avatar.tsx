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
}: {
  src: string | null;
  alt: string;
  initials: string;
  size?: number;
  shape?: "circle" | "square";
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
