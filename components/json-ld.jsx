export function JsonLd({ type = "website", post = null, page = null }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://blog.alivenow.in";

  // Only show WebSite schema on homepage
  if (type === "website") {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "AliveNow",
      description:
        "Discover the latest insights, tutorials, and stories from our community of writers.",
      url: baseUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      publisher: {
        "@type": "Organization",
        name: "AliveNow",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/alivenow.svg`,
        },
      },
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    );
  }

  // Only show Blog schema on blog listing pages
  if (type === "blog") {
    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "AliveNow Blog",
      description: "Latest insights, tutorials, and stories from AliveNow",
      url: baseUrl,
      inLanguage: "en-US",
      publisher: {
        "@type": "Organization",
        name: "AliveNow",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/alivenow.svg`,
        },
      },
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    );
  }

  // Show WebPage schema for other pages
  if (type === "webpage" && page) {
    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title || "AliveNow",
      description:
        page.description ||
        "Discover the latest insights, tutorials, and stories from our community of writers.",
      url: `${baseUrl}${page.url || ""}`,
      image: page.image || `${baseUrl}/BlogBanner.png`,
      publisher: {
        "@type": "Organization",
        name: "AliveNow",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/alivenow.svg`,
        },
      },
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    );
  }

  return null;
}

// Generate structured data for individual blog posts
export function PostJsonLd({ post }) {
  if (!post) return null;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://blog.alivenow.in";

  const postSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt
      ? post.excerpt.replace(/<[^>]*>/g, "").substring(0, 160)
      : post.title,
    image: post.featuredImage?.url || post.image || `${baseUrl}/BlogBanner.png`,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      "@type": "Person",
      name: post.author?.name || "AliveNow Team",
      image: post.author?.avatar || `${baseUrl}/alivenow.svg`,
    },
    publisher: {
      "@type": "Organization",
      name: "AliveNow",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/alivenow.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${post.slug}`,
    },
    keywords: post.tags ? post.tags.map((tag) => tag.name).join(", ") : "",
    articleSection:
      post.tags && post.tags.length > 0 ? post.tags[0].name : "General",
    wordCount: post.content
      ? post.content.replace(/<[^>]*>/g, "").split(/\s+/).length
      : 0,
    commentCount: post.commentCount || 0,
    url: `${baseUrl}/${post.slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }}
    />
  );
}

export function AuthorJsonLd({ author }) {
  if (!author) return null;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://blog.alivenow.in";

  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.bio || `Author at AliveNow - ${author.name}`,
    image: author.avatar || `${baseUrl}/alivenow.svg`,
    url: `${baseUrl}/author/${author.slug}`,
    sameAs: author.socialLinks || [],
    worksFor: {
      "@type": "Organization",
      name: "AliveNow",
      url: baseUrl,
    },
    jobTitle: author.title || "Content Writer",
    knowsAbout: author.expertise || [
      "Technology",
      "Writing",
      "Digital Content",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
    />
  );
}

export function CategoryJsonLd({ category, posts = [] }) {
  if (!category) return null;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://blog.alivenow.in";

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} - AliveNow`,
    description: category.description || `Latest posts about ${category.name}`,
    url: `${baseUrl}/category/${category.slug}`,
    mainEntity: {
      "@type": "ItemList",
      name: `${category.name} Posts`,
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "BlogPosting",
          name: post.title,
          url: `${baseUrl}/${post.slug}`,
          author: {
            "@type": "Person",
            name: post.author?.name || "AliveNow Team",
          },
        },
      })),
    },
    publisher: {
      "@type": "Organization",
      name: "AliveNow",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/alivenow.svg`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
    />
  );
}
