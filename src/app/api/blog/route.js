import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

function buildFrontmatter({ title, excerpt, coverImage, date }) {
  return `---
title: ${JSON.stringify(title)}
date: ${JSON.stringify(date)}
excerpt: ${JSON.stringify(excerpt)}
coverImage: ${JSON.stringify(coverImage || '')}
---

`;
}

function normalizeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request) {
  const { title, excerpt, content, coverImage, slug: requestedSlug } = await request.json();

  // Generate slug from title
  const slug = normalizeSlug(requestedSlug || title);

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Create frontmatter
  const frontmatter = buildFrontmatter({
    title,
    excerpt,
    coverImage,
    date: new Date().toISOString().split('T')[0],
  });

  const fileContent = frontmatter + content;

  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    return new Response(JSON.stringify({ error: 'A post with this slug already exists' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Write the file
  fs.writeFileSync(filePath, fileContent);

  return new Response(JSON.stringify({ message: 'Post created', slug }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.mdx$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        ...matterResult.data,
      };
    });

    // Sort posts by date
    const sortedPosts = allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });

    return new Response(JSON.stringify(sortedPosts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}