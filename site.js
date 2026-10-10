(function () {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".page-hero");

  function setHeader() {
    if (!header) return;
    const threshold = hero ? Math.max(80, hero.offsetHeight - 90) : 20;
    header.classList.toggle("scrolled-past", window.scrollY > threshold);
  }
  window.addEventListener("scroll", setHeader, { passive: true });
  setHeader();

  if (hero && !reduceMotion) {
    window.addEventListener(
      "scroll",
      () => {
        hero.style.setProperty(
          "--hero-shift",
          `${Math.min(window.scrollY, hero.offsetHeight) * 0.1}px`
        );
      },
      { passive: true }
    );
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px" }
    );
    revealItems.forEach((item) => observer.observe(item));
  }

  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  function closeMenu() {
    menuButton?.setAttribute("aria-expanded", "false");
    mobileMenu?.classList.remove("open");
    document.body.classList.remove("overlay-open");
  }
  menuButton?.addEventListener("click", () => {
    const opening = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(opening));
    mobileMenu?.classList.toggle("open", opening);
    document.body.classList.toggle("overlay-open", opening);
  });
  mobileMenu
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));

  const itineraryOptions = document.querySelectorAll(
    "[data-itinerary-show]"
  );
  itineraryOptions.forEach((option) =>
    option.addEventListener("click", () => {
      const target = document.getElementById(option.dataset.itineraryShow);
      if (!target) return;
      itineraryOptions.forEach((item) => {
        const active = item === option;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      document.querySelectorAll(".itinerary-view").forEach((view) => {
        view.hidden = view !== target;
      });
      const alternateItinerary = document.querySelector(
        "#everest-view-itinerary"
      );
      if (alternateItinerary)
        alternateItinerary.hidden = alternateItinerary !== target;
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    })
  );
  const hashTarget = document.getElementById(window.location.hash.slice(1));
  const hashOption = [...itineraryOptions].find(
    (option) => option.dataset.itineraryShow === hashTarget?.id
  );
  hashOption?.click();

  const dialog = document.querySelector("#site-search");
  const searchInput = dialog?.querySelector("#global-search-input");
  const results = dialog?.querySelector("#global-search-results");
  const count = dialog?.querySelector("#search-count");
  const searchForm = dialog?.querySelector("form");
  const popularTerms = [
    "Pokhara",
    "Everest Base Camp",
    "Annapurna Circuit",
    "Mustang",
    "Kathmandu",
    "Chitwan",
  ];

  function normalise(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function scoreItem(item, query) {
    const q = normalise(query);
    if (!q) return 0;
    const title = normalise(item.title);
    const category = normalise(item.category);
    const description = normalise(item.description);
    const tags = normalise((item.tags || []).join(" "));
    let score = 0;
    if (title === q) score += 120;
    if (title.startsWith(q)) score += 70;
    if (title.includes(q)) score += 45;
    if (category.includes(q)) score += 16;
    if (tags.includes(q)) score += 22;
    if (description.includes(q)) score += 10;
    if (category === "trek") score += 5;
    else if (category === "destination") score += 3;
    else if (category === "route") score += 1;
    q.split(/\s+/)
      .filter(Boolean)
      .forEach((term) => {
        if (title.includes(term)) score += 12;
        if (tags.includes(term)) score += 6;
        if (description.includes(term)) score += 3;
      });
    return score;
  }

  function resultMarkup(item) {
    const tags = [...new Set(item.tags || [])].slice(0, 3);
    return `<a class="search-result" href="${item.url}">
      <img src="${item.image}" alt="" width="220" height="160" loading="lazy">
      <span><small>${item.category}</small><h3>${item.title}</h3><p>${
      item.description
    }</p>
      <span class="search-result-meta">${tags
        .map((tag) => `<em>${tag}</em>`)
        .join("")}<b>Explore →</b></span></span>
    </a>`;
  }

  function runSearch(query) {
    if (!results || !window.SEARCH_INDEX) return;
    const clean = query.trim();
    if (!clean) {
      results.innerHTML = "";
      if (count) count.textContent = "Type to search every guide.";
      return;
    }
    const matches = window.SEARCH_INDEX.map((item) => ({
      item,
      score: scoreItem(item, clean),
    }))
      .filter((entry) => entry.score > 0)
      .sort(
        (a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title)
      )
      .slice(0, 12)
      .map((entry) => entry.item);
    if (count)
      count.textContent = `${matches.length} result${
        matches.length === 1 ? "" : "s"
      } for “${clean}”`;
    results.innerHTML = matches.length
      ? matches.map(resultMarkup).join("")
      : `<div class="search-empty"><h3>No results found.</h3><p>Try searching for Kathmandu, Pokhara, Everest, Annapurna or Mustang.</p></div>`;
  }

  function openSearch(term = "") {
    closeMenu();
    if (!dialog) {
      window.location.href = `/search?q=${encodeURIComponent(term)}`;
      return;
    }
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("overlay-open");
    searchInput.value = term;
    runSearch(term);
    window.setTimeout(() => searchInput.focus(), 40);
  }
  function closeSearch() {
    if (dialog?.open) dialog.close();
    document.body.classList.remove("overlay-open");
  }
  document.querySelectorAll("[data-search-open]").forEach((button) =>
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openSearch(button.dataset.term || "");
    })
  );
  dialog
    ?.querySelector(".search-close")
    ?.addEventListener("click", closeSearch);
  dialog?.addEventListener("close", () =>
    document.body.classList.remove("overlay-open")
  );
  searchInput?.addEventListener("input", (event) =>
    runSearch(event.target.value)
  );
  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      const first = results?.querySelector("a");
      if (first) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  results?.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    const links = [...results.querySelectorAll("a")];
    const index = links.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    const next = event.key === "ArrowDown" ? index + 1 : index - 1;
    if (next < 0) searchInput?.focus();
    else links[Math.min(next, links.length - 1)]?.focus();
  });
  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) window.location.href = `/search?q=${encodeURIComponent(query)}`;
  });
  dialog
    ?.querySelector(".popular-searches")
    ?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      searchInput.value = button.textContent;
      runSearch(button.textContent);
      searchInput.focus();
    });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
    }
    if (event.key === "Escape" && mobileMenu?.classList.contains("open"))
      closeMenu();
  });

  if (document.body.dataset.page === "search") {
    const query = new URLSearchParams(window.location.search).get("q") || "";
    openSearch(query);
    dialog?.querySelector(".search-close")?.addEventListener("click", () => {
      window.location.href = "/";
    });
  }

  const filterButtons = document.querySelectorAll("[data-filter]");
  if (filterButtons.length) {
    const filterItems = document.querySelectorAll("[data-filter-value]");
    const mountainSearch = document.querySelector("[data-mountain-search]");
    const mountainSearchInput = document.querySelector(
      "[data-mountain-search-input]"
    );
    let activeFilter = "all";

    function applyFilters() {
      const query = normalise(mountainSearchInput?.value || "");
      filterItems.forEach((item) => {
        const matchesFilter =
          activeFilter === "all" || item.dataset.filterValue === activeFilter;
        const matchesSearch = !query || normalise(item.textContent).includes(query);
        item.hidden = !matchesFilter || !matchesSearch;
      });
    }

    filterButtons.forEach((button) =>
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach((item) =>
          item.classList.toggle("active", item === button)
        );
        applyFilters();
      })
    );
    mountainSearchInput?.addEventListener("input", applyFilters);
    mountainSearch?.addEventListener("submit", (event) => {
      event.preventDefault();
      applyFilters();
    });
  }

  const journey = document.querySelector("#journey");
  const routePath = document.querySelector("#route-progress");

  if (journey && routePath && window.WANDERS_NEPAL_JOURNEY && !reduceMotion) {
    const intro = journey.querySelector(".journey-intro");
    const panel = journey.querySelector(".journey-panel");
    const scrollNote = journey.querySelector(".journey-scroll");
    const layers = [...journey.querySelectorAll("[data-stage-bg]")];
    const markers = [...journey.querySelectorAll("[data-route-marker]")];
    const traveler = journey.querySelector("#route-traveler");
    const progressBar = journey.querySelector("#journey-progress-bar");
    const length = routePath.getTotalLength();

    routePath.style.strokeDasharray = length;
    routePath.style.strokeDashoffset = length;

    const stageCount = window.WANDERS_NEPAL_JOURNEY.length;
    const stageRatios = stageCount > 1
      ? Array.from({ length: stageCount }, (_, i) => i / (stageCount - 1))
      : [0];

    function jumpToStage(index) {
      const distance = Math.max(1, journey.offsetHeight - window.innerHeight);
      const targetScroll = journey.offsetTop + stageRatios[index] * distance + 10;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }

    // Align all markers with sub-pixel mathematical precision directly on the SVG curve and add click navigation
    markers.forEach((marker, i) => {
      if (i < stageRatios.length) {
        const pt = routePath.getPointAtLength(stageRatios[i] * length);
        marker.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
        marker.style.cursor = "pointer";
        marker.addEventListener("click", () => jumpToStage(i));
      }
    });

    let active = -1;
    let ticking = false;
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

    function updateStage(index) {
      if (index === active || index < 0 || index >= stageCount) return;
      active = index;
      const stage = window.WANDERS_NEPAL_JOURNEY[index];

      layers.forEach((layer, i) =>
        layer.classList.toggle("active", i === index)
      );

      panel?.classList.add("switching");
      window.setTimeout(
        () => {
          if (!panel) return;
          const romanEl = panel.querySelector("#stage-roman");
          const chapterEl = panel.querySelector("#stage-chapter");
          const placeEl = panel.querySelector("#stage-place");
          const titleEl = panel.querySelector("#stage-title");
          const noteEl = panel.querySelector("#stage-note");
          const distEl = journey.querySelector("#stat-distance");
          const timeEl = journey.querySelector("#stat-time");
          const climEl = journey.querySelector("#stat-climate");
          const numEl = journey.querySelector("#stage-number");

          if (romanEl) romanEl.textContent = roman[index] || "";
          if (chapterEl) chapterEl.textContent = stage.chapter;
          if (placeEl) placeEl.textContent = stage.place;
          if (titleEl) titleEl.textContent = stage.title;
          if (noteEl) noteEl.textContent = stage.note;
          if (distEl) distEl.textContent = stage.distance;
          if (timeEl) timeEl.textContent = stage.elevation;
          if (climEl) climEl.textContent = stage.climate;
          if (numEl) numEl.textContent = String(index + 1).padStart(2, "0");

          panel.classList.remove("switching");
        },
        active === -1 ? 0 : 120
      );
    }

    function updateJourney() {
      const distance = Math.max(1, journey.offsetHeight - window.innerHeight);
      const rawProgress = (window.scrollY - journey.offsetTop) / distance;
      const progress = Math.min(1, Math.max(0, rawProgress));

      const departed = progress > 0.02;
      intro?.classList.toggle("departed", departed);
      panel?.classList.toggle("active", departed);
      scrollNote?.classList.toggle("hidden", departed);

      // 1. Draw line to exact progress distance
      const drawDist = progress * length;
      routePath.style.strokeDashoffset = length - drawDist;

      // 2. Move glowing traveler beacon precisely at the tip of the line
      if (traveler) {
        const currentPt = routePath.getPointAtLength(drawDist);
        traveler.setAttribute("transform", `translate(${currentPt.x.toFixed(1)} ${currentPt.y.toFixed(1)})`);
      }

      if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
      }

      header?.classList.toggle(
        "scrolled-past",
        window.scrollY > journey.offsetHeight - 90
      );

      // 3. Determine active stage: activates right as the line reaches each marker
      let activeIndex = 0;
      for (let i = 0; i < stageRatios.length; i++) {
        if (progress >= stageRatios[i] - 0.035) {
          activeIndex = i;
        }
      }

      // 4. Update marker classes: reached as soon as line touches point
      markers.forEach((marker, i) => {
        const isReached = progress >= stageRatios[i] - 0.015;
        const isCurrent = (i === activeIndex);
        marker.classList.toggle("reached", isReached);
        marker.classList.toggle("current", isCurrent);
      });


      updateStage(activeIndex);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateJourney);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateJourney();
  }
})();
