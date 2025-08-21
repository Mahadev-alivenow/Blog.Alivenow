// WordPress REST API integration utilities
const WORDPRESS_API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "http://localhost/wordpress/wp-json/wp/v2";

// Core fetch helper for WordPress API
async function fetchFromWordPress(url) {
  if (!process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
    throw new Error(
      "NEXT_PUBLIC_WORDPRESS_API_URL is not set in environment variables"
    );
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(10000), // 10 sec timeout
  });

  if (!response.ok) {
    throw new Error(
      `WordPress API error: ${response.status} ${response.statusText}`
    );
  }

  return { data: await response.json(), response };
}

// Fetch posts with pagination and search
export async function getPosts({
  page = 1,
  perPage = 12,
  search = "",
  tags = [],
  orderBy = "date",
  order = "desc",
} = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    _embed: "true",
    orderby: orderBy,
    order: order,
  });

  if (search) params.append("search", search);
  if (tags.length > 0) params.append("tags", tags.join(","));

  const { data: posts, response } = await fetchFromWordPress(
    `${WORDPRESS_API_URL}/posts?${params}`
  );

  const totalPages = Number.parseInt(
    response.headers.get("X-WP-TotalPages") || "1"
  );
  const totalPosts = Number.parseInt(response.headers.get("X-WP-Total") || "0");

  return {
    posts: posts.map(formatPost),
    totalPages,
    totalPosts,
    currentPage: page,
  };
}

// Fetch single post by slug
export async function getPostBySlug(slug) {
  const { data: posts } = await fetchFromWordPress(
    `${WORDPRESS_API_URL}/posts?slug=${slug}&_embed=true`
  );
  return posts.length > 0 ? formatPost(posts[0]) : null;
}

export async function getTrendingPosts(limit = 6) {
  try {
    // Try to get posts ordered by view count (if a views plugin is installed)
    const { data: posts } = await fetchFromWordPress(
      `${WORDPRESS_API_URL}/posts?per_page=${limit}&meta_key=views&order=desc&_embed=true`
    );
    return posts.map(formatPost);
  } catch (error) {
    // Fallback to comment count ordering
    try {
      const { data: posts } = await fetchFromWordPress(
        `${WORDPRESS_API_URL}/posts?per_page=${limit}&order=desc&_embed=true`
      );
      return posts.map(formatPost);
    } catch (fallbackError) {
      // Final fallback to recent posts
      const { data: posts } = await fetchFromWordPress(
        `${WORDPRESS_API_URL}/posts?per_page=${limit}&orderby=date&order=desc&_embed=true`
      );
      return posts.map(formatPost);
    }
  }
}

// Fetch recent posts
export async function getRecentPosts(limit = 8) {
  const { data: posts } = await fetchFromWordPress(
    `${WORDPRESS_API_URL}/posts?per_page=${limit}&orderby=date&order=desc&_embed=true`
  );
  return posts.map(formatPost);
}

// Fetch all tags
export async function getTags() {
  const { data: tags } = await fetchFromWordPress(
    `${WORDPRESS_API_URL}/tags?per_page=100`
  );
  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    count: tag.count,
  }));
}

export async function getSearchSuggestions(query) {
  if (!query || query.length < 2) return [];

  const { data: posts } = await fetchFromWordPress(
    `${WORDPRESS_API_URL}/posts?search=${query}&per_page=5&_embed=true`
  );

  return posts.map(formatPost);
}

function formatPost(post) {
  let content = post.content?.rendered || post.content || "";

  // Process YouTube embeds - convert URLs to responsive embeds
  content = content.replace(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/g,
    '<div class="aspect-video my-6"><iframe class="w-full h-full rounded-lg" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></div>'
  );

  // Process other video embeds and make them responsive
  content = content.replace(
    /<iframe([^>]*?)>/g,
    '<div class="aspect-video my-6"><iframe class="w-full h-full rounded-lg"$1></div>'
  );

  return {
    id: post.id,
    title: post.title?.rendered || post.title,
    content: content,
    excerpt: post.excerpt?.rendered || post.excerpt,
    slug: post.slug,
    date: post.date,
    modified: post.modified,
    author: {
      name: post._embedded?.author?.[0]?.name || "Unknown Author",
      avatar:
        post._embedded?.author?.[0]?.avatar_urls?.["96"] ||
        "/author-avatar.png",
    },
    featuredImage: {
      url:
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "/blog-post-image.png",
      alt:
        post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ||
        post.title?.rendered ||
        post.title,
    },
    tags:
      post._embedded?.["wp:term"]?.[0]?.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      })) || [],
    link: post.link || "#",
  };
}
