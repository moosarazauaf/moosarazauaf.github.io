// Renders the whole site from data/*.json. Edit the JSON files to update
// content — this file only reads them and builds DOM; no content lives here.

/* ----------------------------- icons ----------------------------- */
const ICONS = {
  github:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M0 1.15C0 .52.53 0 1.19 0h13.62C15.47 0 16 .52 16 1.15v13.7c0 .63-.53 1.15-1.19 1.15H1.19C.53 16 0 15.48 0 14.85V1.15Zm4.94 12.32V6.16H2.42v7.31h2.52ZM3.68 5.13c.88 0 1.43-.58 1.43-1.31-.02-.75-.55-1.31-1.41-1.31-.86 0-1.43.57-1.43 1.31 0 .73.55 1.31 1.39 1.31h.02Zm4.59 8.34V9.36c0-.22.02-.44.08-.6.18-.44.58-.9 1.27-.9.89 0 1.25.68 1.25 1.68v3.93h2.52V9.24c0-2.33-1.24-3.41-2.9-3.41-1.34 0-1.93.74-2.26 1.26v.03h-.02l.02-.03V6.16H5.71c.03.71 0 7.31 0 7.31h2.56Z"/></svg>',
  orcid:
    '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0ZM7.37 18.2H5.62V7.5h1.75v10.7Zm-.87-11.9a1.02 1.02 0 1 1 0-2.05 1.02 1.02 0 0 1 0 2.05Zm4.02 1.2h4.06c3.87 0 5.57 2.77 5.57 5.35 0 2.81-2.2 5.35-5.55 5.35h-4.08V7.5Zm1.75 1.58v7.54h2.22c2.7 0 3.87-1.63 3.87-3.77 0-1.96-1.25-3.77-3.87-3.77h-2.22Z"/></svg>',
  mail:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M1.5 3A1.5 1.5 0 0 0 0 4.5v7A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 14.5 3h-13Zm0 1h13a.5.5 0 0 1 .5.5v.35l-7 4.38-7-4.38V4.5a.5.5 0 0 1 .5-.5Zm-.5 1.85 6.72 4.2a.5.5 0 0 0 .56 0L15 5.85V11.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V5.85Z"/></svg>',
  download:
    '<svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M8 1a.5.5 0 0 1 .5.5v7.79l2.15-2.15a.5.5 0 1 1 .7.71l-3 3a.5.5 0 0 1-.7 0l-3-3a.5.5 0 1 1 .7-.71L7.5 9.29V1.5A.5.5 0 0 1 8 1ZM2 12.5a.5.5 0 0 1 1 0V14h10v-1.5a.5.5 0 0 1 1 0V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1.5Z"/></svg>',
  user:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1c-2.67 0-6 1.34-6 3v1.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V12c0-1.66-3.33-3-6-3Z"/></svg>',
  cap:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M8 1.5 0 5.5l8 4 6.5-3.25V11h1V5.5L8 1.5ZM3 8.4v3.1c0 .9 2.24 2 5 2s5-1.1 5-2V8.4l-5 2.5-5-2.5Z"/></svg>',
  flask:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M6.5 1a.5.5 0 0 0 0 1H7v3.31L2.6 12.2A1.5 1.5 0 0 0 3.86 14.5h8.28a1.5 1.5 0 0 0 1.26-2.3L9 5.31V2h.5a.5.5 0 0 0 0-1h-3Zm1.5 1.5h.5v3.5a.5.5 0 0 0 .08.27L10.6 9H5.4l1.52-2.73A.5.5 0 0 0 7 6V2.5h1Z"/></svg>',
  doc:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M4 1.5A1.5 1.5 0 0 0 2.5 3v10A1.5 1.5 0 0 0 4 14.5h8a1.5 1.5 0 0 0 1.5-1.5V5.6L9.4 1.5H4Zm5 1 3.5 3.5H9.5A.5.5 0 0 1 9 5.5V2.5ZM5 8h6v1H5V8Zm0 2.5h6v1H5v-1Z"/></svg>',
  code:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M5.35 3.15a.5.5 0 0 1 0 .7L1.71 7.5l3.64 3.65a.5.5 0 1 1-.7.7l-4-4a.5.5 0 0 1 0-.7l4-4a.5.5 0 0 1 .7 0Zm5.3 0a.5.5 0 0 1 .7 0l4 4a.5.5 0 0 1 0 .7l-4 4a.5.5 0 0 1-.7-.7l3.64-3.65-3.64-3.65a.5.5 0 0 1 0-.7Z"/></svg>',
  spark:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M8 0l1.6 4.9L14.5 6.5 9.6 8.1 8 13 6.4 8.1 1.5 6.5 6.4 4.9 8 0Zm5 9 .7 2.1 2.1.7-2.1.7L13 15l-.7-2.5-2.1-.7 2.1-.7L13 9Z"/></svg>',
  mic:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M8 1a2 2 0 0 0-2 2v5a2 2 0 1 0 4 0V3a2 2 0 0 0-2-2ZM4 7a.5.5 0 0 0-1 0 5 5 0 0 0 4.5 4.98V14H5.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1H8.5v-2.02A5 5 0 0 0 13 7a.5.5 0 0 0-1 0 4 4 0 0 1-8 0Z"/></svg>',
  award:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M8 0a5 5 0 1 0 2.5 9.33V15.5a.5.5 0 0 0 .76.43L13 14.83l1.74 1.1a.5.5 0 0 0 .76-.43V9.33A5 5 0 0 0 8 0Zm0 1a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"/></svg>',
  sun:
    '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1.5a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-1 0V13a.5.5 0 0 1 .5-.5Zm0-11a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-1 0V2a.5.5 0 0 1 .5-.5ZM2 8a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8Zm10 0a.5.5 0 0 1 .5-.5H14a.5.5 0 0 1 0 1h-1.5A.5.5 0 0 1 12 8ZM3.76 3.76a.5.5 0 0 1 .7 0l1.07 1.06a.5.5 0 0 1-.71.71L3.76 4.47a.5.5 0 0 1 0-.71Zm6.71 6.71a.5.5 0 0 1 .7 0l1.07 1.06a.5.5 0 0 1-.71.71l-1.06-1.07a.5.5 0 0 1 0-.7Zm1.77-6.71a.5.5 0 0 1 0 .71l-1.07 1.06a.5.5 0 1 1-.7-.71l1.06-1.06a.5.5 0 0 1 .71 0ZM5.53 10.47a.5.5 0 0 1 0 .7L4.47 12.24a.5.5 0 0 1-.71-.71l1.06-1.06a.5.5 0 0 1 .71 0Z"/></svg>',
  moon:
    '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M6 0a6 6 0 0 0 10 7.5A7 7 0 1 1 6 0Z"/></svg>',
  chevronLeft:
    '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg>',
  chevronRight:
    '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg>',
};

