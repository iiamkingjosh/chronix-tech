import type { MetadataRoute } from "next";
import { getAllSlugs } from "../lib/firestorePosts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://chronixtechnology.com";

  let posts: { url: string; lastModified: Date }[] = [];
  try {
    const slugs = await getAllSlugs();
    posts = slugs.map((item) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastModified: item.lastModified ? new Date(item.lastModified) : new Date(),
    }));
  } catch (error) {
    console.error("Error fetching post slugs for sitemap:", error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
    ...posts,
  ];
}