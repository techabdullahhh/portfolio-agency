const DEFAULT_API_BASE =
  window.__CMS_API_BASE__ ||
  document.documentElement.getAttribute("data-cms-api-base") ||
  (window.location.port ? window.location.origin : "http://localhost:3000");

const API_BASE = DEFAULT_API_BASE.replace(/\/$/, "");
const dataCache = new Map();

const slugify = (value) =>
  (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "general";

const fetchJSON = async (key, endpoint) => {
  if (dataCache.has(key)) return dataCache.get(key);
  const url = `${API_BASE}${endpoint}`;
  const promise = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.warn(`[CMS] Failed to load ${endpoint}:`, error);
      return null;
    });
  dataCache.set(key, promise);
  return promise;
};

const createEl = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (typeof text === "string") el.textContent = text;
  return el;
};

const renderIcon = (iconValue, className) => {
  const wrapper = createEl("div", className);
  if (!iconValue) {
    wrapper.textContent = "✨";
    return wrapper;
  }

  if (/^https?:\/\//i.test(iconValue)) {
    const img = document.createElement("img");
    img.src = iconValue;
    img.alt = "";
    img.loading = "lazy";
    wrapper.appendChild(img);
    return wrapper;
  }

  wrapper.textContent = iconValue.trim().slice(0, 4);
  return wrapper;
};

const getArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.length) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const enrichMessageWithSubject = (subject, message) => {
  if (!subject) return message;
  return `Subject: ${subject}\n\n${message}`;
};

const populateServices = async () => {
  const categoriesContainer = document.querySelector(".services-categories");
  const servicesFullGrid = document.querySelector(".services-grid-full");

  if (!categoriesContainer && !servicesFullGrid) return;

  const services = (await fetchJSON("services", "/api/public/services")) || [];
  if (!services.length) return;

  const grouped = services.reduce((map, service) => {
    const category = (service.category || "General").trim();
    if (!map.has(category)) map.set(category, []);
    map.get(category).push(service);
    return map;
  }, new Map());

  if (categoriesContainer) {
    categoriesContainer.innerHTML = "";
    let categoryCount = 0;
    grouped.forEach((items, category) => {
      if (categoryCount >= 3) return;
      categoryCount += 1;

      const categoryEl = createEl("div", "service-category");
      const header = createEl("div", "category-header");
      header.appendChild(renderIcon(items[0]?.icon, "category-icon"));
      header.appendChild(createEl("h3", "category-title", category));
      categoryEl.appendChild(header);

      const grid = createEl("div", "services-grid");
      items.slice(0, 6).forEach((service) => {
        const card = createEl("div", "service-card");
        card.appendChild(renderIcon(service.icon, "service-icon"));
        card.appendChild(createEl("h4", null, service.title));
        card.appendChild(createEl("p", null, service.description || ""));

        const tags = getArray(service.tags || service.techStack);
        if (tags.length) {
          const tagRow = createEl("div", "service-tags");
          tags.slice(0, 4).forEach((tag) => {
            tagRow.appendChild(createEl("span", "service-tag", tag));
          });
          card.appendChild(tagRow);
        }
        grid.appendChild(card);
      });

      categoryEl.appendChild(grid);
      categoriesContainer.appendChild(categoryEl);
    });
  }

  if (servicesFullGrid) {
    servicesFullGrid.innerHTML = "";
    services.forEach((service, index) => {
      const card = createEl("div", "service-card-full fade-in");
      if (index % 3 !== 0) card.dataset.delay = String((index % 3) * 100);

      card.appendChild(renderIcon(service.icon, "service-icon-large"));
      card.appendChild(createEl("h3", null, service.title));
      card.appendChild(createEl("p", null, service.description || ""));

      const featureList = createEl("ul", "service-features");
      const features = getArray(service.tags || service.techStack);
      features.slice(0, 6).forEach((item) => {
        featureList.appendChild(createEl("li", null, item));
      });
      if (!features.length && service.category) {
        featureList.appendChild(createEl("li", null, service.category));
      }
      card.appendChild(featureList);

      const cta = createEl("a", "btn btn-primary", "Get Started");
      cta.href = "contact.html";
      card.appendChild(cta);

      servicesFullGrid.appendChild(card);
    });
  }
};

