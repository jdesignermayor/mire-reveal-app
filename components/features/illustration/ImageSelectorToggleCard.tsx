import { Card } from "@/components/ui/card";
import type { ImageDataFormat } from "@/models/illustration.model";
import Image from "next/image";

const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk5uSuBwAA5gCg3ColJwAAAABJRU5ErkJggg==";

export default function ImageSelectorToggleCard({
  details,
  isSelected,
}: {
  details: ImageDataFormat;
  isSelected: boolean;
}) {
  return (
    <Card
      tabIndex={0}
      className={`
      relative cursor-pointer h-20 w-full overflow-hidden hover:opacity-80 hover:ring-3 hover:ring-primary rounded
      ${isSelected ? "ring-2 ring-primary" : ""}
    `}
    >
      {/* IMG IZQUIERDA */}
      <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
        <Image
          alt="3D"
          src={details.images.unprocessed.publicUrl}
          sizes="100vw"
          priority={true}
          blurDataURL={BLUR_DATA_URL}
          placeholder="blur"
          fill={true}
          className="object-cover w-full h-full block!"
        />
      </div>

      {/* IMG DERECHA */}
      <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
        <Image
          alt="AI"
          sizes="100vw"
          placeholder="blur"
          priority={true}
          blurDataURL={BLUR_DATA_URL}
          src={details.images.processed.publicUrl}
          fill={true}
          className="object-cover w-full h-full block!"
        />
      </div>
    </Card>
  );
}
