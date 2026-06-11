export function normalizeBlogContent(content) {
  if (Array.isArray(content)) return content;

  if (typeof content !== "string") return [];

  try {
    const parsed = JSON.parse(content);

    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object") return [parsed];

    return [{ heading: "", body: String(parsed || "") }];
  } catch {
    return [{ heading: "", body: content }];
  }
}

export function stripBlogMarkup(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/[*_`#>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getBlogExcerpt(blog, maxLength = 170) {
  const contentBlocks = normalizeBlogContent(blog?.content);
  const contentText = contentBlocks
    .map((block) => block?.body || block?.details || block?.content || "")
    .join(" ");

  const text = stripBlogMarkup(
    blog?.metaDescription || blog?.subtitle || contentText
  );

  if (!text) {
    return "Read this Briefcasse article for legal, compliance and business guidance.";
  }

  return text.length > maxLength ? text.slice(0, maxLength).trim() : text;
}

export function getBlogCover(blog) {
  return blog?.documents?.[0]?.url || blog?.image || "/assets/brief_banner1.png";
}
