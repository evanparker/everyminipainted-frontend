import { ImageS3 } from "../../types/image.types";
import S3Image from "./s3Image";

const S3Thumbnail = ({
  image,
  width,
  height,
  blur = false,
  className = "",
  onLoad,
}: {
  image: ImageS3;
  width?: number;
  height?: number;
  blur?: boolean;
  className?: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}) => {
  className += " absolute top-0";
  return (
    <div className="relative h-0 pt-[100%]">
      <S3Image
        image={image}
        width={width}
        height={height}
        blur={blur}
        className={className}
        onLoad={onLoad}
      />
    </div>
  );
};

export default S3Thumbnail;
