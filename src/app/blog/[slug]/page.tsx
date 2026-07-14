'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, Share2 } from 'lucide-react';
import { IBlog } from '@/types';
import { formatDate } from '@/lib/utils';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs?slug=${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setBlog(d.data);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-64 bg-dark-100 rounded-3xl" />
        <div className="h-8 w-3/4 bg-dark-100 rounded" />
        <div className="h-4 w-1/2 bg-dark-100 rounded" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-display font-bold text-dark-900 mb-2">
          Post Not Found
        </h1>
        <Link href="/blog" className="text-primary-600 font-semibold">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-dark-500 hover:text-primary-600 text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-primary-600 text-xs font-semibold uppercase tracking-wider">
            {blog.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mt-2 mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-dark-400 mb-8">
            {blog.authorAvatar && (
              <img src={blog.authorAvatar} alt="" className="w-10 h-10 rounded-full" />
            )}
            <div>
              <div className="font-semibold text-dark-700">
                {blog.authorName}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span>{formatDate(blog.createdAt)}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {blog.readTime} min read
                </span>
              </div>
            </div>
            <button className="ml-auto p-2 rounded-full hover:bg-dark-50">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          src={blog.image}
          alt={blog.title}
          className="w-full h-64 sm:h-96 object-cover rounded-3xl mb-10 shadow-elevated"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none"
        >
          <p className="text-dark-600 leading-relaxed text-lg">{blog.content}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {blog.tags.map(tag => (
              <Link
                key={tag}
                href={`/blog`}
                className="bg-dark-50 hover:bg-dark-100 text-dark-600 text-xs px-4 py-2 rounded-full transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </motion.div>
      </article>
    </div>
  );
}