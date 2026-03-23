import {Image} from "./image.types";

export type Manufacturer = {
  _id: string;
  name: string;
  images: Image[] | string[];
  thumbnail: Image | string;
  website?: string;
  description?: string;
  createdAt: Date;
  socials?: [{service: string, link: string}];
}