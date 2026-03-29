import {Image} from "./image.types";
import { Social } from "./social.types";

export type Manufacturer = {
  _id?: string;
  name: string;
  images: Image[];
  thumbnail?: Image;
  website?: string;
  description?: string;
  createdAt?: Date;
  socials?: Social[];
}