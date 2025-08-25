import { Suspense } from "react";
import HomePageClient from "@/components/home-page-client";
import PageLoadingFallback from "@/components/page-loading-fallback";
import { JsonLd } from "@/components/json-ld";
import {
  getPosts,
  getTags,
  getTrendingPosts,
  getRecentPosts,
} from "@/lib/wordpress";

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: "AliveNow Blog - Latest Posts & Insights",
    description:
      "Discover the latest posts, trending topics, and insights from AliveNow Blog. Stay updated with our comprehensive content.",
    keywords: "blog, articles, insights, trending posts, latest news",
    openGraph: {
      title: "AliveNow Blog - Latest Posts & Insights",
      description:
        "Discover the latest posts, trending topics, and insights from AliveNow Blog.",
      type: "website",
      images: ["/BlogBanner.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: "AliveNow Blog - Latest Posts & Insights",
      description:
        "Discover the latest posts, trending topics, and insights from AliveNow Blog.",
      images: ["/BlogBanner.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Server Component - handles data fetching
export default async function HomePage({ searchParams }) {
  const page = Number.parseInt(searchParams?.page) || 1;
  const search = searchParams?.search || "";
  const tags = searchParams?.tags
    ? searchParams.tags.split(",").map((id) => Number.parseInt(id))
    : [];

  try {
    // Fetch all data in parallel on the server
    const [initialPosts, allTags, trendingPosts, recentPosts] =
      await Promise.all([
        getPosts({
          page,
          perPage: 10,
          search,
          tags,
        }),
        getTags(),
        getTrendingPosts(),
        getRecentPosts(),
      ]);

    const serverData = {
      initialPosts: initialPosts.posts || [],
      totalPages: initialPosts.totalPages || 1,
      allTags: allTags || [],
      trendingPosts: trendingPosts || [],
      recentPosts: recentPosts || [],
      initialPage: page,
      initialSearch: search,
      initialSelectedTags: tags,
    };

    return (
      <>
        <JsonLd type="blog" />
        <Suspense fallback={<PageLoadingFallback />}>
          <HomePageClient serverData={serverData} />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error("Error fetching server data:", error);

    // Fallback data
    const fallbackData = {
      initialPosts: [],
      totalPages: 1,
      allTags: [],
      trendingPosts: [],
      recentPosts: [],
      initialPage: 1,
      initialSearch: "",
      initialSelectedTags: [],
    };

    return (
      <>
        <JsonLd type="blog" />
        <Suspense fallback={<PageLoadingFallback />}>
          <HomePageClient serverData={fallbackData} />
        </Suspense>
      </>
    );
  }
}

// Enable ISR - revalidate every 300 seconds (5min)
export const revalidate = 300;
