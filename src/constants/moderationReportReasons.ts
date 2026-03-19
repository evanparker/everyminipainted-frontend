const moderationReportReasons = [
  {
    name: "NSFW",
    description: "NSFW - Not Safe For Work. Nudity, sexual content etc.",
  },
  { name: "notAMini", description: "Not a mini" },
  { name: "hateSpeech", description: "Hate Speech" },
  { name: "harassment", description: "Harassment" },
  { name: "spam", description: "Spam" },
  { name: "privacyViolation", description: "Privacy Violation" },
  {
    name: "intellectualPropertyViolation",
    description: "Intellectual Property Violation",
  },
  { name: "other", description: "Other (please describe)" },
];

export default moderationReportReasons;
