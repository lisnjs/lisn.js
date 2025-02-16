"use client";
import { useState, ComponentProps } from "react";
import NextImage from "next/image";

export const Image = ({
  width,
  height,
  ...rest
}: ComponentProps<typeof NextImage>) => {
  const [imageSize, setImageSize] = useState({
    width: width ?? 0,
    height: height ?? 0,
  });

  return (
    <NextImage
      width={imageSize.width}
      height={imageSize.height}
      {...rest}
      onLoad={(e) => {
        if (!width || !height) {
          const img = e.target;
          if (img instanceof HTMLImageElement) {
            setImageSize({
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          }
        }
      }}
    />
  );
};

export default Image;
