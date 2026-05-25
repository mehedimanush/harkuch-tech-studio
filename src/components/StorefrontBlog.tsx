/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useDb } from '../dbContext';
import { Calendar, User, Eye, ArrowLeft, ArrowRight, MessageSquare, BookOpen, Clock } from 'lucide-react';

interface BlogProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export default function StorefrontBlog({ onNavigate, currentRoute }: BlogProps) {
  const { blogs } = useDb();
  
  const [selectedBlogSlug, setSelectedBlogSlug] = useState('');

  // Sync route slug matching: e.g. #blog/rtx-40-series-gaming-tips
  useEffect(() => {
    const hash = currentRoute || window.location.hash || '';
    const parts = hash.split('/');
    if (parts.length > 1 && parts[0] === '#blog') {
      setSelectedBlogSlug(parts[1]?.split('?')[0]);
    } else {
      setSelectedBlogSlug('');
    }
  }, [currentRoute]);

  const activeBlogs = blogs.filter(b => b.isPublished);

  // If viewing details of a single post
  if (selectedBlogSlug) {
    const post = blogs.find(b => b.slug === selectedBlogSlug);
    
    if (!post) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-400 font-mono space-y-4">
          <p className="text-sm">⚠️ Article not found or under construction.</p>
          <button onClick={() => onNavigate('#blog')} className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-mono font-bold">
            Back to Tech Blog
          </button>
        </div>
      );
    }

    return (
      <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors py-12">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          
          <button
            onClick={() => onNavigate('#blog')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-500 font-mono font-bold mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back to News List
          </button>

          <div className="space-y-4 mb-8">
            <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 font-extrabold uppercase font-mono rounded text-[10px] tracking-widest">{post.category}</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-910 dark:text-white leading-tight">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Posted: {post.publishedAt}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 4 Min Typereads</span>
            </div>
          </div>

          <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden mb-8 border border-slate-150 dark:border-slate-850 shadow-md">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Render Rich text Content beautifully under custom markdown classes */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-650 dark:text-slate-300 leading-relaxed text-sm sm:text-base space-y-6">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Tag Cloud */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t dark:border-slate-850 flex flex-wrap gap-2 text-xs font-mono">
              <span className="text-slate-500">Tags:</span>
              {post.tags.map(tg => (
                <span key={tg} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-950 rounded-md border dark:border-slate-900 text-slate-600 dark:text-slate-400">#{tg}</span>
              ))}
            </div>
          )}

        </article>
      </div>
    );
  }

  // STANDARD LIST OVERVIEW
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 transition-colors py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-xl mx-auto space-y-3">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500">Harkuch tech newsroom</p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-910 dark:text-white">Tech Blogs & Setup Guides</h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Stay updated with hardware releases, benchmark diagnostics, and optimization walkthroughs crafted by our team.</p>
        </div>

        {/* Article listing grid */}
        {activeBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeBlogs.map(post => (
              <div
                key={post.id}
                className="group bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-56 overflow-hidden relative bg-slate-100 dark:bg-slate-900/50">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <span className="absolute top-4 left-4 px-2.5 py-1 bg-slate-950 text-white font-bold font-mono rounded-lg text-[10px] tracking-wider uppercase border border-white/10">{post.category}</span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-550 dark:text-slate-500">
                      <span>✓ Author: {post.author}</span>
                      <span>• {post.publishedAt}</span>
                    </div>

                    <button
                      onClick={() => onNavigate(`#blog/${post.slug}`)}
                      className="text-left font-black text-slate-950 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 block transition text-lg sm:text-xl leading-tight line-clamp-2"
                    >
                      {post.title}
                    </button>

                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 font-mono">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => onNavigate(`#blog/${post.slug}`)}
                    className="py-2.5 px-4 bg-slate-50 dark:bg-slate-900 border dark:border-slate-850 text-slate-700 dark:text-slate-350 hover:bg-orange-500 hover:text-white rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer hover:border-transparent"
                  >
                    Read Full walk-through <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-16 text-center text-slate-500 font-mono text-xs">⚠️ No blog articles are currently active in active databases.</p>
        )}

      </div>
    </div>
  );
}