/* ----------------------------- helpers ----------------------------- */
const el = (id) => document.getElementById(id);

function heading(icon, text) {
  return `<div class="badge-heading"><span class="icon-badge">${ICONS[icon]}</span><h2>${text}</h2></div>`;
}

function socialRow(profile) {
  const s = profile.social || {};
  const links = [];
  if (s.github) links.push(`<a class="social-btn" href="${s.github}" target="_blank" rel="noopener" title="GitHub" aria-label="GitHub">${ICONS.github}</a>`);
  if (s.linkedin) links.push(`<a class="social-btn" href="${s.linkedin}" target="_blank" rel="noopener" title="LinkedIn" aria-label="LinkedIn">${ICONS.linkedin}</a>`);
  if (s.orcid) links.push(`<a class="social-btn" href="${s.orcid}" target="_blank" rel="noopener" title="ORCID" aria-label="ORCID">${ICONS.orcid}</a>`);
  if (profile.email) links.push(`<a class="social-btn" href="mailto:${profile.email}" title="Email" aria-label="Email">${ICONS.mail}</a>`);
  return `<div class="social-row">${links.join("")}</div>`;
}

/* ----------------------------- sections ----------------------------- */
function renderHero(profile) {
  const eduCards = (profile.education || [])
    .map(
      (e) => `
      <div class="card edu-card">
        <div class="edu-degree">${e.degree}</div>
        <div class="edu-org">${e.institution}</div>
        ${e.period ? `<div class="edu-period">${e.period}</div>` : ""}
      </div>`
    )
    .join("");

  el("hero").innerHTML = `
    <div class="hero-identity">
      <img class="hero-photo" src="${profile.photo}" alt="Photo of ${profile.name}" />
      <h1>${profile.name}</h1>
      ${profile.role ? `<div class="hero-role">${profile.role}</div>` : ""}
      ${profile.affiliation ? `<div class="hero-affil">${profile.affiliation}</div>` : ""}
      <div class="hero-location">${profile.location}</div>
      ${socialRow(profile)}
    </div>

    <div class="hero-main">
      ${heading("user", "Professional Summary")}
      ${profile.about.map((p) => `<p>${p}</p>`).join("")}
      ${profile.cv ? `<a class="btn-primary" href="${profile.cv}" target="_blank" rel="noopener">${ICONS.download} Download CV</a>` : ""}

      <div style="margin-top: var(--space-lg)">
        ${heading("cap", "Education")}
        <div class="card-grid">${eduCards}</div>
      </div>
    </div>`;
}

