'use client';

import Link from 'next/link';
import Hero from '@/components/page_components/home_page/Hero';
import { useState, useEffect } from 'react';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load posts from API
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the post from the local state
        setPosts(posts.filter(post => post.id !== slug));
        alert('Post deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Error deleting post: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <Hero />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff761b] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Hero />
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center text-[#ff761b] font-orbitron">Chronix Insights</h1>
          <Link
            href="/blog/create"
            className="bg-[#ff761b] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
          >
            Create New Post
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(({ id, date, title, excerpt, coverImage }) => (
            <article key={id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              {coverImage && (
                <img
                  src={coverImage}
                  alt={title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <Link href={`/blog/${id}`} className="text-2xl font-semibold hover:underline block mb-2 text-[#003366]">
                  {title}
                </Link>
                <p className="text-gray-600 text-sm mb-3">{date}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{excerpt}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/blog/${id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read more →
                  </Link>
                  <button
                    onClick={() => handleDelete(id, title)}
                    className="text-red-600 hover:text-red-800 font-medium ml-auto"
                    title="Delete post"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}