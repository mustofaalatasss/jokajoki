import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Cegah Google mengindeks halaman rahasia
      disallow: ["/dashboard", "/history", "/customers", "/owner", "/settings"],
    },
    sitemap: "https://jokajoki.my.id/sitemap.xml",
  };
}