function renderEducation(profile) {
  // Full education detail (the hero shows a condensed version).
  el("education").innerHTML =
    heading("cap", "Education in Detail") +
    `<div class="card-grid">${(profile.education || [])
      .map(
        (e) => `
      <div class="card edu-card">
        <div class="edu-degree">${e.degree}</div>
        <div class="edu-org">${e.institution}</div>
        ${e.period ? `<div class="edu-period">${e.period}</div>` : ""}
        <ul>${(e.details || []).map((d) => `<li>${d}</li>`).join("")}</ul>
      </div>`
      )
      .join("")}</div>`;
}

function renderExperience(profile) {
  el("experience").innerHTML =
    heading("flask", "Research Experience") +
    (profile.experience || [])
      .map(
        (e) => `
      <div class="card exp-card">
        <div class="exp-role">${e.role}</div>
        <div class="exp-meta">${e.org}</div>
        <div class="exp-period">${e.period}</div>
        <ul>${(e.bullets || []).map((b) => `<li>${b}</li>`).join("")}</ul>
      </div>`
      )
      .join("");
}

function renderPublications(publications) {
  el("publications").innerHTML =
    heading("doc", "Publications") +
    publications
      .map((p) => {
        const prep = /prep/i.test(p.status) ? " is-prep" : "";
        return `
      <div class="card pub-card">
        <h3>${p.title}</h3>
        <div class="pub-meta">${p.authors} — ${p.journal} (${p.year})</div>
        <span class="status-badge${prep}">${p.status}</span>
      </div>`;
      })
      .join("");
}

