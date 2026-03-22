import { Image } from "../../types/image.types";
import getS3Url from "./getS3Url";

const S3Image = ({
  image,
  width,
  height,
  blur,
  className = "",
  onLoad,
}: {
  image: Image;
  width?: number;
  height?: number;
  blur?: boolean;
  className?: string;
  onLoad?: () => void;
}) => {
  const options = ["quality:80", "extend:1"];

  if (width !== undefined) {
    options.push(`width:${width}`);
  }
  if (height !== undefined) {
    options.push(`height:${height}`);
  }
  if (blur) {
    className += " blur-sm";
  }

  const url = getS3Url({
    options: options.join("/"),
    key: image.s3Key,
    bucket: image.s3Bucket,
    extension: "png",
  });

  return (
    <img
      className={className}
      src={url}
      alt={image.altText || ""}
      onLoad={onLoad}
    />
  );
};

export default S3Image;
