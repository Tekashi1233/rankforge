// RankForge — canonical-URL redirects + static asset serving.
//
// Every non-canonical request is normalized to the canonical URL in ONE
// 301 hop: https, no www, no .html extension, no trailing slash (except
// the homepage, whose canonical URL is https://rankforgetool.com/).
// Canonical form: https://rankforgetool.com/page-name
//
// The old behaviour was: .html and trailing-slash URLs got a 307
// (temporary) redirect from the asset layer, and http:// served the site
// with a 200 (no redirect at all). Both are fixed here.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    let path = url.pathname;
    // Strip a trailing slash first (except the homepage "/"), then strip
    // a .html extension, so "/blog/foo.html/" normalizes in one hop.
    // "/index.html" is the homepage, so it becomes "/".
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    if (path.endsWith(".html")) path = path.slice(0, -5);
    if (path === "/index" || path.endsWith("/index")) {
      path = path.slice(0, -6) || "/";
    }

    const needsRedirect =
      url.protocol === "http:" ||
      url.hostname === "www.rankforgetool.com" ||
      path !== url.pathname;

    if (needsRedirect) {
      url.protocol = "https:";
      if (url.hostname === "www.rankforgetool.com") {
        url.hostname = "rankforgetool.com";
      }
      url.pathname = path;
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);

    // Feeds are for readers and crawlers, not search results. Marking them
    // noindex stops Search Console reporting them as "crawled - not indexed".
    if (path === "/rss.xml" || path === "/sitemap.xml") {
      const headers = new Headers(response.headers);
      headers.set("X-Robots-Tag", "noindex");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
};
