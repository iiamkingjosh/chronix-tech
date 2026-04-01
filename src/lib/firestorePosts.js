import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAdminApp } from './firebaseAdmin';

const COLLECTION = 'posts';

function getDb() {
  return getFirestore(getAdminApp());
}

function normalizeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function serializePost(docSnap) {
  const data = docSnap.data();
  return {
    id: data.slug,
    slug: data.slug,
    title: data.title || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    coverImageUrl: data.coverImageUrl || '',
    coverImageAlt: data.coverImageAlt || '',
    author: data.author || 'Chronix Team',
    published: data.published ?? true,
    date: data.createdAt
      ? data.createdAt.toDate().toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    updatedAt: data.updatedAt
      ? data.updatedAt.toDate().toISOString().split('T')[0]
      : null,
  };
}

export async function getAllPosts({ publishedOnly = true } = {}) {
  const db = getDb();
  let query = publishedOnly
    ? db.collection(COLLECTION).where('published', '==', true)
    : db.collection(COLLECTION);
  const snapshot = await query.get();
  const posts = snapshot.docs.map(serializePost);

  return posts
    .sort((left, right) => {
      const leftTime = left.date ? new Date(left.date).getTime() : 0;
      const rightTime = right.date ? new Date(right.date).getTime() : 0;
      return rightTime - leftTime;
    });
}

export async function getPostBySlug(slug) {
  const db = getDb();
  const snapshot = await db
    .collection(COLLECTION)
    .where('slug', '==', slug)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  return serializePost(snapshot.docs[0]);
}

export async function createPost({ title, slug: rawSlug, excerpt, content, coverImageUrl, coverImageAlt, author, published }) {
  const db = getDb();
  const slug = normalizeSlug(rawSlug || title);

  if (!slug) throw new Error('Slug is required.');

  // Check for duplicate slug
  const existing = await db.collection(COLLECTION).where('slug', '==', slug).limit(1).get();
  if (!existing.empty) throw new Error('A post with this slug already exists.');

  const now = Timestamp.now();
  const docRef = await db.collection(COLLECTION).add({
    slug,
    title: title || '',
    excerpt: excerpt || '',
    content: content || '',
    coverImageUrl: coverImageUrl || '',
    coverImageAlt: coverImageAlt || '',
    author: author || 'Chronix Team',
    published: published ?? true,
    createdAt: now,
    updatedAt: now,
  });

  return { id: docRef.id, slug };
}

export async function updatePost(slug, { title, excerpt, content, coverImageUrl, coverImageAlt, author, published, slug: newSlugRaw }) {
  const db = getDb();

  // Find the document by current slug
  const snapshot = await db.collection(COLLECTION).where('slug', '==', slug).limit(1).get();
  if (snapshot.empty) throw new Error('Post not found.');

  const docRef = snapshot.docs[0].ref;
  const newSlug = normalizeSlug(newSlugRaw || slug);

  if (!title || !String(title).trim()) throw new Error('Title is required.');

  // If slug is changing, check for conflicts
  if (newSlug !== slug) {
    const conflict = await db.collection(COLLECTION).where('slug', '==', newSlug).limit(1).get();
    if (!conflict.empty) throw new Error('A post with this slug already exists.');
  }

  const updates = {
    slug: newSlug,
    title: title || '',
    excerpt: excerpt || '',
    content: content || '',
    coverImageUrl: coverImageUrl || '',
    coverImageAlt: coverImageAlt || '',
    author: author || 'Chronix Team',
    published: published ?? true,
    updatedAt: Timestamp.now(),
  };

  await docRef.update(updates);
  return { slug: newSlug };
}

export async function deletePost(slug) {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION).where('slug', '==', slug).limit(1).get();
  if (snapshot.empty) throw new Error('Post not found.');
  await snapshot.docs[0].ref.delete();
  return { slug };
}

export async function getAllSlugs() {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION)
    .where('published', '==', true)
    .select('slug', 'updatedAt', 'createdAt')
    .get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const rawDate = data.updatedAt || data.createdAt;
    return {
      slug: data.slug,
      lastModified: rawDate ? rawDate.toDate().toISOString() : null,
    };
  });
}
