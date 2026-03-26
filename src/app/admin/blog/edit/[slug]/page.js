import Link from 'next/link';
import PostEditorForm from '@/components/page_components/blog/PostEditorForm';
import { getPostData } from '@/lib/posts';

export default async function EditBlogPostPage({ params }) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  if (!postData) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-4 text-3xl font-bold text-[#003366]">Post Not Found</h1>
        <p className="mb-6 text-gray-600">The post you are trying to edit could not be found.</p>
        <Link
          href="/admin/blog"
          className="rounded bg-[#003366] px-4 py-2 text-white transition hover:bg-[#0d4d86]"
        >
          Back to Admin Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#003366]">Edit Post</h1>
          <p className="mt-2 text-sm text-gray-500">Update the content and save your changes.</p>
        </div>
        <Link
          href="/admin/blog"
          className="rounded border border-[#003366] px-4 py-2 text-[#003366] transition hover:bg-[#003366] hover:text-white"
        >
          Back to Admin
        </Link>
      </div>

      <PostEditorForm
        mode="edit"
        slug={slug}
        editRedirectPath="/admin/blog"
        initialData={{
          slug,
          title: postData.title || '',
          excerpt: postData.excerpt || '',
          content: postData.content || '',
          coverImage: postData.coverImage || '',
        }}
      />
    </div>
  );
}