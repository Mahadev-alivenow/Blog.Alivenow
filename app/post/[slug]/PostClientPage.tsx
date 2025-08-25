"use client";

import { getPostBySlug, getRecentPosts } from "@/lib/wordpress";
import { PostJsonLd } from "@/components/json-ld";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import PostAnalytics from "@/components/post-analytics";
import Image from "next/image";
import Footer from "@/components/footer";
import ShareButton from "@/components/ShareButton";
import { authorMap } from "@/utils/helpers";

function PostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-video bg-gray-200 rounded-2xl mb-8"></div>
      <div className="space-y-4 mb-8">
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex">
          <div className="w-20 h-20 bg-gray-200 rounded"></div>
          <div className="p-4 flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function PostClientPage({
  params,
}: {
  params: { slug: string };
}) {
  const [post, recentPosts] = await Promise.all([
    getPostBySlug(params.slug),
    getRecentPosts(7),
  ]);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <>
      <PostJsonLd post={post} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 animate-fade-in">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-[#E92628] hover:text-white transition-all duration-300 hover:cursor-pointer hover:scale-105 hover:shadow-md"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                  Back to Blog
                </Button>
              </Link>

              <Link href="/" className="block">
                <Image
                  src="/alivenow.svg"
                  alt="AliveNow icon"
                  width={32}
                  height={32}
                  className="h-12 w-auto transition-transform duration-300 hover:scale-110"
                />
              </Link>

              <div className="animate-slide-in-right">
                <ShareButton post={post} />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-3 animate-slide-in-up">
              {/* Featured Image */}
              {post.featuredImage.url && (
                <div className="aspect-video overflow-hidden rounded-2xl mb-8 group">
                  <img
                    src={post.featuredImage.url || "/placeholder.svg"}
                    alt={post.featuredImage.alt}
                    className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Post Header */}
              <header className="mb-8 animate-slide-in-up animation-delay-200">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="animate-fade-in hover:bg-[#E92628] hover:text-white transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h1
                  className="text-4xl font-bold text-gray-900 mb-4 leading-tight animate-slide-in-up animation-delay-300"
                  dangerouslySetInnerHTML={{ __html: post.title }}
                />

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6 animate-slide-in-up animation-delay-400">
                  <div className="flex items-center hover:text-[#E92628] transition-colors duration-300">
                    <User className="h-4 w-4 mr-2" />
                    {/* <span>Author - AliveNow</span> */}
                    <span>
                      Author - {authorMap[post.author.name] || post.author.name}
                    </span>
                  </div>

                  <div className="flex items-center hover:text-[#E92628] transition-colors duration-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(post.date)}</span>
                  </div>

                  <div className="flex items-center hover:text-[#E92628] transition-colors duration-300">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{calculateReadTime(post.content)} min read</span>
                  </div>
                </div>

                {/* Excerpt */}
                <div
                  className="text-xl text-gray-700 leading-relaxed mb-8 border-l-4 border-[#E92628] pl-6 italic animate-slide-in-up animation-delay-500 hover:border-l-8 transition-all duration-300"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
              </header>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#E92628] prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-[#E92628] prose-blockquote:text-gray-700 [&_iframe]:rounded-lg [&_iframe]:shadow-lg animate-slide-in-up animation-delay-600"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Post Footer */}
              <footer className="mt-12 pt-8 border-t border-gray-200 animate-slide-in-up animation-delay-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 group">
                    {post.author.avatar && (
                      <img
                        src="/alivenow.svg"
                        alt="AliveNow"
                        className="w-12 h-12 rounded-full transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-[#E92628] transition-colors duration-300">
                        {/* AliveNow */}
                        <span>
                          {/* Author -{" "} */}
                          {authorMap[post.author.name] || post.author.name}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">Author</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <ShareButton post={post} />
                  </div>
                </div>
              </footer>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 animate-slide-in-right animation-delay-300">
              <section className="mb-8 sticky top-2">
                <div className="flex items-center mb-6 p-3 bg-gradient-to-r from-gray-50 to-red-50 rounded-lg hover:from-red-50 hover:to-red-100 transition-all duration-300 hover:shadow-md">
                  <Clock className="h-6 w-6 mr-3 text-[#E92628] animate-pulse" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Posts
                  </h3>
                </div>

                <div className="space-y-4">
                  {recentPosts.map((post, index) => (
                    <Link key={post.id} href={`/${post.slug}`}>
                      <Card
                        className="p-0 hover:shadow-xl transition-all duration-400 cursor-pointer group overflow-hidden my-4 hover:border-l-[#E92628] hover:border-b-[#E92628] hover:-translate-y-1 hover:scale-[1.02] bg-white/90 backdrop-blur-sm animate-fade-in"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="flex">
                          <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden">
                            <img
                              src={
                                post.featuredImage.url ||
                                "/placeholder.svg?height=80&width=80&query=recent blog post thumbnail" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={post.featuredImage.alt || post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E92628]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <div className="p-4 flex-1">
                            <h4
                              className="font-semibold line-clamp-2 mb-2 group-hover:text-[#E92628] transition-colors duration-300 text-sm leading-tight"
                              dangerouslySetInnerHTML={{ __html: post.title }}
                            />
                            <div className="text-xs text-gray-500 group-hover:text-[#E92628] transition-colors duration-300">
                              {formatDate(post.date)}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </main>

        <Footer />
        <PostAnalytics post={post} />
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </>
  );
}
