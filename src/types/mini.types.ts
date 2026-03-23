import { Figure } from "./figure.types";
import { Image } from "./image.types";
import { User } from "./user.types";

export type Mini = {
  _id?: string;
  name: string;
  userId: User;
  images: Image[];
  thumbnail?: Image;
  figure?: Figure;
  description?: string;
  favorites: number;
  createdAt?: Date;
  blur?: boolean;
  isDeleted?: boolean;
}