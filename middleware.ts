import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of known aggressive content scrapers, spam scrapers, and harvester user agents
const BLOCKED_USER_AGENTS = [
  "bytespider",
  "blexbot",
  "dotbot",
  "mj12bot",
  "megaindex",
  "zoominfobot",
  "petalbot",
  "dataforseo",
  "scrapy",
  "httrack",
  "webcopier",
  "nikto",
  "offline explorer",
  "sitecopy",
];

export function middleware(request: NextRequest) {
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

  // Block known spam harvesters and scrapers
  const isBlockedAgent = BLOCKED_USER_AGENTS.some((agent) =>
    userAgent.includes(agent)
  );

  if (isBlockedAgent) {
    return new NextResponse("Access Denied: Scraper bot blocked by security policy.", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  const response = NextResponse.next();

  // Add security and bot protection headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Robots-Tag", "all");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /_static (inside /public)
     * 4. Static files (favicon.ico, icon.svg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};
