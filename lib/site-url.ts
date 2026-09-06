export function getSiteUrl(): string {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://thearc-raiders.com";

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  return url.replace(/\/+$/, "");
}

export function getMetadataBase(): URL {
  try {
    return new URL(getSiteUrl());
  } catch {
    return new URL("https://thearc-raiders.com");
  }
}