function renderProjects(projects) {
  const slides = projects
    .map(
      (p, i) => `
      <article class="slide" role="group" aria-roledescription="slide"
               aria-label="${i + 1} of ${projects.length}: ${p.title}">
        <div class="showcase">
          <div class="showcase-media">
            <img class="media-main" src="${p.image}" alt="${p.title} preview" loading="${i === 0 ? "eager" : "lazy"}" />
            ${
              (p.gallery || []).length > 1
                ? `<div class="thumbs">${p.gallery
                    .map(
                      (g, gi) =>
                        `<button class="thumb${gi === 0 ? " active" : ""}" type="button"
                                 data-src="${g.src}" title="${g.caption}" aria-label="${g.caption}">
                           <img src="${g.src}" alt="" loading="lazy" />
                         </button>`
                    )
                    .join("")}</div>
                   <p class="media-caption">${p.gallery[0].caption}</p>`
                : ""
            }
          </div>
          <div class="showcase-body">
            <div class="showcase-scroll">
              <h3>${p.title}</h3>
              <p>${p.description}</p>
              ${
                (p.highlights || []).length
                  ? `<ul class="highlights">${p.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>`
                  : ""
              }
              <div class="tag-row">${(p.tags || []).map((t) => `<span class="tag">${t}</span>`).join("")}</div>
            </div>
            <div class="showcase-links">
              <a class="btn-outline" href="${p.repoUrl}" target="_blank" rel="noopener">View on GitHub</a>
              ${p.liveUrl ? `<a class="btn-outline" href="${p.liveUrl}" target="_blank" rel="noopener">Live Demo</a>` : ""}
            </div>
          </div>
        </div>
      </article>`
    )
    .join("");

  const dots = projects
    .map(
      (p, i) =>
        `<button class="dot" type="button" data-go="${i}" aria-label="Go to project ${i + 1}: ${p.title}"></button>`
    )
    .join("");

  el("projects").innerHTML = `
    <div class="section-head">
      ${heading("code", "Projects")}
      <div class="carousel-nav">
        <button class="cbtn" type="button" data-dir="-1" aria-label="Previous project">${ICONS.chevronLeft}</button>
        <span class="counter"><span id="c-now">1</span> / ${projects.length}</span>
        <button class="cbtn" type="button" data-dir="1" aria-label="Next project">${ICONS.chevronRight}</button>
      </div>
    </div>
    <div class="carousel" tabindex="0" aria-roledescription="carousel" aria-label="Projects">
      <div class="track">${slides}</div>
    </div>
    <div class="dots">${dots}</div>`;

  initCarousel(projects.length);
}

/* Carousel: arrows, dots, keyboard, swipe. One slide visible at a time. */
function initCarousel(count) {
  const root = document.querySelector("#projects .carousel");
  const track = root.querySelector(".track");
  const dotEls = [...document.querySelectorAll("#projects .dot")];
  const nowEl = el("c-now");
  let index = 0;

  // Slides sit inside a transformed, overflow-hidden track, so the browser never
  // treats offscreen ones as visible and native lazy-loading never fires for them.
  // Promote the current slide and its neighbours to eager so they actually load.
  function ensureLoaded(i) {
    [i - 1, i, i + 1].forEach((n) => {
      const slide = track.children[(n + count) % count];
      slide?.querySelectorAll("img[loading='lazy']").forEach((img) => {
        img.loading = "eager";
        if (!img.complete) img.src = img.src; // nudge the fetch in stubborn engines
      });
    });
  }

  function go(next) {
    index = (next + count) % count;
    track.style.transform = `translateX(-${index * 100}%)`;
    ensureLoaded(index);
    dotEls.forEach((d, i) => d.classList.toggle("active", i === index));
    [...track.children].forEach((s, i) => {
      s.classList.toggle("is-active", i === index);
      // Keep offscreen slides out of the tab order and the a11y tree.
      s.setAttribute("aria-hidden", i === index ? "false" : "true");
      s.querySelectorAll("a, button").forEach((f) => (f.tabIndex = i === index ? 0 : -1));
    });
    if (nowEl) nowEl.textContent = String(index + 1);
  }

  document.querySelectorAll("#projects .cbtn").forEach((b) =>
    b.addEventListener("click", () => go(index + Number(b.dataset.dir)))
  );

  // Gallery thumbnails swap the slide's main image.
  track.querySelectorAll(".showcase-media").forEach((media) => {
    const main = media.querySelector(".media-main");
    const cap = media.querySelector(".media-caption");
    media.querySelectorAll(".thumb").forEach((tb) => {
      tb.addEventListener("click", () => {
        main.src = tb.dataset.src;
        if (cap) cap.textContent = tb.title;
        media.querySelectorAll(".thumb").forEach((o) => o.classList.toggle("active", o === tb));
      });
    });
  });
  dotEls.forEach((d) => d.addEventListener("click", () => go(Number(d.dataset.go))));

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
  });

  // Touch swipe
  let x0 = null;
  root.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  root.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  go(0);
}

