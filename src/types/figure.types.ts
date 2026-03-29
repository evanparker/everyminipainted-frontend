import { Image } from "./image.types";
import { Manufacturer } from "./manufacturer.types";

export type Figure = {
  _id?: string;
  name: string;
  manufacturer?: Manufacturer;
  description: string;
  images: Image[];
  thumbnail?: Image;
  createdAt?: Date;
  website?: string;
  partNumber?: string;
  artist?: string;
}