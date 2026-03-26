'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const RichTextEditor = dynamic(
  () => import('@/components/page_components/blog/RichTextEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-72 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        Loading editor...
      </div>
    ),
  }
);

export default function PostEditorForm({
  initialData,
  mode = 'create',
  slug,
  editRedirectPath = '/admin/blog',
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const isEditMode = mode === 'edit';

  const normalizeSlug = (value) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const resolvedSlug = isEditMode
    ? normalizeSlug(initialData?.slug || slug || '')
    : normalizeSlug(title);

  const initialSnapshot = useMemo(() => ({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    coverImage: initialData?.coverImage || '',
    slug: initialData?.slug || slug || '',
  }), [initialData, slug]);

  const isDirty = (
    title !== initialSnapshot.title ||
    excerpt !== initialSnapshot.excerpt ||
    content !== initialSnapshot.content ||
    coverImage !== initialSnapshot.coverImage
  );

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirty || submitting) {
        return;
      }

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, submitting]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const endpoint = isEditMode ? `/api/blog/${encodeURIComponent(slug)}` : '/api/blog';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          coverImage,
          slug: resolvedSlug,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        const errorData = contentType.includes('application/json')
          ? await response.json()
          : { error: await response.text() };
        throw new Error(errorData.error || 'Unable to save post');
      }

      const result = await response.json();
      if (isEditMode) {
        router.push(editRedirectPath);
      } else {
        router.push(`/blog/${result.slug || slug}`);
      }
      router.refresh();
    } catch (error) {
      console.error('Error saving post:', error);
      alert(error.message || 'Failed to save post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded border p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Cover Image URL</label>
        <input
          type="url"
          value={coverImage}
          onChange={(event) => setCoverImage(event.target.value)}
          className="w-full rounded border p-2"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          className="h-20 w-full rounded border p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <RichTextEditor value={content} onChange={setContent} />
        <p className="mt-2 text-xs text-gray-500">
          Use the toolbar to format text, add headings, create links with custom text, and insert resizable images by URL.
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Post' : 'Create Post')}
      </button>
      {isDirty && !submitting && (
        <p className="text-xs text-amber-600">You have unsaved changes.</p>
      )}
    </form>
  );
}