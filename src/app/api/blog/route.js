import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

export async function POST(request) {
  const { title, excerpt, content } = await request.json();

  // Generate slug from title
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Create frontmatter
  const frontmatter = `---
title: "${title}"
date: "${new Date().toISOString().split('T')[0]}"
excerpt: "${excerpt}"
---

`;

  const fileContent = frontmatter + content;

  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  // Write the file
  fs.writeFileSync(filePath, fileContent);

  return new Response(JSON.stringify({ message: 'Post created', slug }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}