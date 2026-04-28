(() => {
  const titleEl = document.querySelector("#postTitle");
  const metaEl = document.querySelector("#postMeta");
  const contentEl = document.querySelector("#postContent");
  const loadingEl = document.querySelector("#postLoading");
  const errorEl = document.querySelector("#postError");
  const crumbTitleEl = document.querySelector("#crumbTitle");

  const slug = new URLSearchParams(window.location.search).get("slug");
  if (!slug) {
    window.location.href = "./blog.html";
    return;
  }

  const esc = (s) =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const render = (post) => {
    titleEl.textContent = post.title;
    crumbTitleEl.textContent = post.title;
    metaEl.textContent = `${post.category} • ${post.readTime} • ${formatDate(post.date)}`;
    document.title = `${post.title} | Early YouTubers Blog`;

    const paragraphs = (post.content || []).map((p) => `<p>${esc(p)}</p>`).join("");
    const steps = (post.actionSteps || []).map((s) => `<li>${esc(s)}</li>`).join("");
    const tags = (post.tags || []).map((t) => `<span class="pill">${esc(t)}</span>`).join("");
    const ctaLabel = esc(post.ctaLabel || "Join Now");
    const ctaLink = esc(post.ctaLink || "./community.html#join");
    const youtubeEmbed = esc(post.youtubeEmbed || "https://www.youtube.com/embed/aqz-KE-bpKQ");
    const imageUrl = esc(
      post.imageUrl ||
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80"
    );
    const imageAlt = esc(post.imageAlt || `${post.title} featured image`);

    contentEl.innerHTML = `
      <div class="row g-4 align-items-start">
        <div class="col-lg-7">
          <div class="post-meta mb-2">${esc(post.category)} • ${esc(post.readTime)} • ${esc(formatDate(post.date))}</div>
          <h2 class="h3 fw-bold mb-3">${esc(post.title)}</h2>
          <p class="text-muted mb-4">${esc(post.excerpt)}</p>

          ${paragraphs}
          <hr />
          <h3 class="h5 fw-bold mb-3">Action Steps</h3>
          <ul>${steps}</ul>
          <div class="d-flex flex-wrap gap-2 my-3">${tags}</div>
          <div class="d-flex flex-wrap gap-2">
            <a class="btn btn-gradient" href="${ctaLink}">${ctaLabel}</a>
          </div>
        </div>

        <aside class="col-lg-5">
          <div class="d-flex flex-column gap-3">
            <section>
              <h3 class="h6 fw-bold mb-2">Featured image</h3>
              <img class="img-fluid rounded-4 border w-100" src="${imageUrl}" alt="${imageAlt}" loading="lazy" />
            </section>

            <section>
              <h3 class="h6 fw-bold mb-2">Watch related video</h3>
              <div class="ratio ratio-16x9 rounded-4 overflow-hidden border">
                <iframe
                  src="${youtubeEmbed}"
                  title="YouTube video player"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>
            </section>

            <section>
              <h3 class="h6 fw-bold mb-2">Join our creator community</h3>
              <p class="text-muted small mb-2">Connect with early YouTubers, get support, and collaborate faster.</p>
              <div class="d-grid gap-2">
                <a class="btn btn-soft" href="https://www.linkedin.com/groups/18982020/" target="_blank" rel="noopener noreferrer">
                  <i class="bi bi-linkedin me-1"></i> Join LinkedIn Group
                </a>
                <a class="btn btn-soft" href="https://t.me/earlyyotubers" target="_blank" rel="noopener noreferrer">
                  <i class="bi bi-telegram me-1"></i> Join Telegram Group
                </a>
              </div>
            </section>
          </div>
        </aside>
      </div>
    `;
    loadingEl.classList.add("d-none");
    contentEl.classList.remove("d-none");
  };

  const showError = (msg) => {
    loadingEl.classList.add("d-none");
    errorEl.classList.remove("d-none");
    errorEl.textContent = msg;
    titleEl.textContent = "Post not found";
    metaEl.textContent = "Please go back to the blog listing.";
  };

  // Fallback data so blog post pages also work on file:// URLs
  const fallbackPosts = [
    {
      slug: "first-30-videos-plan",
      title: "First 30 videos plan: publish without burnout",
      category: "YouTube Growth",
      readTime: "6 min read",
      date: "2026-04-01",
      excerpt: "Use a practical 3-day cycle and weekly batching system to publish consistently without burning out.",
      tags: ["Beginner", "Workflow", "Consistency"],
      ctaLabel: "Get weekly planning help",
      ctaLink: "./community.html#join",
      content: [
        "If you are just starting, don't plan monthly content in one go. Plan one week at a time and repeat a simple cycle.",
        "Use this 3-day publishing cycle: Day 1 research + outline, Day 2 filming, Day 3 editing + upload. Keep this repeatable.",
        "Every Sunday, batch two scripts. This reduces decision fatigue and helps you stay on track when life gets busy."
      ],
      actionSteps: [
        "Choose one content pillar for this week.",
        "Create 3 video ideas under that pillar.",
        "Write hooks for all 3 before filming.",
        "Film in one session, edit in focused blocks."
      ]
    },
    {
      slug: "travel-vlog-hook-formula",
      title: "Travel vlog hook formula that improves retention",
      category: "Travel Content",
      readTime: "5 min read",
      date: "2026-04-04",
      excerpt: "Open with result, add conflict, then context. Keep intros short so viewers stay longer.",
      tags: ["Travel", "Retention", "Storytelling"],
      ctaLabel: "Share your intro for feedback",
      ctaLink: "./community.html#join",
      content: [
        "Most travel vlogs lose viewers in the first 20 seconds because the intro takes too long.",
        "Use this sequence: final outcome in first 7 seconds, one problem to solve, then where and why this video matters.",
        "Cut all filler intros. Your audience should know exactly what they will gain in under 25 seconds."
      ],
      actionSteps: [
        "Write a 1-line outcome promise.",
        "Add one tension line (challenge/conflict).",
        "Limit intro to 3 short clips max.",
        "Test retention after publishing and adjust next video."
      ]
    },
    {
      slug: "weekly-analytics-check",
      title: "Analytics check every beginner should do weekly",
      category: "Analytics",
      readTime: "4 min read",
      date: "2026-04-08",
      excerpt: "Track only CTR, average view duration, and returning viewers to improve faster with less confusion.",
      tags: ["Analytics", "CTR", "AVD"],
      ctaLabel: "Request analytics checklist",
      ctaLink: "./contact.html",
      content: [
        "Many new creators check too many metrics and end up overwhelmed.",
        "Focus on three numbers: CTR, average view duration, and returning viewers. These tell you if packaging and content are improving.",
        "Pick one weak metric each week and optimize only that. Small focused improvements compound faster."
      ],
      actionSteps: [
        "Set a fixed weekly analytics review day.",
        "Write one improvement action from your data.",
        "Apply that action in your next upload.",
        "Compare performance after 7 days."
      ]
    },
    {
      slug: "youtube-seo-2026-basics",
      title: "YouTube SEO starter stack that still works in 2026",
      category: "SEO Basics",
      readTime: "7 min read",
      date: "2026-04-12",
      excerpt: "Use search-intent titles, clear thumbnail promise, and focused first lines in descriptions.",
      tags: ["SEO", "Titles", "Thumbnails"],
      ctaLabel: "Get title + thumbnail review",
      ctaLink: "./community.html#join",
      content: [
        "SEO starts before upload. If your topic has no demand, optimization won't save it.",
        "Write titles matching what viewers search. Your thumbnail should add curiosity, not repeat title words.",
        "Use your primary keyword naturally in the first 120 characters of description and include context-rich supporting keywords."
      ],
      actionSteps: [
        "Research 5 competing videos for your topic.",
        "Draft 3 title options before finalizing.",
        "Design thumbnail for one clear promise.",
        "Review CTR after 48 hours."
      ]
    },
    {
      slug: "collab-outreach-that-gets-replies",
      title: "Collab outreach message that gets replies",
      category: "Networking",
      readTime: "3 min read",
      date: "2026-04-16",
      excerpt: "Use a short 4-part outreach format that feels clear, professional, and easy to respond to.",
      tags: ["Collabs", "Networking", "Outreach"],
      ctaLabel: "Get outreach template",
      ctaLink: "./contact.html",
      content: [
        "Creators ignore generic collaboration DMs because they are vague.",
        "Use this 4-part message: who you are, shared audience fit, one specific idea, and exact next step.",
        "Always include your suggested publish timeline. Clear proposals get faster replies."
      ],
      actionSteps: [
        "Personalize first line for each creator.",
        "Keep total message under 120 words.",
        "Suggest one specific video angle.",
        "Follow up once after 5 days."
      ]
    },
    {
      slug: "shorts-to-long-form-loop",
      title: "Shorts to long-form strategy for faster channel growth",
      category: "Content Strategy",
      readTime: "4 min read",
      date: "2026-04-20",
      excerpt: "Repurpose one long video into three Shorts and funnel viewers back to your full content.",
      tags: ["Shorts", "Long-form", "Repurposing"],
      ctaLabel: "Join Now",
      ctaLink: "./community.html#join",
      content: [
        "Shorts can increase discovery, but they should feed your long-form system.",
        "Repurpose each long video into three Shorts: hook clip, lesson clip, and transformation/result clip.",
        "Use pinned comments and end screens to redirect viewers to your full video for deeper watch time."
      ],
      actionSteps: [
        "Mark strong 20-35 second moments while editing.",
        "Create 3 Shorts with different hooks.",
        "Link each Short to one long-form video.",
        "Track conversion from Shorts to long-form views."
      ]
    }
  ];

  const renderBySlug = (posts) => {
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      showError("This blog post does not exist.");
      return false;
    }
    render(post);
    return true;
  };

  fetch("./assets/data/blogs.json", { cache: "no-cache" })
    .then((res) => {
      if (!res.ok) throw new Error("Could not load blog data.");
      return res.json();
    })
    .then((data) => {
      const posts = Array.isArray(data.posts) ? data.posts : [];
      if (!renderBySlug(posts)) {
        renderBySlug(fallbackPosts);
      }
    })
    .catch(() => {
      if (!renderBySlug(fallbackPosts)) {
        showError("Unable to load the blog post right now.");
      }
    });
})();

