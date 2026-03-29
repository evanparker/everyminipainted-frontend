export type Image = {
  _id: string;
  type: string;
  caption?: string;
  altText?: string;
  createdAt?: Date;
}

export interface ImageS3 extends Image {
  s3Bucket: string;
  s3Key: string;
}
export interface ImageUrl extends Image {
  url: string;
}
export interface ImageCloudinary extends Image {
  cloudinaryPublicId: string;
}