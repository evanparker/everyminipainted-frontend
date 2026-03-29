import { ComponentProps, FC } from "react";

export type Social = {
  name: string;
  link?: string;
  service: SocialService;
  icon: FC<ComponentProps<"svg">>;
};

export enum SocialService {
  Facebook = "facebook",
  Bluesky = "bluesky",
  Mastodon = "mastodon",
  Instagram = "instagram",
  Twitch = "twitch",
  YouTube = "youtube",
  Twitter = "twitter",
}
