export function getSiteUrl(): string {
  if (
    process.env.NODE_ENV === "production" ||
    !process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")
  ) {
    return "https://thearc-raiders.com";
  }

  let url = process.env.NEXT_PUBLIC_SITE_URL.trim();
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