const buildProjectCard = (project, variant = "grid") => {
  const isFull = variant === "full";
  const card = createEl(
    isFull ? "div" : "article",
    isFull ? "project-card-filter fade-in" : "portfolio-card"
  );

  const categorySlug = slugify(project.category);
  card.dataset.category = categorySlug;
  if (isFull) {
    card.dataset.categories = `${categorySlug} ${slugify(project.status)}`;
  }

  const description =
    project.shortDescription ||
    project.excerpt ||
    (project.content ? `${project.content.slice(0, 160)}…` : "");
  const tags = getArray(project.techStack || project.tags || []).slice(0, 6);
  const primaryLink = project.liveUrl || project.githubUrl || "#";

  if (isFull) {
    const imageWrapper = createEl("div", "project-image");
    const overlay = createEl("div", "project-overlay");
    const detailLink = createEl("a", "btn btn-primary btn-sm", "View Details");
    detailLink.href = primaryLink;
    detailLink.target = "_blank";
    detailLink.rel = "noopener noreferrer";
    overlay.appendChild(detailLink);

    if (project.githubUrl) {
      const sourceLink = createEl("a", "btn btn-outline btn-sm", "Source");
      sourceLink.href = project.githubUrl;
      sourceLink.target = "_blank";
      sourceLink.rel = "noopener noreferrer";
      overlay.appendChild(sourceLink);
    }

    imageWrapper.appendChild(overlay);
    imageWrapper.appendChild(
      createEl("div", "project-placeholder", project.title.slice(0, 18))
    );
    card.appendChild(imageWrapper);

    const content = createEl("div", "project-content");
    content.appendChild(
      createEl("span", "project-category", project.category || "Project")
    );
    content.appendChild(createEl("h3", null, project.title));
    content.appendChild(createEl("p", null, description));

    const tagRow = createEl("div", "project-tags");
    tags.forEach((tag) => tagRow.appendChild(createEl("span", "tag", tag)));
    content.appendChild(tagRow);

    const links = createEl("div", "project-links");
    const projectLink = createEl("a", "project-link", "View Project →");
    projectLink.href = primaryLink;
    projectLink.target = "_blank";
    projectLink.rel = "noopener noreferrer";
    links.appendChild(projectLink);
    content.appendChild(links);

    card.appendChild(content);
  } else {
    const headline = createEl("div", "portfolio-card-headline");
    headline.appendChild(createEl("h3", null, project.title));
    headline.appendChild(
      createEl("span", null, project.category || project.status || "")
    );
    card.appendChild(headline);

    card.appendChild(
      createEl("p", "portfolio-card-description", description)
    );

    const tagRow = createEl("div", "portfolio-card-tags");
    tags.forEach((tag) => tagRow.appendChild(createEl("span", null, tag)));
    card.appendChild(tagRow);

    const linkEl = createEl("a", "portfolio-card-link", "Explore Case Study");
    linkEl.href = primaryLink;
    linkEl.target = "_blank";
    linkEl.rel = "noopener noreferrer";
    card.appendChild(linkEl);
  }

  return card;
};

const populateProjects = async () => {
  const indexGrid = document.querySelector(".portfolio-grid");
  const projectsGridFull = document.querySelector(".projects-grid-full");
  const filterContainer = document.querySelector(".filter-buttons");

  if (!indexGrid && !projectsGridFull) return;

  const projects = (await fetchJSON("projects", "/api/public/projects")) || [];
  if (!projects.length) return;

  const activeProjects = projects.filter(
    (project) => project.status !== "ARCHIVED"
  );

  if (indexGrid) {
    indexGrid.innerHTML = "";
    activeProjects.slice(0, 6).forEach((project) => {
      indexGrid.appendChild(buildProjectCard(project, "grid"));
    });
  }

  if (projectsGridFull) {
    projectsGridFull.innerHTML = "";
    activeProjects.forEach((project, index) => {
      const card = buildProjectCard(project, "full");
      card.dataset.delay = String((index % 3) * 100);
      projectsGridFull.appendChild(card);
    });
  }

  if (filterContainer && projectsGridFull) {
    filterContainer.innerHTML = "";
    const createFilterButton = (label, value, isActive = false) => {
      const button = createEl("button", "filter-btn", label);
      button.dataset.filter = value;
      if (isActive) button.classList.add("active");
      filterContainer.appendChild(button);
    };

    createFilterButton("All Projects", "all", true);
    const categories = Array.from(
      new Set(
        activeProjects
          .map((project) => project.category)
          .filter((category) => typeof category === "string" && category.trim())
      )
    );
    categories.forEach((category) => {
      createFilterButton(category, slugify(category));
    });

    filterContainer.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;
      const filter = target.dataset.filter || "all";
      filterContainer
        .querySelectorAll(".filter-btn")
        .forEach((button) => button.classList.toggle("active", button === target));

      projectsGridFull
        .querySelectorAll(".project-card-filter")
        .forEach((card) => {
          if (filter === "all") {
            card.style.display = "";
            return;
          }

          const categories = (card.dataset.categories || card.dataset.category || "")
            .split(/\s+/)
            .filter(Boolean);
          card.style.display = categories.includes(filter) ? "" : "none";
        });
    });
  }

  const projectStat = document.querySelector('[data-stat="projects"]');
  if (projectStat) {
    const count = activeProjects.length;
    projectStat.dataset.target = String(count);
    projectStat.textContent = "0";
  }
};

