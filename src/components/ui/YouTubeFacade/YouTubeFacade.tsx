"use client";

import { useState } from "react";
import Image from "next/image";

interface YouTubeFacadeProps {
  /** URL de embed del video (ej. https://www.youtube.com/embed/ID). */
  embedUrl: string;
  /** ID del video, usado para la miniatura. */
  videoId?: string;
  /** Texto accesible / título del video. */
  title?: string;
}

/**
 * Facade de YouTube: muestra una miniatura + botón de play y solo carga el
 * iframe (y todo el player de YouTube, ~640 KiB) al hacer click. Evita el costo
 * de descargar el reproductor completo en la carga inicial de la página.
 */
export function YouTubeFacade({
  embedUrl,
  videoId,
  title = "Video",
}: YouTubeFacadeProps) {
  const [activated, setActivated] = useState(false);

  const baseSrc = embedUrl.replace("youtube.com", "youtube-nocookie.com");

  if (activated) {
    const iframeSrc = `${baseSrc}${baseSrc.includes("?") ? "&" : "?"}autoplay=1`;
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={iframeSrc}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  const thumbnail = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : undefined;

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      className="group absolute inset-0 h-full w-full cursor-pointer"
      aria-label={`Reproducir video: ${title}`}
    >
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 770px"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-gray-300">
          Ver video
        </span>
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/70 transition-transform group-hover:scale-110">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="white"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
