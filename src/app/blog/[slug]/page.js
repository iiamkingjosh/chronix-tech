import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostData, getAllPostIds } from '../../../lib/posts';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

export async function generateMetadata({ params }) {
  const postData = await getPostData(params.slug);
  return {
    title: postData.title,
  };
}

export default async function Post({ params }) {
  const postData = await getPostData(params.slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <article>
        <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
        <p className="text-gray-600 mb-8">{postData.date}</p>
        <MDXRemote source={postData.content} />
      </article>
    </div>
  );
}