const buildTestimonialCard = (testimonial, variant = "grid") => {
  const card =
    variant === "large"
      ? createEl("div", "testimonial-card-large fade-in")
      : createEl("div", "testimonial-card");

  card.appendChild(createEl("div", variant === "large" ? "quote-icon-large" : "testimonial-quote", '"'));
  card.appendChild(
    createEl(
      "p",
      variant === "large" ? "testimonial-text" : "testimonial-text",
      testimonial.quote || testimonial.text || ""
    )
  );

  const author = createEl("div", variant === "large" ? "testimonial-author" : "testimonial-author");
  const avatar = createEl(variant === "large" ? "div" : "div", variant === "large" ? "author-avatar-large" : "testimonial-avatar");
  if (testimonial.avatarUrl) {
    const img = document.createElement("img");
    img.src = testimonial.avatarUrl;
    img.alt = testimonial.client || "";
    img.loading = "lazy";
    avatar.appendChild(img);
  } else {
    avatar.textContent = (testimonial.client || "?")
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  author.appendChild(avatar);

  const info = createEl("div", variant === "large" ? "author-info" : "testimonial-info");
  info.appendChild(createEl("h4", variant === "large" ? null : "testimonial-name", testimonial.client || "Client"));
  const roleParts = [testimonial.role, testimonial.company].filter(Boolean);
  if (roleParts.length) {
    info.appendChild(
      createEl(
        variant === "large" ? "span" : "p",
        variant === "large" ? null : "testimonial-role",
        roleParts.join(", ")
      )
    );
  }
  if (testimonial.rating) {
    const rating = createEl("div", variant === "large" ? "rating" : "testimonial-rating");
    rating.textContent = "★".repeat(Math.max(1, Math.round(testimonial.rating)));
    info.appendChild(rating);
  }
  author.appendChild(info);
  card.appendChild(author);

  return card;
};

const populateTestimonials = async () => {
  const grids = document.querySelectorAll(".testimonials-grid");
  if (!grids.length) return;

  const testimonials =
    (await fetchJSON("testimonials", "/api/public/testimonials")) || [];
  if (!testimonials.length) return;

  grids.forEach((grid) => {
    const isLarge = grid.classList.contains("testimonials-page")
      ? false
      : grid.closest(".testimonials-page");
    const variant =
      grid.closest(".testimonials-page") || grid.classList.contains("testimonials-page")
        ? "large"
        : "grid";

    grid.innerHTML = "";
    testimonials.forEach((testimonial, index) => {
      const card = buildTestimonialCard(testimonial, variant);
      if (variant === "large") {
        card.dataset.delay = String((index % 3) * 100);
      }
      grid.appendChild(card);
    });
  });

  const clientsStat = document.querySelector('[data-stat="clients"]');
  if (clientsStat) {
    const count = testimonials.length;
    clientsStat.dataset.target = String(Math.max(5, count));
    clientsStat.textContent = "0";
  }
};

const populateTeam = async () => {
  const grids = document.querySelectorAll(".team-grid");
  if (!grids.length) return;

  const team = (await fetchJSON("team", "/api/public/team")) || [];
  if (!team.length) return;

  grids.forEach((grid) => {
    grid.innerHTML = "";
    team.forEach((member) => {
      const card = createEl("div", "team-member");
      const imageWrapper = createEl("div", "team-image");
      const placeholder = createEl("div", "team-image-placeholder");
      if (member.avatarUrl) {
        const img = document.createElement("img");
        img.src = member.avatarUrl;
        img.alt = member.name || "";
        img.loading = "lazy";
        imageWrapper.appendChild(img);
      } else {
        placeholder.textContent = (member.name || "?")
          .split(/\s+/)
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        imageWrapper.appendChild(placeholder);
      }
      card.appendChild(imageWrapper);
      card.appendChild(createEl("h3", "team-name", member.name || "Team Member"));
      if (member.role) {
        card.appendChild(createEl("p", "team-role", member.role));
      }
      const skills = getArray(member.skills);
      if (skills.length) {
        const skillList = createEl("div", "team-skills");
        skills.slice(0, 4).forEach((skill) => {
          skillList.appendChild(createEl("span", "team-skill", skill));
        });
        card.appendChild(skillList);
      }
      grid.appendChild(card);
    });
  });
};

const populateBlog = async () => {
  const blogGrid = document.querySelector(".blog-grid");
  if (!blogGrid) return;

  const posts = (await fetchJSON("posts", "/api/public/blog")) || [];
  if (!posts.length) return;

  blogGrid.innerHTML = "";
  posts.forEach((post, index) => {
    const card = createEl("article", "blog-card fade-in");
    if (index > 0) card.dataset.delay = String((index % 3) * 100);

    const imageWrapper = createEl("div", "blog-image");
    imageWrapper.appendChild(
      createEl("div", "blog-placeholder", post.title.slice(0, 18))
    );
    if (post.tags && post.tags.length) {
      imageWrapper.appendChild(createEl("span", "blog-category", post.tags[0]));
    }
    card.appendChild(imageWrapper);

    const content = createEl("div", "blog-content");
    const meta = createEl("div", "blog-meta");

    const published = post.publishedAt ? new Date(post.publishedAt) : null;
    if (published && !Number.isNaN(published.valueOf())) {
      meta.appendChild(
        createEl(
          "span",
          "blog-date",
          new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(published)
        )
      );
    }
    if (post.status) {
      meta.appendChild(
        createEl("span", "blog-read-time", post.status === "PUBLISHED" ? "Published" : post.status)
      );
    }
    content.appendChild(meta);

    const titleHeading = createEl("h2", "blog-title");
    const titleLink = createEl("a", null, post.title);
    titleLink.href = "#";
    titleHeading.appendChild(titleLink);
    content.appendChild(titleHeading);

    const excerpt =
      post.excerpt || (post.content ? `${post.content.slice(0, 180)}…` : "");
    content.appendChild(createEl("p", "blog-excerpt", excerpt));

    const footer = createEl("div", "blog-footer");
    const readMore = createEl("a", "blog-link", "Read More →");
    readMore.href = "#";
    footer.appendChild(readMore);

    const tags = createEl("div", "blog-tags");
    getArray(post.tags)
      .slice(0, 4)
      .forEach((tag) => tags.appendChild(createEl("span", "tag", tag)));
    footer.appendChild(tags);

    content.appendChild(footer);
    card.appendChild(content);
    blogGrid.appendChild(card);
  });
};

const applySiteSettings = async () => {
  const settings = await fetchJSON("settings", "/api/public/settings");
  if (!settings) return;

  if (settings.siteTitle) {
    document.querySelectorAll(".brand-logo, .nav-brand a, .footer-section h3").forEach((el, index) => {
      if (index === 0 || el.classList.contains("brand-logo") || el.closest(".nav-brand") || index === 0) {
        el.textContent = settings.siteTitle;
      }
    });
  }

  if (settings.footerText) {
    const footerParagraph = document.querySelector(".footer-section p");
    if (footerParagraph) {
      footerParagraph.textContent = settings.footerText;
    }
  }

  if (settings.contactEmail) {
    document.querySelectorAll('a[href^="mailto:"]').forEach((anchor) => {
      anchor.href = `mailto:${settings.contactEmail}`;
      if (anchor.textContent.includes("@")) {
        anchor.textContent = settings.contactEmail;
      }
    });
  }

  if (settings.socialLinks && typeof settings.socialLinks === "object") {
    document.querySelectorAll(".social-link").forEach((link) => {
      const network = (link.getAttribute("aria-label") || "")
        .toLowerCase()
        .trim();
      if (!network) return;
      const url = settings.socialLinks[network];
      if (typeof url === "string" && url) {
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    });
  }
};

const handleContactForms = () => {
  const forms = document.querySelectorAll("#contactForm");
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = (formData.get("name") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const subject = (formData.get("subject") || "").toString().trim();
      const message = (formData.get("message") || "").toString().trim();

      if (!name || !email || !message) {
        alert("Please fill in your name, email, and message.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            message: enrichMessageWithSubject(subject, message),
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }

        form.reset();
        alert("Thank you! Your message has been sent.");
      } catch (error) {
        console.error("[CMS] Contact form submission failed:", error);
        alert("Sorry, there was an issue sending your message. Please try again later.");
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  populateServices();
  populateProjects();
  populateTestimonials();
  populateTeam();
  populateBlog();
  applySiteSettings();
  handleContactForms();
});


