import { Suspense } from "react";
import {
  getPosts,
  getTags,
  getTrendingPosts,
  getRecentPosts,
} from "@/lib/wordpress";
import HomePageClient from "@/components/home-page-client";
import { Loader2 } from "lucide-react";

export const revalidate = 60;

export const dynamic = "force-static";

function PageLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-[#E92628] mx-auto" />
          <p className="mt-4 text-gray-700 text-lg font-medium">Loading ...</p>
        </div>
      </div>
    </div>
  );
}

async function getInitialData() {
  try {
    const [postsData, tagsData, trendingData, recentData] =
      await Promise.allSettled([
        getPosts({ page: 1, perPage: 10 }),
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
      initialTrendingPosts:
        trendingData.status === "fulfilled" ? trendingData.value : [],
      initialRecentPosts:
        recentData.status === "fulfilled" ? recentData.value : [],
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      initialPosts: { posts: [], totalPages: 1 },
      initialTags: [],
      initialTrendingPosts: [],
      initialRecentPosts: [],
    };
  }
}

export default async function HomePage() {
  const initialData = await getInitialData();

  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <HomePageClient {...initialData} />
    </Suspense>
  );
}
