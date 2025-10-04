"use client";

import { useState } from "react";
import Image from "next/image";

interface SafeImageProps {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
}

export default function SafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = "",
  fallbackSrc = "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized={true}
    />
  );
}
