import { getPostBySlug, getRecentPosts, getTrendingPosts } from "@/lib/wordpress";
import { PostJsonLd } from "@/components/json-ld";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Share2, Clock } from "lucide-react";
import Link from "next/link";
import PostAnalytics from "@/components/post-analytics";
import Image from "next/image";
import Footer from "@/components/footer";
import ShareButton from "@/components/ShareButton";
// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const description = post.excerpt.replace(/<[^>]*>/g, "").substring(0, 160);

  return {
    title: post.title,
    description,
    keywords: post.tags.map((tag) => tag.name).join(", "),
    authors: [{ name: post.author.name || "AliveNow" }],
    openGraph: {
      title: post.title,
      description,
      images: post.featuredImage.url
        ? [
            {
              url: post.featuredImage.url,
              width: 1200,
              height: 630,
              alt: post.featuredImage.alt,
            },
          ]
        : [],
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author.name],
      section: post.tags.length > 0 ? post.tags[0].name : "General",
      tags: post.tags.map((tag) => tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.featuredImage.url ? [post.featuredImage.url] : [],
    },
    alternates: {
      canonical: `/post/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }) {
  const [post, recentPosts] = await Promise.all([
    getPostBySlug(params.slug),
    getRecentPosts(5),
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
            <div className="flex items-center justify-between h-16">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>

              {/* <h1 className="text-xl font-bold text-gray-900">AliveNow</h1> */}
              <Image
                src="/alivenow.svg"
                alt="AliveNow icon"
                width={32}
                height={32}
                className="h-12 w-auto"
              />

              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-3">
              {/* Featured Image */}
              {post.featuredImage.url && (
                <div className="aspect-video overflow-hidden rounded-2xl mb-8">
                  <img
                    src={post.featuredImage.url || "/placeholder.svg"}
                    alt={post.featuredImage.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Post Header */}
              <header className="mb-8">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {/* <span>By {post.author.name}</span> */}
                    <span>Author - AliveNow</span>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(post.date)}</span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{calculateReadTime(post.content)} min read</span>
                  </div>
                </div>

                {/* Excerpt */}
                <div
                  className="text-xl text-gray-700 leading-relaxed mb-8 border-l-4 border-blue-500 pl-6 italic"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
              </header>

              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-700 [&_iframe]:rounded-lg [&_iframe]:shadow-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Post Footer */}
              <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {post.author.avatar && (
                      <img
                        src="/alivenow.svg"
                        // alt={post.author.name}
                        alt="AliveNow"
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {/* {post.author.name} */}
                        AliveNow
                      </p>
                      <p className="text-sm text-gray-600">Author</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {/* <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button> */}
                    <ShareButton post={post} />
                  </div>
                </div>
              </footer>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              {/* Recent Posts */}
              {/* <section className="sticky top-8 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-green-500" />
                    Recent Posts
                  </h3>

                  <div className="space-y-4">
                    {recentPosts
                      .filter((recentPost) => recentPost.id !== post.id)
                      .slice(0, 4)
                      .map((recentPost) => (
                        <Link
                          key={recentPost.id}
                          href={`/post/${recentPost.slug}`}
                        >
                          <Card className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group  hover:border-l-green-600">
                            <div className="space-y-3">
                              <div className="flex flex-col items-center text-center gap-3">
                                <div className="flex-shrink-0 flex justify-center">
                                  <img
                                    src={
                                      recentPost.featuredImage?.url ||
                                      "/placeholder.svg?height=80&width=100&query=blog post" ||
                                      "/placeholder.svg"
                                    }
                                    alt={
                                      recentPost.featuredImage?.alt ||
                                      recentPost.title
                                    }
                                    className="w-24 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-green-600 transition-colors leading-tight text-center">
                                    {recentPost.title}
                                  </h4>
                                  <div className="text-xs text-gray-500 text-center">
                                    {formatDate(recentPost.date)}
                                  </div>
                                </div>
                              </div>

                              {recentPost.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100 justify-center">
                                  {recentPost.tags.slice(0, 3).map((tag) => (
                                    <Badge
                                      key={tag.id}
                                      variant="outline"
                                      className="text-xs px-2 py-0.5 h-auto"
                                    >
                                      {tag.name}
                                    </Badge>
                                  ))}
                                  {recentPost.tags.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs px-2 py-0.5 h-auto text-gray-400"
                                    >
                                      +{recentPost.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </Card>
                        </Link>
                      ))}
                  </div>
                </div>
              </section> */}
              <section className="mb-8 sticky top-2">
                <div className="flex items-center mb-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <Clock className="h-6 w-6 mr-3 text-green-500" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Posts
                  </h3>
                </div>

                <div className="space-y-4">
                  {recentPosts.map((post, index) => (
                    <Link key={post.id} href={`/post/${post.slug}`}>
                      <Card className="p-0 hover:shadow-xl transition-all duration-400 cursor-pointer group overflow-hidden my-4 hover:border-l-green-500 hover:-translate-y-1 hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
                        <div className="flex">
                          <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden">
                            <img
                              src={
                                post.featuredImage.url ||
                                "/placeholder.svg?height=80&width=80&query=recent blog post thumbnail" ||
                                "/placeholder.svg"
                              }
                              alt={post.featuredImage.alt || post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <div className="p-4 flex-1">
                            <h4 className="font-semibold line-clamp-2 mb-2 group-hover:text-green-600 transition-colors duration-300 text-sm leading-tight">
                              {post.title}
                            </h4>
                            <div className="text-xs text-gray-500 group-hover:text-green-500 transition-colors duration-300">
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

        {/* <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-400">Footer content will be added here</p>
            </div>
          </div>
        </footer> */}

        {/* <PostAnalytics post={post} /> */}
        <Footer />

        <PostAnalytics post={post} />
      </div>
    </>
  );
}
