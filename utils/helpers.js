// Utility functions for the blog

export function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").substring(0, 150) + "...";
}

export function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Calculate reading time based on word count
export function calculateReadTime(content) {
  if (!content) return 0;

  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Truncate text to specified length
export function truncateText(text, maxLength = 100) {
  if (!text) return "";

  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

// Generate excerpt from content
export function generateExcerpt(content, maxLength = 160) {
  if (!content) return "";

  const cleanText = content.replace(/<[^>]*>/g, "");
  return truncateText(cleanText, maxLength);
}

// Format author name
export function formatAuthorName(author) {
  if (!author) return "Unknown Author";
  return typeof author === "string" ? author : author.name || "Unknown Author";
}

// Check if URL is external
export function isExternalUrl(url) {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

// Generate slug from title
export function generateSlug(title) {
  if (!title) return "";

  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim("-");
}
