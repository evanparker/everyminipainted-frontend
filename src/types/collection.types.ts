import { Figure } from "./figure.types";
import { Image } from "./image.types";
import { Manufacturer } from "./manufacturer.types";

export type Collection = { 
  _id: string;
  name: string;
  manufacturer: Manufacturer | string;
  figures: Figure[] | string[];
  images: Image[] | string[];
  thumbnail: Image | string;
  description?: string;
  website?: string;
  partNumber?: string;
  createdAt: Date;
}