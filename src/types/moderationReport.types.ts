import { Mini } from "./mini.types";

export enum ModerationReason {
  NSFW = "NSFW",
  notAMini = "notAMini",
  hateSpeech = "hateSpeech",
  harassment = "harassment",
  spam = "spam",
  privacyViolation = "privacyViolation",
  intellectualPropertyViolation = "intellectualPropertyViolation",
  other = "other",
}

export interface ModerationReport {
  _id?: string;
  userId?: string;
  mini: Mini | string;
  description?: string;
  reason: ModerationReason;
  status?: "open" | "accepted" | "rejected";
  resolution?: string;
  createdAt?: Date;
}