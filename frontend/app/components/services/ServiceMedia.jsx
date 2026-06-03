"use client";

export const getYouTubeVideoId = (url = "") => {
  const value = String(url || "").trim();
  if (!value) return "";

  const patterns = [
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/,
  ];

  const match = patterns.map((pattern) => value.match(pattern)).find(Boolean);
  return match?.[1] || "";
};

export const getYouTubeThumbnail = (url = "") => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
};

const toYouTubeEmbed = (url = "") => {
  const value = String(url || "").trim();
  const videoId = getYouTubeVideoId(value);

  return videoId ? `https://www.youtube.com/embed/${videoId}` : value;
};

export const getServiceMediaUrl = (service = {}) =>
  service.mediaFile ||
  service.mediaUrl ||
  service.featuredImage ||
  service.serviceBannerImage ||
  service.images?.[0]?.url ||
  "";

export const getServiceCardImageUrl = (service = {}) =>
  service.cardImageFile ||
  service.cardImageUrl ||
  service.featuredImage ||
  getYouTubeThumbnail(service.mediaUrl || service.mediaFile) ||
  service.serviceBannerImage ||
  service.images?.[0]?.url ||
  "";

export default function ServiceMedia({
  service,
  className = "",
  imgClassName = "h-full w-full object-cover",
  fallback = null,
  youtubeMode = "embed",
}) {
  const mediaUrl = getServiceMediaUrl(service);
  const isYouTubeUrl = Boolean(getYouTubeVideoId(mediaUrl));
  const mediaType = isYouTubeUrl ? "youtube" : service?.mediaType || "image";

  if (!mediaUrl) return fallback;

  if (mediaType === "video") {
    return (
      <video
        src={mediaUrl}
        controls
        className={className || imgClassName}
      />
    );
  }

  if (mediaType === "youtube") {
    if (youtubeMode === "thumbnail") {
      const thumbnailUrl = getYouTubeThumbnail(mediaUrl);

      if (!thumbnailUrl) return fallback;

      return (
        <img
          src={thumbnailUrl || mediaUrl}
          alt={service?.heading || service?.title || "Briefcasse service video"}
          className={className || imgClassName}
        />
      );
    }

    return (
      <iframe
        src={toYouTubeEmbed(mediaUrl)}
        title={service?.heading || service?.title || "Briefcasse service video"}
        className={className || imgClassName}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <img
      src={mediaUrl}
      alt={service?.heading || service?.title || "Briefcasse service"}
      className={className || imgClassName}
    />
  );
}
