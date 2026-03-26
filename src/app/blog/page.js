import Link from 'next/link';
import Hero from '@/components/page_components/home_page/Hero';
import { getSortedPostsData } from '@/lib/posts';

export default function Blog() {
  const posts = getSortedPostsData();

  return (
    <>
      <Hero />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#ff761b] font-orbitron">Chronix Insights</h1>
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
                <p className="text-gray-600 text-sm mb-3">{new Date(date).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{excerpt}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/blog/${id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}