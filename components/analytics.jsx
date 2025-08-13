"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Google Analytics tracking
function gtag(...args) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

function AnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    if (!GA_MEASUREMENT_ID) return;

    // Load Google Analytics script
    const script1 = document.createElement("script");
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href,
      });
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  useEffect(() => {
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + searchParams.toString();

    gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
    });

    // Track custom events
    gtag("event", "page_view", {
      page_path: url,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}

// Track custom events
export function trackEvent(eventName, parameters = {}) {
  gtag("event", eventName, parameters);
}

// Track blog post views
export function trackPostView(postId, postTitle, category = "Blog") {
  gtag("event", "post_view", {
    content_type: "blog_post",
    content_id: postId,
    content_title: postTitle,
    content_category: category,
  });
}

// Track search queries
export function trackSearch(searchTerm, resultsCount = 0) {
  gtag("event", "search", {
    search_term: searchTerm,
    results_count: resultsCount,
  });
}

// Track tag clicks
export function trackTagClick(tagName, tagId) {
  gtag("event", "tag_click", {
    tag_name: tagName,
    tag_id: tagId,
  });
}
