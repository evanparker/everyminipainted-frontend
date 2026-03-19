import { Image } from "./image.types";
import { Manufacturer } from "./manufacturer.types";

export type Figure = {
  _id: string;
  name: string;
  manufacturer: Manufacturer | string;
  description: string;
  collectionId: string;
  images: Image[] | string[];
  thumbnail: Image | string;
  createdAt: Date;
  website?: string;
  partNumber?: string;
  artist?: string;
}