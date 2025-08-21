import { Suspense } from "react";
import BlogHeader from "@/components/blog-header";
import Footer from "@/components/footer";
import HomePageClient from "@/components/home-page-client";
import {
  getPosts,
  getTags,
  getTrendingPosts,
  getRecentPosts,
} from "@/lib/wordpress";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/utils/helpers";

export const revalidate = 60;

async function getInitialData() {
  try {
    const [postsData, tagsData, trendingData, recentData] = await Promise.all([
      getPosts({
        page: 1,
        perPage: 10,
        search: "",
        tags: [],
      }),
      getTags(),
      getTrendingPosts(),
      getRecentPosts(),
    ]);

    return {
      initialPosts: postsData.posts,
      totalPages: postsData.totalPages,
      tags: tagsData,
      trendingPosts: trendingData,
      recentPosts: recentData,
    };
  } catch (error) {
    console.error("Error loading initial data:", error);
    return {
      initialPosts: [],
      totalPages: 1,
      tags: [],
      trendingPosts: [],
      recentPosts: [],
    };
  }
}

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

export default async function HomePage() {
  const initialData = await getInitialData();

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader tags={initialData.tags} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <section className="mb-12">
              <Image
                src="/BlogBanner.png"
                alt="Alivenow Blog Banner Image"
                className="w-full object-cover rounded-lg mb-6"
                width={100}
                height={100}
                priority
              />
            </section>

            <Suspense fallback={<PageLoadingFallback />}>
              <HomePageClient initialData={initialData} />
            </Suspense>
          </div>

          <div className="lg:col-span-1">
            <section className="mb-8 sticky top-20">
              <div className="flex items-center mb-6 p-3 bg-gradient-to-r from-gray-50 to-red-50 rounded-lg">
                <div className="h-6 w-6 mr-3 text-[#E92628]">🕒</div>
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Posts
                </h3>
              </div>

              <div className="space-y-4">
                {initialData.recentPosts.map((post, index) => (
                  <RecentPostCard key={post.id} post={post} index={index} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer
        trendingPosts={initialData.trendingPosts}
        recentPosts={initialData.recentPosts}
        tags={initialData.tags}
      />
    </div>
  );
}

function RecentPostCard({ post, index }) {
  return (
    <a href={`/${post.slug}`}>
      <div className="p-0 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden my-4 hover:border-l-[#E92628] hover:border-b-[#E92628] hover:-translate-y-1 bg-white border ">
        <div className="flex">
          <div className="w-20 h-20 flex-shrink-0 overflow-hidden relative">
            <img
              src={post.featuredImage.url || "/placeholder.svg"}
              alt={post.featuredImage.alt || post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-4 flex-1">
            <h4
              className="font-semibold line-clamp-2 mb-2 group-hover:text-[#E92628] transition-colors duration-200 text-sm leading-tight"
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
            <div className="text-xs text-gray-500">
              {formatDate(post.date)}
              {/* {new Date(post.date).toLocaleDateString()} */}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
