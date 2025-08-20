import { getPostBySlug, getRecentPosts } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import PostClient from "./PostClient";

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
      canonical: `/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }) {
  const [post, recentPosts] = await Promise.all([
    getPostBySlug(params.slug),
    getRecentPosts(7),
  ]);

  if (!post) {
    notFound();
  }

  return <PostClient post={post} recentPosts={recentPosts} />;
}
