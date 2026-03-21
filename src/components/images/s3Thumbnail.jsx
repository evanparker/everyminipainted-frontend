import S3Image from "./s3Image";

const S3Thumbnail = ({
  image,
  width,
  height,
  blur = false,
  className = "",
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
      />
    </div>
  );
};

export default S3Thumbnail;
