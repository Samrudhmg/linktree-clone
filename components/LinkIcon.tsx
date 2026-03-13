"use client";

import { 
  LucideLink, 
  Globe, 
  Mail, 
  Phone, 
  Twitter, 
  Instagram, 
  Youtube, 
  Music2, 
  Linkedin, 
  Github, 
  Music, 
  MessageSquare, 
  Twitch, 
  ShoppingBag, 
  FileText, 
  Calendar, 
  Heart, 
  Star,
  MessageCircle,
  Share2
} from "lucide-react";

interface LinkIconProps {
  icon: string;
  color?: string;
  size?: string;
  className?: string;
}

export function LinkIcon({ icon, color = "#1F2937", size = "w-5 h-5", className: extraClassName = "" }: LinkIconProps) {
  const className = `${size} shrink-0 ${extraClassName}`;
  const props = { className, color };

  switch (icon) {
    case "link": return <LucideLink {...props} />;
    case "globe": return <Globe {...props} />;
    case "mail": return <Mail {...props} />;
    case "phone": return <Phone {...props} />;
    case "twitter": return <Twitter {...props} />;
    case "instagram": return <Instagram {...props} />;
    case "youtube": return <Youtube {...props} />;
    case "tiktok": return <Music2 {...props} />;
    case "linkedin": return <Linkedin {...props} />;
    case "github": return <Github {...props} />;
    case "spotify": return <Music {...props} />;
    case "discord": return <MessageSquare {...props} />;
    case "twitch": return <Twitch {...props} />;
    case "shopping": return <ShoppingBag {...props} />;
    case "document": return <FileText {...props} />;
    case "calendar": return <Calendar {...props} />;
    case "heart": return <Heart {...props} />;
    case "star": return <Star {...props} />;
    case "music": return <Music {...props} />;
    case "whatsapp": return <MessageCircle {...props} />;
    case "telegram": return <Share2 {...props} />;
    case "facebook": return <MessageCircle {...props} />;
    default: return null;
  }
}
