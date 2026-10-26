import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals and any file with an extension (images, sitemap.xml, robots.txt).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
