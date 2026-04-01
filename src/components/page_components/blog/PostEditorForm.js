'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { uploadBlogCoverImage, uploadBlogContentImage } from '@/lib/firebaseStorage';
import { getCurrentUserIdToken } from '@/lib/firebaseAuth';

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
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || '');
  const [coverImageAlt, setCoverImageAlt] = useState(initialData?.coverImageAlt || '');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState('');
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
    coverImageUrl: initialData?.coverImageUrl || '',
    coverImageAlt: initialData?.coverImageAlt || '',
    slug: initialData?.slug || slug || '',
  }), [initialData, slug]);

  const isDirty = (
    title !== initialSnapshot.title ||
    excerpt !== initialSnapshot.excerpt ||
    content !== initialSnapshot.content ||
    coverImageUrl !== initialSnapshot.coverImageUrl ||
    coverImageAlt !== initialSnapshot.coverImageAlt
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
      const endpoint = isEditMode ? `/api/blog/${encodeURIComponent(resolvedSlug)}` : '/api/blog';
      const method = isEditMode ? 'PUT' : 'POST';
      const token = await getCurrentUserIdToken();

      if (!token) {
        throw new Error('You must sign in to create or edit posts.');
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          coverImageUrl,
          coverImageAlt,
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

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingCover(true);
    setUploadError('');

    try {
      const result = await uploadBlogCoverImage({ file, title });
      setCoverImageUrl(result.url);

      if (!coverImageAlt.trim()) {
        setCoverImageAlt(title || 'Chronix Technology blog image');
      }
    } catch (error) {
      console.error('Cover upload failed:', error);
      setUploadError(error.message || 'Failed to upload image.');
    } finally {
      setUploadingCover(false);
      event.target.value = '';
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
        <label className="block text-sm font-medium mb-2">Cover Image</label>
        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt={coverImageAlt || 'Cover preview'}
            className="mb-3 h-40 w-full rounded-lg object-cover border"
          />
        )}
        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
            {uploadingCover ? 'Uploading...' : coverImageUrl ? 'Replace Image' : 'Upload To Firebase Storage'}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={uploadingCover || submitting}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500">
            Sign in first. The upload uses your Firebase admin session and auto-generates an SEO-friendly filename from the post title.
          </p>
        </div>
        {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Cover Image Alt Text</label>
        <input
          type="text"
          value={coverImageAlt}
          onChange={(event) => setCoverImageAlt(event.target.value)}
          className="w-full rounded border p-2"
          placeholder="e.g. Network security illustration by Chronix Technology"
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
        <RichTextEditor
          value={content}
          onChange={setContent}
          onImageUpload={(file) => uploadBlogContentImage({ file }).then((result) => result.url)}
        />
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