import { ModerationReason } from "../types/moderationReport.types";

const moderationReportReasons: { name: ModerationReason; description: string }[] = [
  {
    name: ModerationReason.NSFW,
    description: "NSFW - Not Safe For Work. Nudity, sexual content etc.",
  },
  { name: ModerationReason.notAMini, description: "Not a mini" },
  { name: ModerationReason.hateSpeech, description: "Hate Speech" },
  { name: ModerationReason.harassment, description: "Harassment" },
  { name: ModerationReason.spam, description: "Spam" },
  { name: ModerationReason.privacyViolation, description: "Privacy Violation" },
  {
    name: ModerationReason.intellectualPropertyViolation,
    description: "Intellectual Property Violation",
  },
  { name: ModerationReason.other, description: "Other (please describe)" },
];

export default moderationReportReasons;
