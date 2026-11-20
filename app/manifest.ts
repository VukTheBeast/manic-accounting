import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Manic",
    description: site.description,
    start_url: "/en",
    display: "standalone",
    background_color: "#f7f8fb",
    theme_color: "#0b2447",
  };
}
