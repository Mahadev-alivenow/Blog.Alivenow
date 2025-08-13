export function JsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AliveNow",
    description:
      "Discover the latest insights, tutorials, and stories from our community of writers.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://alivenow.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://alivenow.com"
        }/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "AliveNow",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://alivenow.com",
      logo: {
        "@type": "ImageObject",
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://alivenow.com"
        }/logo.png`,
      },
    },
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "alivenow",
    description: "Latest insights, tutorials, and stories",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://alivenow.com",
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "alivenow",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
    </>
  )
}

// Generate structured data for individual blog posts
export function PostJsonLd({ post }) {
  const postSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt.replace(/<[^>]*>/g, "").substring(0, 160),
    image: post.featuredImage.url || `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`,
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      "@type": "Person",
      name: post.author.name || "Author - AliveNow",
      image: post.author.avatar,
    },
    publisher: {
      "@type": "Organization",
      name: "alivenow",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/post/${post.slug}`,
    },
    keywords: post.tags.map((tag) => tag.name).join(", "),
    articleSection: post.tags.length > 0 ? post.tags[0].name : "General",
    wordCount: post.content.replace(/<[^>]*>/g, "").split(/\s+/).length,
    commentCount: post.commentCount,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/post/${post.slug}`,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }} />
}
