import Image from "next/image";
import { urlFor } from "@/sanity/client";
import type { GalleryImage } from "@/sanity/queries";

/* Renders a CMS image through next/image with Sanity's CDN doing the
   resizing — device-appropriate sizes, modern formats, lazy by default. */
export default function SanityImage({
  image,
  sizes = "(max-width: 768px) 50vw, 25vw",
  className = "",
  priority = false,
}: {
  image: GalleryImage;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={urlFor(image).width(1600).url()}
      alt={image.alt ?? ""}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
