'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Json } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'
import { ILLUSTRATION_STATUS, ImageDataFormat } from '@/models/illustration.model'
import { useIllustration } from '@/mutations/illustration.mutation'
import { AlertCircleIcon, CheckIcon, RefreshCcwIcon } from 'lucide-react'
import Image from 'next/image'

const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk5uSuBwAA5gCg3ColJwAAAABJRU5ErkJggg==";

const MasonryCard = ({
  data,
  onRetry,
  onClick,
}: {
  data: ImageDataFormat;
  onRetry: (image: ImageDataFormat) => void;
  onClick: () => void;
}) => {
  // const [heightClass, setHeightClass] = useState("h-80");

  // useEffect(() => {
  //   const random =
  //     verticalHeights[Math.floor(Math.random() * verticalHeights.length)];
  //   setHeightClass(random);
  // }, []);

  return (
    <Card
      className="break-inside-avoid mb-4 cursor-pointer border-none shadow-none p-0 hover:opacity-80"
      onClick={data.isFinished ? onClick : undefined}
    >
      {/* Usamos la clase calculada en el estado */}
      <div
        className={`relative group w-full overflow-hidden rounded-lg transition-all duration-500 ${data.isFinished && " ring-offset-2 ring-offset-background ring-3 ring-primary cursor-pointer hover:opacity-40"} ${data.isFailed && " ring-offset-3 ring-offset-background ring-2 ring-red-500 "}`}
      >
        {data.isFinished && !data.isPending && !data.isFailed ? (
          <p className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-lg rounded z-10 flex items-center gap-2">
            <CheckIcon className="size-4" /> Generado, Click para ver
          </p>
        ) : data.isFailed ? (
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-2">
            <p className=" top-2 left-2 bg-black/50 text-white px-2 py-1 text-lg rounded z-10 flex items-center gap-2">
              <AlertCircleIcon className="size-4" />
              Error al generar la imagen
            </p>
            <Button
              variant="outline"
              className="cursor-pointer z-10"
              onClick={() => onRetry(data)}
            >
              <RefreshCcwIcon className="size-4" /> Reintentar
            </Button>
          </div>
        ) : (
          <div>
            <p className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-lg rounded z-10">
              {data.isPending ? "Procesando..." : "Generando..."}
            </p>
          </div>
        )}

        <Image
          className={cn(
            "w-full h-full object-cover",
            data.isPending || data.isFailed
              ? "opacity-50 blur-lg"
              : "opacity-100 blur-0",
          )}
          priority={true}
          fetchPriority="high"
          loading="eager"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          src={data.images.unprocessed.publicUrl}
          alt={data.id}
          width={600}
          height={800}
        />
      </div>
    </Card>
  );
};


export default function RevealIllustrationPanel({
  illustrationId,
}: {
  illustrationId?: number
}) {
  if (!illustrationId) return null;


  const { data } = useIllustration(illustrationId)

  const updatedStatus = data?.process_status
  const images = data?.images as Array<Json> || []

  return (
    <div>
      <h1>RevealIllustrationPanel</h1>

      <div className="max-w-5xl">
        <p>state: {updatedStatus}</p>
        {/* {JSON.stringify(data)} */}

        {(updatedStatus === ILLUSTRATION_STATUS.PROCESSING ||
          updatedStatus === ILLUSTRATION_STATUS.PENDING) && (
            <p className="inline-flex text-lg items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ Revealing images, please wait a moment...</span>
            </p>
          )}
        {images?.length > 0 && (
          <div className="h-[85dvh] overflow-y-auto p-8">
            <div className="columns-1 gap-6">
              {images.length > 0 &&
                images.map((data: Json, idx) => (
                  <MasonryCard key={idx} data={data as unknown as ImageDataFormat} onRetry={() => {}} onClick={() => {}}   />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}