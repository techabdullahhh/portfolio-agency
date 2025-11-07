import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/", destination: "/site/index.html" },
      { source: "/index.html", destination: "/site/index.html" },
      { source: "/about", destination: "/site/about.html" },
      { source: "/about.html", destination: "/site/about.html" },
      { source: "/services", destination: "/site/services.html" },
      { source: "/services.html", destination: "/site/services.html" },
      { source: "/contact", destination: "/site/contact.html" },
      { source: "/contact.html", destination: "/site/contact.html" },
      { source: "/blog", destination: "/site/blog.html" },
      { source: "/blog.html", destination: "/site/blog.html" },
      { source: "/case-studies", destination: "/site/case-studies.html" },
      { source: "/case-studies.html", destination: "/site/case-studies.html" },
      { source: "/testimonials", destination: "/site/testimonials.html" },
      { source: "/testimonials.html", destination: "/site/testimonials.html" },
      { source: "/resume", destination: "/site/resume.html" },
      { source: "/resume.html", destination: "/site/resume.html" },
      { source: "/projects/:slug", destination: "/site/projects/:slug.html" },
      { source: "/projects/:slug.html", destination: "/site/projects/:slug.html" },
    ];
  },
};

export default nextConfig;
