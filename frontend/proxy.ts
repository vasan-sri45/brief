import { NextResponse, type NextRequest } from "next/server";

const noIndexPaths = [/^\/login\/?$/, /^\/services\/[^/]+\/pricing\/?$/];

export function proxy(request: NextRequest) {
  const url = request.nextUrl;

  if (url.hostname === "www.briefcasse.com") {
    url.hostname = "briefcasse.com";
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next();

  if (noIndexPaths.some((pattern) => pattern.test(url.pathname))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
