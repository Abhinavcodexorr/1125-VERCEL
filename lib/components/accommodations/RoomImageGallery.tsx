import Image from "next/image";
import Link from "next/link";
import { isRemoteImage, resolveImageAlt } from "@/lib/utils/image";

interface RoomImageGalleryProps {
  image: string;
  galleryImages: string[];
  title: string;
  currencySymbol: string;
  price: number;
  galleryHref?: string;
}

export default function RoomImageGallery({
  image,
  galleryImages,
  title,
  currencySymbol,
  price,
  galleryHref = "/gallery",
}: RoomImageGalleryProps) {
  const thumbnails = galleryImages.slice(1, 4);
  const showGalleryOverlay = galleryImages.length > 4;
  const imageAlt = resolveImageAlt(title, "Accommodation photo");

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden bg-[#f9f8f6]">
        <div className="absolute top-4 left-4 z-10 bg-[#C22D28] text-white px-4 py-2 rounded-xl text-base font-semibold shadow-md">
          {currencySymbol} {price || "650"}
          <span className="text-xs font-jeko-black font-normal opacity-90 ml-0.5">
            /night
          </span>
        </div>
        <div className="relative h-[360px] md:h-[440px]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) calc(100vw - 3rem), 480px"
            className="object-cover"
            priority
            unoptimized={isRemoteImage(image)}
          />
        </div>
      </div>

      {thumbnails.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4 w-full">
          {thumbnails.map((thumbUrl, index) => {
            const isLast = index === thumbnails.length - 1;
            const showOverlay = isLast && showGalleryOverlay;

            const content = (
              <>
                <Image
                  src={thumbUrl}
                  alt={
                    showOverlay
                      ? `${imageAlt} gallery`
                      : `${imageAlt} photo ${index + 2}`
                  }
                  fill
                  sizes="(max-width: 1024px) 30vw, 150px"
                  className="object-cover"
                  unoptimized={isRemoteImage(thumbUrl)}
                />
                {showOverlay && (
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/75 flex items-center justify-center transition-colors duration-200">
                    <span className="text-white text-[11px] tracking-widest uppercase font-medium">
                      Gallery
                    </span>
                  </div>
                )}
              </>
            );

            if (showOverlay) {
              return (
                <Link
                  key={`${index}-${thumbUrl}`}
                  href={galleryHref}
                  className="relative w-full h-[85px] rounded-xl overflow-hidden cursor-pointer group transition block"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={`${index}-${thumbUrl}`}
                className="relative w-full h-[85px] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition"
              >
                {content}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
