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

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    const filePath = path.join(postsDirectory, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContents);

    return new Response(JSON.stringify({
      slug,
      content: matterResult.content,
      ...matterResult.data,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request, { params }) {
  const { slug } = await params;

  try {
    const filePath = path.join(postsDirectory, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existingFile = fs.readFileSync(filePath, 'utf8');
    const existingMatter = matter(existingFile);
    const { title, excerpt, content, coverImage, slug: nextSlugRaw } = await request.json();
    const nextSlug = normalizeSlug(nextSlugRaw || slug);

    if (!nextSlug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const nextFilePath = path.join(postsDirectory, `${nextSlug}.mdx`);
    if (nextSlug !== slug && fs.existsSync(nextFilePath)) {
      return new Response(JSON.stringify({ error: 'A post with this slug already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const nextContent = buildFrontmatter({
      title,
      excerpt,
      coverImage,
      date: existingMatter.data.date || new Date().toISOString().split('T')[0],
    }) + content;

    fs.writeFileSync(nextFilePath, nextContent);
    if (nextSlug !== slug) {
      fs.unlinkSync(filePath);
    }

    return new Response(JSON.stringify({ message: 'Post updated successfully', slug: nextSlug }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return new Response(JSON.stringify({ error: 'Failed to update post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request, { params }) {
  const { slug } = await params;

  try {
    const filePath = path.join(postsDirectory, `${slug}.mdx`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    return new Response(JSON.stringify({ message: 'Post deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}