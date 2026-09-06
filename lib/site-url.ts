export function getSiteUrl(): string {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL.trim()}` : "http://localhost:3000");

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  return url.replace(/\/+$/, "");
}

export function getMetadataBase(): URL {
  try {
    return new URL(getSiteUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}
