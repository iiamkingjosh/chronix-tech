'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import {
  getCurrentUserIdToken,
  signInAdminWithGoogle,
  signOutAdmin,
  subscribeToAuthState,
} from '@/lib/firebaseAuth';

function AdminBlogInner() {
  const [posts, setPosts] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [activeTab, setActiveTab] = useState('manage');
  const searchParams = useSearchParams();

  const handleSignIn = async () => {
    try {
      await signInAdminWithGoogle();
      const next = searchParams.get('next');
      if (next && next.startsWith('/')) {
        window.location.href = next;
      }
    } catch (error) {
      console.error('Sign-in failed:', error);
      alert(error.message || 'Failed to sign in.');
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      setAuthUser(user);

      if (!user) {
        setPosts([]);
        setLoading(false);
        setAuthLoading(false);
        return;
      }

      const token = await getCurrentUserIdToken();
      await fetchPosts(token);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchPosts = async (tokenOverride) => {
    try {
      const token = tokenOverride || await getCurrentUserIdToken();
      if (!token) {
        setPosts([]);
        return;
      }

      const response = await fetch('/api/blog', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
        setFetchError('');
      } else {
        console.error('Failed to fetch posts');
        setFetchError('Failed to load posts. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setFetchError('Failed to load posts. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutAdmin();
    } catch (error) {
      console.error('Sign-out failed:', error);
      alert(error.message || 'Failed to sign out.');
    }
  };

  const handleDelete = async (slug, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const urlSlug = encodeURIComponent(slug);
      const token = await getCurrentUserIdToken();
      if (!token) {
        alert('Please sign in again.');
        return;
      }

      const response = await fetch(`/api/blog/${urlSlug}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchPosts();
        alert('Post deleted successfully!');
      } else {
        const contentType = response.headers.get('content-type') || '';
        let apiError = {};
        if (contentType.includes('application/json')) {
          try {
            apiError = await response.json();
          } catch (parseError) {
            console.error('Failed to parse JSON error', parseError);
          }
        } else {
          apiError = { message: await response.text() };
        }

        console.error('Delete API error:', {
          status: response.status,
          statusText: response.statusText,
          body: apiError,
        });

        const errorMsg = apiError.error || apiError.message || response.statusText || 'Unknown error';
        alert(`Error deleting post: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff761b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[#003366]">Blog Admin Sign-In</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in with your authorized Google account to manage blog posts.
          </p>
          <button
            onClick={handleSignIn}
            className="mt-6 w-full rounded-md bg-[#ff761b] px-4 py-2 font-medium text-white transition hover:bg-[#e06713]"
          >
            Continue with Google
          </button>
          <p className="mt-3 text-xs text-gray-500">
            Access is granted only to allowlisted admin emails when configured.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff761b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-[#003366] hover:text-[#ff761b] font-semibold">
                ← Back to Site
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-[#003366]">Blog Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-gray-600 md:inline">{authUser.email}</span>
              <Link
                href="/blog"
                className="text-[#ff761b] hover:text-[#003366] font-medium"
              >
                View Public Blog →
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'manage'
                    ? 'border-[#ff761b] text-[#ff761b]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Manage Posts ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-[#ff761b] text-[#ff761b]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Create New Post
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'manage' && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">All Posts</h2>
              <p className="mt-1 text-sm text-gray-600">Manage your blog posts</p>
            </div>

            {fetchError && (
              <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                <p className="text-sm text-red-700">{fetchError}</p>
              </div>
            )}

            {!fetchError && posts.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first blog post.</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-[#ff761b] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <div key={post.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          {post.coverImageUrl && (
                            <img
                              src={post.coverImageUrl}
                              alt={post.coverImageAlt || post.title}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-medium text-[#003366] truncate">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <span>Published: {post.date}</span>
                          <span className="mx-2">•</span>
                          <span>Slug: {post.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/blog/edit/${post.id}`}
                          className="text-[#003366] hover:text-[#ff761b] text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/blog/${post.id}`}
                          target="_blank"
                          className="text-[#ff761b] hover:text-[#003366] text-sm font-medium"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">Create New Post</h2>
              <p className="mt-1 text-sm text-gray-600">Write and publish a new blog post</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Quick Access</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Use the dedicated create page for a better writing experience.</p>
                  </div>
                  <div className="mt-3">
                    <Link
                      href="/blog/create"
                      className="bg-[#ff761b] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm font-medium"
                    >
                      Open Create Page →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Create Post Interface</h3>
              <p className="mt-1 text-sm text-gray-500">Access the full create post interface for better content creation.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminBlog() {
  return (
    <Suspense>
      <AdminBlogInner />
    </Suspense>
  );
}