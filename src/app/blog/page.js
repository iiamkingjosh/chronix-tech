import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';

export default function Blog() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <ul className="space-y-4">
        {allPostsData.map(({ id, date, title, excerpt }) => (
          <li key={id} className="border-b pb-4">
            <Link href={`/blog/${id}`} className="text-2xl font-semibold hover:underline">
              {title}
            </Link>
            <p className="text-gray-600">{date}</p>
            <p>{excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}