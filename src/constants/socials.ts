import {
  FaBluesky,
  FaFacebook,
  FaInstagram,
  FaMastodon,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { Social, SocialService } from "../types/social.types";

const Socials: { [key in SocialService]: Social } = {
  facebook: {
    name: "Facebook",
    service: SocialService.Facebook,
    icon: FaFacebook,
  },
  bluesky: {
    name: "Bluesky",
    service: SocialService.Bluesky,
    icon: FaBluesky,
  },
  mastodon: {
    name: "Mastodon",
    service: SocialService.Mastodon,
    icon: FaMastodon,
  },
  instagram: {
    name: "Instagram",
    service: SocialService.Instagram,
    icon: FaInstagram,
  },
  twitch: {
    name: "Twitch",
    service: SocialService.Twitch,
    icon: FaTwitch,
  },
  youtube: {
    name: "YouTube",
    service: SocialService.YouTube,
    icon: FaYoutube,
  },
  twitter: {
    name: "Twitter",
    service: SocialService.Twitter,
    icon: FaTwitter,
  },
};

export default Socials;
