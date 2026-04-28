(() => {
  const blogRoot = document.querySelector("#blogApp");
  if (!blogRoot) return;

  const searchInput = document.querySelector("#blogSearch");
  const gridEl = document.querySelector("#blogGrid");
  const countEl = document.querySelector("#blogCount");
  const listView = document.querySelector("#blogListView");
  const detailView = document.querySelector("#blogDetailView");
  const detailBody = document.querySelector("#blogDetailBody");
  const backBtn = document.querySelector("#backToBlogs");
  const loadingEl = document.querySelector("#blogLoading");
  const emptyEl = document.querySelector("#blogEmpty");
  const fallbackCards = gridEl ? gridEl.innerHTML : "";

  let posts = [];

  const getSlug = () => new URLSearchParams(window.location.search).get("slug");
  const esc = (s) =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const showLoading = (on) => {
    if (!loadingEl) return;
    loadingEl.classList.toggle("d-none", !on);
  };

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const cardTemplate = (post) => `
    <div class="col-md-6 col-lg-4" data-post-card data-post="${esc(
      `${post.title} ${post.searchText || ""} ${(post.tags || []).join(" ")}`
    )}">
      <article class="post-card reveal in">
        <div class="post-banner"></div>
        <div class="post-body">
          <div class="post-meta mb-2">${esc(post.category)} • ${esc(post.readTime)} • ${esc(formatDate(post.date))}</div>
          <h3 class="h5 fw-bold">${esc(post.title)}</h3>
          <p class="text-muted mb-3">${esc(post.excerpt)}</p>
          <a class="btn btn-soft btn-sm" href="./blog.html?slug=${encodeURIComponent(post.slug)}">Read article</a>
        </div>
      </article>
    </div>
  `;

  const detailTemplate = (post) => `
    <article class="form-card">
      <div class="post-meta mb-2">${esc(post.category)} • ${esc(post.readTime)} • ${esc(formatDate(post.date))}</div>
      <h2 class="h2 fw-bold mb-3">${esc(post.title)}</h2>
      <p class="text-muted mb-4">${esc(post.excerpt)}</p>
      ${post.content.map((p) => `<p>${esc(p)}</p>`).join("")}
      <hr />
      <h3 class="h5 fw-bold mb-3">Action steps</h3>
      <ul class="mb-4">
        ${post.actionSteps.map((s) => `<li>${esc(s)}</li>`).join("")}
      </ul>
      <div class="d-flex flex-wrap gap-2 mb-3">
        ${(post.tags || []).map((tag) => `<span class="pill">${esc(tag)}</span>`).join("")}
      </div>
      <a class="btn btn-gradient" href="${esc(post.ctaLink || "./community.html#join")}">${esc(
    post.ctaLabel || "Join Now"
  )}</a>
    </article>
  `;

  const renderList = (items) => {
    if (!gridEl) return;
    if (!items.length) {
      gridEl.innerHTML = "";
      if (emptyEl) emptyEl.classList.remove("d-none");
      if (countEl) countEl.textContent = "0 posts";
      return;
    }
    if (emptyEl) emptyEl.classList.add("d-none");
    gridEl.innerHTML = items.map(cardTemplate).join("");
    if (countEl) countEl.textContent = `${items.length} post${items.length > 1 ? "s" : ""}`;
  };

  const renderDetail = (slug) => {
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      window.location.href = "./blog.html";
      return;
    }
    if (listView) listView.classList.add("d-none");
    if (detailView) detailView.classList.remove("d-none");
    if (detailBody) detailBody.innerHTML = detailTemplate(post);
    document.title = `${post.title} | Early YouTubers Blog`;
  };

  const renderPage = () => {
    const slug = getSlug();
    if (slug) {
      renderDetail(slug);
      return;
    }
    if (detailView) detailView.classList.add("d-none");
    if (listView) listView.classList.remove("d-none");
    renderList(posts);
  };

  const initSearch = () => {
    if (!searchInput) return;
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        renderList(posts);
        return;
      }
      const filtered = posts.filter((p) => {
        const hay = `${p.title} ${p.excerpt} ${p.searchText || ""} ${(p.tags || []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
      renderList(filtered);
    });
  };

  const init = async () => {
    try {
      showLoading(true);
      const res = await fetch("./assets/data/blogs.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("Failed to load blog data");
      const data = await res.json();
      posts = Array.isArray(data.posts) ? data.posts : [];
      renderPage();
      initSearch();
      if (backBtn) {
        backBtn.addEventListener("click", () => {
          window.location.href = "./blog.html";
        });
      }
    } catch (err) {
      if (fallbackCards && gridEl) {
        gridEl.innerHTML = fallbackCards;
        if (countEl) countEl.textContent = `${gridEl.querySelectorAll("[data-post-card]").length} posts`;
      } else if (emptyEl) {
        emptyEl.classList.remove("d-none");
        emptyEl.textContent = "Unable to load blog data. Please try again.";
      }
    } finally {
      showLoading(false);
    }
  };

  init();
})();

