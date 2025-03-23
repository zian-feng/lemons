import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LiveLoveLemons",
    short_name: "Lemons",
    description: "Track your lemon consumption",
    start_url: "/",
    display: "standalone",
    background_color: "#fff9c4",
    theme_color: "#ffeb3b",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple-touch-icon",
      },
    ],
  }
}

