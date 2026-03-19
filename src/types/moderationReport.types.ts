import { Mini } from "./mini.types";

export interface ModerationReport {
  _id?: string;
  userId: string;
  mini: Mini | string;
  description?: string;
  reason: "NSFW" | "notAMini" | "hateSpeech" | "harassment" | "spam" | "privacyViolation" | "intellectualPropertyViolation" | "other";
  status?: "open" | "accepted" | "rejected";
  resolution?: string;
  createdAt?: Date;
}