export function toServiceSlug(value = "") {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCanonicalServiceSlug(service = {}) {
  return (
    toServiceSlug(service.heading) ||
    toServiceSlug(service.subTitle) ||
    toServiceSlug(service.title) ||
    service.slug ||
    ""
  );
}

export function serviceMatchesSlug(service = {}, slug = "") {
  const requested = toServiceSlug(slug);
  const aliases = [
    service.slug,
    service.heading,
    service.subTitle,
    service.title,
  ].map(toServiceSlug);

  return aliases.includes(requested);
}
