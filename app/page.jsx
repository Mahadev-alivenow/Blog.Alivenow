import { Suspense } from "react";
import {
  getPosts,
  getTags,
  getTrendingPosts,
  getRecentPosts,
} from "@/lib/wordpress";
import BlogHomePage from "@/components/BlogHomePage";

// This makes the page an ISR page with revalidation
export const revalidate = 3600; // Revalidate every hour (3600 seconds)

// Generate static params for better performance
export async function generateStaticParams() {
  return []; // Return empty array for main page
}

// Server-side data fetching for ISR
async function getInitialData() {
  try {
    const [postsData, tagsData, trendingData, recentData] =
      await Promise.allSettled([
        getPosts({ page: 1, perPage: 10, search: "", tags: [] }),
        getTags(),
        getTrendingPosts(),
        getRecentPosts(),
      ]);

    return {
      initialPosts:
        postsData.status === "fulfilled"
          ? postsData.value
          : { posts: [], totalPages: 1 },
      initialTags: tagsData.status === "fulfilled" ? tagsData.value : [],
      initialTrending:
        trendingData.status === "fulfilled" ? trendingData.value : [],
      initialRecent: recentData.status === "fulfilled" ? recentData.value : [],
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      initialPosts: { posts: [], totalPages: 1 },
      initialTags: [],
      initialTrending: [],
      initialRecent: [],
    };
  }
}

// Loading component for Suspense
function PageLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#E92628] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-700 text-lg font-medium">Loading ...</p>
        </div>
      </div>
    </div>
  );
}

// Main server component
export default async function HomePage() {
  const { initialPosts, initialTags, initialTrending, initialRecent } =
    await getInitialData();

  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <BlogHomePage
        initialPosts={initialPosts.posts}
        initialTotalPages={initialPosts.totalPages}
        initialTags={initialTags}
        initialTrending={initialTrending}
        initialRecent={initialRecent}
      />
    </Suspense>
  );
}

// Metadata for SEO
export const metadata = {
  title: "AliveNow Blog - Latest Posts and Insights",
  description:
    "Discover the latest blog posts, trending content, and insights from AliveNow. Stay updated with our comprehensive blog coverage.",
  keywords: "blog, posts, insights, trending, recent posts",
  openGraph: {
    title: "AliveNow Blog - Latest Posts and Insights",
    description:
      "Discover the latest blog posts, trending content, and insights from AliveNow.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "AliveNow Blog - Latest Posts and Insights",
    description:
      "Discover the latest blog posts, trending content, and insights from AliveNow.",
  },
};