/* Fade-up reveal as sections scroll into view.
   Deliberately fail-safe: this is decoration, so every path that could leave a
   section stuck at opacity 0 falls back to simply showing it. */
function initReveal() {
  const targets = [...document.querySelectorAll(".section, .hero-card")];
  const showAll = () => targets.forEach((t) => t.classList.add("revealed"));

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  targets.forEach((t) => t.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("revealed");
          io.unobserve(en.target);
        }
      });
    },
    // Generous margin so a section reveals just before it reaches the viewport,
    // and threshold 0 so fast scrolling can't skip past the trigger.
    { rootMargin: "200px 0px 200px 0px", threshold: 0 }
  );
  targets.forEach((t) => io.observe(t));

  // Backstop: if anything is still hidden a few seconds in (observer never
  // fired, scroll restored mid-page, tab backgrounded), just reveal it.
  setTimeout(showAll, 3000);
}

function renderSkills(profile) {
  const groups = Object.entries(profile.skills || {})
    .map(
      ([group, items]) => `
      <div class="card skills-group">
        <h3>${group}</h3>
        <ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>
      </div>`
    )
    .join("");

  el("skills").innerHTML =
    heading("spark", "Skills") +
    `<div class="card-grid">${groups}</div>
     <div class="badge-heading" style="margin-top: var(--space-lg)">
       <span class="icon-badge">${ICONS.spark}</span><h3>Applied Project Skills</h3>
     </div>
     <ul class="chip-list">${(profile.projectLevelSkills || [])
       .map((s) => `<li class="chip">${s}</li>`)
       .join("")}</ul>`;
}

function renderTalks(profile) {
  el("talks").innerHTML =
    heading("mic", "Scientific Communication") +
    `<div class="card-grid">${(profile.talks || [])
      .map(
        (t) => `
      <div class="card talk-card">
        <div class="talk-role">${t.role}</div>
        <div class="talk-period">${t.period}</div>
        <p>${t.detail}</p>
      </div>`
      )
      .join("")}</div>`;
}

function renderCertifications(profile) {
  el("certifications").innerHTML =
    heading("award", "Certifications") +
    `<div class="card-grid">${(profile.certifications || [])
      .map(
        (c) => `<div class="card cert-card"><span class="icon-badge">${ICONS.award}</span><span>${c}</span></div>`
      )
      .join("")}</div>`;
}

function renderFooter(profile) {
  el("contact").innerHTML = `
    <h2>Get in touch</h2>
    <p>${profile.location} · <a href="mailto:${profile.email}" style="color:#fff">${profile.email}</a></p>
    ${socialRow(profile)}
    <p class="copyright">© ${new Date().getFullYear()} ${profile.name}. Built with plain HTML, CSS &amp; JS — hosted on GitHub Pages.</p>`;
}

/* ----------------------------- theme toggle ----------------------------- */
function initThemeToggle() {
  const btn = el("theme-toggle");
  if (!btn) return;
  const paint = () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.innerHTML = dark ? ICONS.sun : ICONS.moon;
  };
  btn.addEventListener("click", () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    paint();
  });
  paint();
}

/* ----------------------------- boot ----------------------------- */
// The data files change far more often than the code. Bypass the HTTP cache so
// a content edit shows up on the next visit instead of whenever the cache expires.
async function loadJson(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

async function init() {
  initThemeToggle();
  try {
    const [profile, projects, publications] = await Promise.all([
      loadJson("data/profile.json"),
      loadJson("data/projects.json"),
      loadJson("data/publications.json"),
    ]);

    renderHero(profile);
    renderEducation(profile);
    renderExperience(profile);
    renderPublications(publications);
    renderProjects(projects);
    renderSkills(profile);
    renderTalks(profile);
    renderCertifications(profile);
    renderFooter(profile);

    initReveal();
  } catch (err) {
    console.error(err);
    document.querySelector("main").innerHTML =
      '<p style="padding:3rem;text-align:center;color:#a5243a">Could not load site content. Check the browser console for details.</p>';
  }
}

init();
