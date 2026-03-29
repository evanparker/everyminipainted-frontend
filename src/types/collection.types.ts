import { Figure } from "./figure.types";
import { Image } from "./image.types";
import { Manufacturer } from "./manufacturer.types";

export type Collection = { 
  _id?: string;
  name: string;
  manufacturer?: Manufacturer;
  figures: Figure[];
  images: Image[];
  thumbnail?: Image;
  description?: string;
  website?: string;
  partNumber?: string;
  createdAt?: Date;
}