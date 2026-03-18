import {Image} from "./image.types";

export type Manufacturer = {
  _id: string;
  name: string;
  images: [Image];
  thumbnail: Image;
  website: string;
  description: string;
  createdAt: Date;
  socials: [{service: string, link: string}];
}