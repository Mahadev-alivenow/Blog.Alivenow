import { getPosts } from "@/lib/wordpress";

// 🚀 Force Next.js to generate this route dynamically (not at build time)
export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alivenow.com";

  let posts = [];
  try {
    // ✅ Try fetching posts
    const { posts: wpPosts } = await getPosts({ perPage: 100 });
    posts = wpPosts || [];
  } catch (err) {
    console.error(
      "⚠ Sitemap fetch failed, falling back to homepage only:",
      err
    );
  }

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...postUrls,
  ];
}
