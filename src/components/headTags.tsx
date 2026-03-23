import { Image } from "../types/image.types";
import getS3Url from "./images/getS3Url";

function HeadTags({
  name,
  description,
  thumbnail,
}: {
  name: string;
  description?: string;
  thumbnail?: Image;
}) {
  let thumbnailImageURL = "";

  if (thumbnail?.type === "s3Image") {
    thumbnailImageURL = getS3Url({
      options: ["width:400", "height:400", "quality:80", "extend:1"].join("/"),
      key: thumbnail.s3Key,
      bucket: thumbnail.s3Bucket,
      extension: "png",
    });
  }

  return (
    <>
      <title>{`EMP - ${name}`}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://linkfork.co/" />
      <meta property="og:title" content={`Every Mini Painted - ${name}`} />
      <meta property="og:image" content={thumbnailImageURL} />
    </>
  );
}

export default HeadTags;
