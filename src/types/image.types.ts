export type Image = {
  _id: string;
  type: string;
  cloudinaryPublicId?: string;
  url?: string;
  s3Bucket?: string;
  s3Key?: string;
  caption?: string;
  altText?: string;
  createdAt?: Date;
}