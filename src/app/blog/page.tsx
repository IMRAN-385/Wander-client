'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Clock, ArrowRight, Search } from 'lucide-react';
import { IBlog, PaginatedResponse } from '@/types';
import { formatDate } from '@/lib/utils';
import { blogs as fallbackBlogs } from '@/data/collections';

const ScrollReveal = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const data = await response.json();
        if (data?.success && Array.isArray(data?.data?.items)) {
          setBlogs(data.data.items);
          return;
        }
      } catch {
        // fall back to local seed data below
      }

      setBlogs(fallbackBlogs as IBlog[]);
    };

    loadBlogs().finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-primary-200 to-dark-700">
        <div className="absolute inset-0 bg-mesh opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary-300 text-sm font-semibold uppercase tracking-wider">
              Travel Journal
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mt-3 mb-4">
              Wanderlust Blog
            </h1>
            <p className="text-primary-200/80 max-w-lg mx-auto">
              Stories, guides, and inspiration from travelers around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 bg-dark-50 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((post, i) => (
                <ScrollReveal key={post._id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block bg-white rounded-3xl overflow-hidden card-shadow hover:shadow-elevated transition-all duration-500"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-dark-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-dark-400 mb-3">
                        {post.authorAvatar && (
                          <img src={post.authorAvatar} alt="" className="w-6 h-6 rounded-full" />
                        )}
                        <span>{post.authorName}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime} min read
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-dark-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-dark-400 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-primary-600 font-semibold text-sm">
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}