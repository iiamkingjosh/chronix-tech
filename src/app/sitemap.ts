import type { MetadataRoute } from "next";
import { getSortedPostsData } from "../lib/posts";

interface PostData {
  id: string;
  date: string;
  title: string;
  excerpt: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://chronixtechnology.com";

  const posts = (getSortedPostsData() as PostData[]).map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
  }));

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