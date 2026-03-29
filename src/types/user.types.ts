import { Image } from "./image.types";
import { Mini } from "./mini.types";
import { Social } from "./social.types";

export type User = {
  _id: string;
  username: string;
  email: string;
  password?: string;
  roles: string[];
  avatar?: Image;
  website?: string;
  description?: string;
  socials?: Social[];
  favorites?: Mini[] | string[];
  createdAt: Date;
  violations: number;
};
