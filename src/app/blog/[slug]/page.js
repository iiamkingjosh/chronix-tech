import Script from 'next/script';
import { notFound } from 'next/navigation';
import PostContent from './PostContent';
import { getPostBySlug } from '@/lib/firestorePosts';
import { SITE_BASE_URL, resolvePostCoverAlt, resolvePostCoverImage } from '@/lib/media';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const postData = await getPostBySlug(slug);
  if (!postData) {
    return { title: 'Post Not Found' };
  }

  const ogImage = resolvePostCoverImage(postData, { absolute: true, useDefault: true });
  const imageAlt = resolvePostCoverAlt(postData);
  const description = postData.excerpt || `Read "${postData.title}" on Chronix Insights.`;

  return {
    title: postData.title,
    description,
    openGraph: {
      title: postData.title,
      description,
      url: `${SITE_BASE_URL}/blog/${slug}`,
      siteName: 'Chronix Technology',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      locale: 'en_NG',
      type: 'article',
      publishedTime: postData.date,
      authors: ['Chronix Technology Limited'],
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Post({ params }) {
  const { slug } = await params;
  const postData = await getPostBySlug(slug);

  if (!postData || !postData.published) {
    notFound();
  }

  const resolvedCoverImage = resolvePostCoverImage(postData, { useDefault: false });
  const resolvedCoverAlt = resolvePostCoverAlt(postData);
  const schemaImage = resolvePostCoverImage(postData, { absolute: true, useDefault: true });

  return (
    <div className="container mx-auto px-4 py-8">
      <Script
        id={`blog-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: postData.title,
            description: postData.excerpt || '',
            image: schemaImage,
            url: `${SITE_BASE_URL}/blog/${slug}`,
            datePublished: postData.date,
            dateModified: postData.updatedAt || postData.date,
            author: {
              '@type': 'Organization',
              name: 'Chronix Technology Limited',
              url: SITE_BASE_URL,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Chronix Technology Limited',
              logo: {
                '@type': 'ImageObject',
                url: `${SITE_BASE_URL}/images/home_page/chronix-logo.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${SITE_BASE_URL}/blog/${slug}`,
            },
          }),
        }}
      />
      <article>
        {resolvedCoverImage && (
          <img
            src={resolvedCoverImage}
            alt={resolvedCoverAlt}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
        <p className="text-gray-600 mb-8">{postData.date}</p>
        <PostContent content={postData.content} />
      </article>
    </div>
  );
}