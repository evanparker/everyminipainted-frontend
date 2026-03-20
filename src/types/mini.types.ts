import { Figure } from "./figure.types";
import { Image } from "./image.types";
import { User } from "./user.types";

export type Mini = {
  _id: string;
  name: string;
  userId: User;
  images: Image[] | string[];
  thumbnail: string;
  figure?: Figure | string;
  description?: string;
  favorites: number;
  createdAt: Date;
  blur?: boolean;
  isDeleted?: boolean;
}