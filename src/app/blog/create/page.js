'use client';

import PostEditorForm from '@/components/page_components/blog/PostEditorForm';

export default function CreatePost() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create New Post</h1>
      <PostEditorForm
        mode="create"
        initialData={{ title: '', excerpt: '', content: '', coverImage: '', slug: '' }}
      />
    </div>
  );
}