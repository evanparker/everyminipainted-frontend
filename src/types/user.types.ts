import { Image } from "./image.types";
import { Mini } from "./mini.types";

export type User = {
  _id: string;
  username: string;
  email: string;
  password?: string;
  roles: string[];
  avatar?: Image;
  website?: string;
  description?: string;
  socials?: {
    service: string;
    link: string;
  }[];
  favorites?: Mini[] | string[];
  createdAt: Date;
  violations: number;
}
