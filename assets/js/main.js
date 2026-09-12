// Renders the whole site from data/*.json. Edit the JSON files to update
// content. This file only reads them and builds DOM; no content lives here.

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
  arrowRight:
    '<svg viewBox="0 0 24 16" width="26" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 8h20M16 3l5 5-5 5"/></svg>',
  check:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8.5 6 12l8-9"/></svg>',
  wave:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M1 5c1.6-1.6 3.2-1.6 4.8 0S9 6.6 10.6 5 13.8 3.4 15 5M1 11c1.6-1.6 3.2-1.6 4.8 0s3.2 1.6 4.8 0 3.2-1.6 4.4 0"/></svg>',
  leaf:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M14 1S6.5 1 3.8 3.7C1.6 5.9 1.6 9.4 3.4 11.7L2 13.1a.7.7 0 0 0 1 1l1.4-1.4c2.3 1.8 5.8 1.8 8-.4C15 9.6 14 1 14 1Z"/></svg>',
  globe:
    '<svg viewBox="0 0 16 16" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><path d="M1.5 8h13M8 1.5c1.9 2 2.9 4.2 2.9 6.5S9.9 12.5 8 14.5C6.1 12.5 5.1 10.3 5.1 8S6.1 3.5 8 1.5Z"/></svg>',
};

/* ----------------------------- helpers ----------------------------- */
const el = (id) => document.getElementById(id);

/* Section header, AstroWind pattern: an uppercase tagline over a large centred
   heading, with an optional subtitle beneath. Every section goes through here,
   so the whole page shares one rhythm.
   `align: "start"` opts a header out of centring, used inside the two-column
   about split, where centred headers would fight the columns. */
function heading(icon, text, opts = {}) {
  const { tagline = "", subtitle = "", align = "center" } = opts;
  return `
    <header class="sec-head${align === "start" ? " is-start" : ""}">
      ${tagline ? `<p class="sec-tagline">${ICONS[icon] || ""}<span>${tagline}</span></p>` : ""}
      <h2>${text}</h2>
      ${subtitle ? `<p class="sec-sub">${subtitle}</p>` : ""}
    </header>`;
}

/* ------------------------------- tabs -------------------------------
   The page had fifteen stacked sections and ran to twelve screens. Nobody
   scrolls twelve screens, so the material a reader dips into rather than reads
   straight through is grouped behind tabs: the two interactive maps, and the CV
   detail. Only the open panel takes up height, which is where the saving comes
   from. Everything stays in the DOM and stays linkable.

   `items` is [{ id, label, body }], where `body` is the panel's HTML. */
function tabGroup(name, items) {
  const tabs = items
    .map(
      (t, i) =>
        `<button class="tab${i === 0 ? " is-on" : ""}" type="button" role="tab"
                 id="tab-${t.id}" aria-controls="panel-${t.id}"
                 aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t.label}</button>`
    )
    .join("");
  const panels = items
    .map(
      (t, i) =>
        `<div class="tabpanel" role="tabpanel" id="panel-${t.id}"
              aria-labelledby="tab-${t.id}"${i === 0 ? "" : " hidden"}>${t.body}</div>`
    )
    .join("");
  return `<div class="tabs">
            <div class="tablist" role="tablist" aria-label="${name}">${tabs}</div>
            ${panels}
          </div>`;
}

/* Inside a tab panel the tab label already names the content, so a second
   centred section header would say the same thing twice and give back most of
   the height the grouping just saved. Renderers call this instead of heading(),
   and the decision is made from where the node actually sits. */
function panelHeading(id, icon, text, opts = {}) {
  const node = el(id);
  if (!node || !node.closest(".tabpanel")) return heading(icon, text, opts);
  // The title goes, because the tab already said it. A subtitle usually carries
  // something the tab label cannot, so it stays as a plain note.
  return opts.subtitle ? `<p class="panel-note">${opts.subtitle}</p>` : "";
}

function initTabs() {
  document.querySelectorAll(".tabs").forEach((group) => {
    const tabs = [...group.querySelectorAll(":scope > .tablist > .tab")];
    const show = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle("is-on", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        el(t.getAttribute("aria-controls")).hidden = !on;
      });
      // Leaflet measures a hidden container as zero and paints a sliver of map,
      // so anything map-shaped needs to hear that it has just been revealed.
      window.dispatchEvent(new Event("panelshown"));
    };
    tabs.forEach((tab) => tab.addEventListener("click", () => show(tab)));
    group.querySelector(".tablist").addEventListener("keydown", (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const to =
        e.key === "ArrowRight" ? (i + 1) % tabs.length
        : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length
        : e.key === "Home" ? 0
        : e.key === "End" ? tabs.length - 1
        : -1;
      if (to < 0) return;
      e.preventDefault();
      tabs[to].focus();
      show(tabs[to]);
    });
  });

  // A link to anything inside a closed panel opens that panel first, so the nav,
  // the footer and an external deep link all still land on their target.
  const openFor = (hash) => {
    const target = hash && hash.length > 1 && document.querySelector(hash);
    const panel = target && target.closest(".tabpanel");
    if (panel) el(panel.getAttribute("aria-labelledby")).click();
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (a) openFor(a.getAttribute("href"));
  });
  addEventListener("hashchange", () => openFor(location.hash));
  openFor(location.hash);
}

/* A panel whose content failed to load takes its tab with it, rather than
   leaving a tab that opens onto nothing. */
function dropPanel(id) {
  const node = el(id);
  if (!node) return;
  const panel = node.closest(".tabpanel");
  if (!panel) return node.remove();
  const tab = el(panel.getAttribute("aria-labelledby"));
  const wasOpen = tab && tab.classList.contains("is-on");
  panel.remove();
  if (tab) tab.remove();
  const first = document.querySelector(".tabs .tab");
  if (wasOpen && first) first.click();
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
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="hero-scrim" aria-hidden="true"></div>
    <div class="hero-inner">
      <img class="hero-photo cine" src="${profile.photo}" alt="Photo of ${profile.name}" />
      ${
        profile.availability
          ? `<p class="hero-eyebrow cine"><span class="pulse"></span>${profile.availability.status}</p>`
          : ""
      }
      <h1 class="hero-name cine">${profile.name}</h1>
      <p class="hero-role cine">${profile.role || ""}</p>
      <p class="hero-tagline cine">${profile.tagline || ""}</p>
      <div class="hero-cta cine">
        <a class="btn-primary" href="#projects">${ICONS.code} View the research</a>
        <a class="btn-ghost" href="mailto:${profile.email}">${ICONS.mail} Get in touch</a>
      </div>
      <div class="cine">${socialRow(profile)}</div>
    </div>
    <a class="scroll-cue" href="#about" aria-label="Scroll to content">
      <span class="scroll-line" aria-hidden="true"></span>
    </a>`;

  // Stagger the hero entrance on first paint.
  [...document.querySelectorAll("#hero .cine")].forEach((n, i) =>
    n.style.setProperty("--i", i)
  );
  // The entrance starts the hero at opacity 0, so guarantee it turns on: rAF for
  // the normal case, and a timer in case that frame never lands.
  requestAnimationFrame(() => el("hero").classList.add("is-ready"));
  setTimeout(() => el("hero")?.classList.add("is-ready"), 1200);
}

/* Stats band, AstroWind's tinted full-bleed strip under the hero.
   Counts are derived from the data so they cannot drift out of date. */
function renderStats(profile, projects, publications) {
  const band = el("stats");
  if (!band) return;
  const stats = [
    { value: String(projects.length), label: "Open studies" },
    { value: String(publications.length), label: "Publications" },
    { value: "133", label: "Districts accounted nationally" },
    { value: "100%", label: "Code and data released" },
  ];
  // The one sentence a supervisor needs before deciding whether to keep reading
  // is which fields this is aimed at. It used to sit in the footer, eight
  // screens down, where it could only be read by someone already convinced.
  const open = profile.availability && profile.availability.detail
    ? `<p class="stat-open">${profile.availability.detail}</p>`
    : "";

  band.innerHTML = `<div class="container">
      ${open}
      <div class="stat-band">${stats
        .map(
          (s) => `<div class="stat-big"><span class="stat-big-value">${s.value}</span>
                    <span class="stat-big-label">${s.label}</span></div>`
        )
        .join("")}</div>
    </div>`;
}

/* Two interactive maps, one section. A reader opens one of them, not both. */
function renderExplore() {
  const host = el("explore");
  if (!host) return;
  host.innerHTML =
    heading("globe", "Explore the Measurements", {
      tagline: "Interactive",
      subtitle:
        "Two of the studies run live on this page. Drag the year, switch the measure, pan the map.",
    }) +
    tabGroup("Explore the measurements", [
      { id: "lc", label: "Lahore District, 1993 to 2043", body: '<div id="landchange"></div>' },
      { id: "pk", label: "All of Pakistan, district by district", body: '<div id="pakmap"></div>' },
    ]);
}

/* The CV detail. A supervisor dips into one of these at a time, and stacked
   they were three and a half screens between the research and the contact
   details. */
function renderBackground() {
  const host = el("background");
  if (!host) return;
  host.innerHTML =
    heading("cap", "Background", {
      tagline: "Track record",
      subtitle:
        "Research posts, the toolkit behind the studies, and where the work has been presented.",
    }) +
    tabGroup("Background", [
      { id: "exp", label: "Experience", body: '<div id="experience"></div>' },
      { id: "skl", label: "Skills", body: '<div id="skills"></div>' },
      { id: "tlk", label: "Talks", body: '<div id="talks"></div>' },
      { id: "crt", label: "Certifications", body: '<div id="certifications"></div>' },
    ]);
}

function renderAbout(profile) {
  const eduCards = (profile.education || [])
    .map(
      (e) => `
      <div class="card edu-card">
        <div class="edu-degree">${e.degree}</div>
        <div class="edu-org">${e.institution}</div>
        ${e.period ? `<div class="edu-period">${e.period}</div>` : ""}
        ${(e.details || []).length ? `<ul>${e.details.map((d) => `<li>${d}</li>`).join("")}</ul>` : ""}
      </div>`
    )
    .join("");

  el("about").innerHTML = `
    <div class="split">
      <div>
        ${heading("user", "Research Statement", { tagline: "About", align: "start" })}
        ${profile.about.map((p) => `<p class="lede">${p}</p>`).join("")}
        <p class="meta-line">${profile.affiliation} · ${profile.location}</p>
      </div>
      <div>
        ${heading("cap", "Education", { tagline: "Background", align: "start" })}
        <div class="card-grid">${eduCards}</div>
      </div>
    </div>`;
}

/* Methods audit: four before/after pairs.
   The four measures have different units, so this is a comparison figure rather
   than one chart on a shared axis. Uses the emphasis pattern (one accent plus
   muted ink) and labels every value, so nothing is carried by colour alone. */
function renderMethodsAudit(profile) {
  const a = profile.methodsAudit;
  if (!a) return;
  const items = a.items
    .map(
      (m) => `
      <figure class="audit-card">
        <figcaption class="audit-method">${m.method}</figcaption>
        <div class="audit-pair">
          <div class="audit-side is-claimed">
            <span class="audit-value">${m.claimed}</span>
            <span class="audit-label">${m.claimedLabel}</span>
          </div>
          <span class="audit-arrow" aria-hidden="true">${ICONS.arrowRight}</span>
          <div class="audit-side is-actual">
            <span class="audit-value">${m.actual}</span>
            <span class="audit-label">${m.actualLabel}</span>
          </div>
        </div>
        <p class="audit-note">${m.note}</p>
      </figure>`
    )
    .join("");

  el("audit").innerHTML =
    heading("check", "Numbers That Hold Up", {
      tagline: "Verification",
      subtitle: "Four results that changed once the method was tested against itself. The figure on the right is the one that stands.",
    }) +
    `<div class="audit-legend">
       <span><i class="swatch is-claimed"></i>First answer</span>
       <span><i class="swatch is-actual"></i>What the checks left</span>
     </div>
     <div class="audit-grid">${items}</div>`;
}

function renderResearch(profile) {
  const items = (profile.researchInterests || [])
    .map(
      (r) => `
      <div class="card interest-card">
        <span class="icon-badge">${ICONS[r.icon] || ICONS.flask}</span>
        <h3>${r.title}</h3>
        <p>${r.description}</p>
      </div>`
    )
    .join("");
  // Two four-card grids that used to be two full-width sections in a row. Side
  // by side they read as the pair they are, what I want to work on and how I
  // work, and cost one row of height instead of four.
  const method = (profile.approach || [])
    .map(
      (a, i) => `
      <div class="card approach-card">
        <span class="approach-num">${String(i + 1).padStart(2, "0")}</span>
        <div>
          <h3>${a.title}</h3>
          <p>${a.description}</p>
        </div>
      </div>`
    )
    .join("");

  el("research").innerHTML =
    heading("flask", "Research Direction", {
      tagline: "Direction",
      subtitle: "Where I want to take this work in a PhD, and the standard I hold it to.",
    }) +
    `<div class="dual">
       <div>
         <h3 class="sub-head">Questions I want to take further</h3>
         <div class="card-grid">${items}</div>
       </div>
       <div>
         <h3 class="sub-head">How I work</h3>
         <div class="card-grid">${method}</div>
       </div>
     </div>`;
}

/* Education is rendered inside the Research Statement split by renderAbout.
   It used to be repeated as its own full section further down the page under
   the same heading, which was half a screen spent saying it twice. */

function renderExperience(profile) {
  el("experience").innerHTML =
    panelHeading("experience", "flask", "Research Experience", { tagline: "Experience" }) +
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
    heading("doc", "Publications", {
      tagline: "Papers",
      subtitle: "Peer-reviewed work, submitted and in preparation.",
    }) +
    publications
      .map((p) => {
        const prep = /prep/i.test(p.status) ? " is-prep" : "";
        return `
      <div class="card pub-card">
        <h3>${p.title}</h3>
        <div class="pub-meta">${p.authors} · ${p.journal} (${p.year})</div>
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
              ${
                (p.metrics || []).length
                  ? `<div class="stat-row">${p.metrics
                      .map(
                        (m) =>
                          `<div class="stat"><span class="stat-value">${m.value}</span><span class="stat-label">${m.label}</span></div>`
                      )
                      .join("")}</div>`
                  : ""
              }
              <p>${p.description}</p>
              ${
                (p.highlights || []).length
                  ? `<details class="method-notes">
                       <summary>How it was built (${p.highlights.length})</summary>
                       <ul class="highlights">${p.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>
                     </details>`
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
    ${heading("code", "Research Projects", {
      tagline: "Selected work",
      subtitle: `${projects.length} Earth observation studies over Pakistan, each designed and published end to end. Every one ships its code, its data and the range around its headline number.`,
    })}
    <div class="carousel" tabindex="0" aria-roledescription="carousel" aria-label="Projects">
      <div class="track">${slides}</div>
    </div>
    <div class="carousel-foot">
      <div class="carousel-nav">
        <button class="cbtn" type="button" data-dir="-1" aria-label="Previous project">${ICONS.chevronLeft}</button>
        <span class="counter"><span id="c-now">1</span> / ${projects.length}</span>
        <button class="cbtn" type="button" data-dir="1" aria-label="Next project">${ICONS.chevronRight}</button>
      </div>
      <div class="dots">${dots}</div>
    </div>`;

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

/* Hero parallax: the map plate drifts slower than the page, which reads as
   depth. Transform only, rAF-throttled, and skipped entirely under reduced
   motion, since the hero is still fully legible without it. */
function initParallax() {
  const bg = document.querySelector(".hero-bg");
  if (!bg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const hero = document.getElementById("hero");
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    // Stop computing once the hero has left the viewport.
    if (y < hero.offsetHeight) {
      bg.style.transform = `translate3d(0, ${y * 0.28}px, 0) scale(1.06)`;
    }
    ticking = false;
  };
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

/* Reading-progress bar. Purely decorative, so it degrades to nothing. */
function initProgressBar() {
  const bar = document.createElement("div");
  bar.className = "progress-bar";
  document.body.appendChild(bar);

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    bar.style.transform = `scaleX(${pct})`;
    ticking = false;
  };
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

/* Scroll-spy: mark which part of the story the reader is in.
   Uses scroll position rather than IntersectionObserver so that exactly one link
   is current at a time, including between sections and at the page ends. */
function initScrollSpy() {
  const links = [...document.querySelectorAll(".nav-links a")];
  const targets = links
    .map((a) => ({ link: a, section: document.querySelector(a.getAttribute("href")) }))
    .filter((t) => t.section);
  if (!targets.length) return;

  let ticking = false;
  const update = () => {
    const probe = window.scrollY + window.innerHeight * 0.3;
    let current = null;
    for (const t of targets) {
      if (t.section.offsetTop <= probe) current = t;
    }
    // Past the bottom, the last section wins even if it is short.
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      current = targets[targets.length - 1];
    }
    targets.forEach((t) => t.link.classList.toggle("is-current", t === current));
    ticking = false;
  };
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

/* Fade-up reveal as sections scroll into view.
   Deliberately fail-safe: this is decoration, so every path that could leave a
   section stuck at opacity 0 falls back to simply showing it. */
function initReveal() {
  // The hero runs its own entrance, so it is not a reveal target.
  const targets = [...document.querySelectorAll(".section")];
  const showAll = () => targets.forEach((t) => t.classList.add("revealed"));

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  targets.forEach((t) => t.classList.add("reveal"));

  // Mark the card grids so their children stagger in, and index each child so
  // the CSS can derive its delay.
  document.querySelectorAll(".card-grid, .audit-grid").forEach((grid) => {
    grid.classList.add("stagger");
    [...grid.children].forEach((child, i) => child.style.setProperty("--i", i));
  });

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

/* ===================== Lahore land-change scrubber =====================
   An interactive read of the CA-Markov projection: drag the year, the map
   cross-fades and the numbers count to the new epoch. Projected years are
   marked as projected everywhere they appear - on the badge, in the tick strip
   and in the readout - because the whole point of the study is that 2033 and
   2043 are modelled, not measured.

   All six tiles sit in the DOM at once and cross-fade by opacity. Swapping a
   single <img> src would flash on every step; stacking them does not, and six
   paletted PNGs come to about 750 KB in total. */
/* ------------------------- shared map plumbing -------------------------
   Both maps on this page are Leaflet, and both fetch it from a CDN on demand
   rather than blocking the first paint on a library most visitors never reach.
   One loader, one promise, so the second map costs nothing once the first has
   paid for it. */

/* Leaflet on demand. Resolves once window.L exists, rejects if either file
   fails, so the caller can put a fallback in place instead of a dead box. */
let leafletPromise = null;
function loadLeaflet() {
  if (leafletPromise) return leafletPromise;
  leafletPromise = new Promise((resolve, reject) => {
    if (window.L) return resolve(window.L);
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    css.integrity = "sha384-c6Rcwz4e4CITMbu/NBmnNS8yN2sC3cUElMEMfP3vqqKFp7GOYaaBBCqmaWBjmkjb";
    css.crossOrigin = "anonymous";
    document.head.appendChild(css);

    const js = document.createElement("script");
    js.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
    js.integrity = "sha384-cxOPjt7s7Iz04uaHJceBmS+qpjv2JkIHNVcuOrM+YHwZOmJGBXI00mdUXEq65HTH";
    js.crossOrigin = "anonymous";
    js.onload = () => (window.L ? resolve(window.L) : reject(new Error("Leaflet did not define L")));
    js.onerror = () => reject(new Error("Leaflet failed to load"));
    document.head.appendChild(js);
  });
  return leafletPromise;
}

/* Esri's Canvas basemaps: a grey base with no labels, and a separate reference
   layer that carries the place names. Quiet is the requirement here, because
   everything above the basemap is the actual data.

   These replaced CARTO, which began stamping "API KEY REQUIRED" diagonally
   across every tile it served. That is worth remembering before reaching for a
   free tile endpoint again: it can start asking for a key without notice, and
   the first you hear of it is a watermark across your own work. Esri's Canvas
   service is keyless and asks only for attribution, which is left switched on.
   If it ever does the same, both maps still carry their data and only lose the
   context underneath, and `dropTilesOnError` takes the broken tiles away. */
const BASEMAP = {
  light: {
    base: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    labels: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
  },
  dark: {
    base: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    labels: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
  },
  attribution:
    'Tiles &copy; <a href="https://www.esri.com">Esri</a>, HERE, Garmin, ' +
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

function themeName() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/* Enough tiles failing means the provider is gone, not that one request was
   unlucky. Pull the layer rather than leave a grid of broken tiles under the
   data; the surface colour behind it is already the right one. */
function dropTilesOnError(map, layer) {
  let errors = 0;
  layer.on("tileerror", () => {
    if (++errors < 6) return;
    layer.off("tileerror");
    map.removeLayer(layer);
  });
}

/* A basemap that redraws itself when the site theme flips. Labels ride above
   the base but below everything the caller adds afterwards, so they give
   context around the data without being drawn over the top of it. */
function addBasemap(L, map) {
  const opts = { attribution: BASEMAP.attribution, maxZoom: 16 };
  let base = null;
  let labels = null;

  const paint = () => {
    if (base) map.removeLayer(base);
    if (labels) map.removeLayer(labels);
    const set = BASEMAP[themeName()];
    base = L.tileLayer(set.base, opts).addTo(map);
    labels = L.tileLayer(set.labels, { maxZoom: 16, pane: "tilePane" }).addTo(map);
    dropTilesOnError(map, base);
    dropTilesOnError(map, labels);
  };

  paint();
  window.addEventListener("themechange", paint);
  return () => base;
}

/* The wheel belongs to the page on a document this tall, so a map only takes it
   after a deliberate click and hands it straight back when the pointer leaves. */
function wheelOnClick(map) {
  map.on("click", () => map.scrollWheelZoom.enable());
  map.on("mouseout", () => map.scrollWheelZoom.disable());
}

function renderLandChange(d) {
  const host = el("landchange");
  if (!host || !d || !d.years) return;

  const years = Object.keys(d.years).map(Number).sort((a, b) => a - b);
  const classIds = Object.keys(d.classes);
  const COLOURS = { "0": "#e26d4b", "1": "#5e9a6e", "2": "#6fb6d6", "3": "#c2a83e" };
  const START = Math.max(0, years.indexOf(2023));

  const tiles = years
    .map(
      (y, i) =>
        '<img class="lc-tile' + (i === START ? " is-on" : "") + '" data-year="' + y + '"' +
        ' src="assets/img/projects/lahore/tile_' + y + '.png"' +
        ' alt="Land cover of Lahore District in ' + y + '"' +
        ' loading="' + (i < 4 ? "eager" : "lazy") + '" decoding="async" />'
    )
    .join("");

  const ticks = years
    .map((y) => {
      const proj = d.years[String(y)].projected;
      return (
        '<button class="lc-tick' + (proj ? " is-proj" : "") + '" type="button"' +
        ' data-year="' + y + '" aria-label="Show ' + y + (proj ? ", projected" : "") + '">' +
        y + "</button>"
      );
    })
    .join("");

  const rows = classIds
    .map(
      (c) =>
        '<div class="lc-row">' +
        '<span class="lc-chip" style="--c:' + COLOURS[c] + '"></span>' +
        '<span class="lc-name">' + d.classes[c] + "</span>" +
        '<span class="lc-val"><b data-ha="' + c + '">0</b> ha</span>' +
        '<span class="lc-pct" data-pct="' + c + '">0%</span>' +
        '<span class="lc-bar"><i data-bar="' + c + '" style="--c:' + COLOURS[c] + '"></i></span>' +
        "</div>"
    )
    .join("");

  host.innerHTML =
    panelHeading("landchange", "leaf", "Thirty years measured, twenty projected", {
      tagline: "Land change, Lahore",
      subtitle:
        "Built-up land more than doubled between 1993 and 2023. The 2033 and 2043 steps are a CA-Markov projection, back-validated against years that could be checked before it was produced.",
    }) +
    '<div class="lc">' +
      '<figure class="lc-stage">' +
        '<div class="lc-plate">' + tiles + "</div>" +
        '<figcaption class="lc-badge"><span class="lc-year">2023</span>' +
        '<span class="lc-flag" hidden>projected</span></figcaption>' +
      "</figure>" +
      '<aside class="lc-panel">' +
        '<div class="lc-readout">' + rows + "</div>" +
        '<div class="lc-carbon">' +
          '<p class="lc-carbon-label">Carbon stock</p>' +
          '<p class="lc-carbon-value"><b data-carbon>0</b> <span>Mt C</span></p>' +
          '<p class="lc-carbon-band">range <span data-band>0</span> Mt C</p>' +
          '<p class="lc-carbon-note" data-delta></p>' +
        "</div>" +
        '<p class="lc-foot">District area ' +
          Number(d.districtAreaHa).toLocaleString() +
          " ha. Carbon uses IPCC Tier 1 cropland densities rather than forest " +
          "values; an earlier parameterisation overstated the loss 5.9-fold.</p>" +
      "</aside>" +
      '<div class="lc-controls">' +
        '<button class="lc-play" type="button" aria-label="Play the sequence">Play</button>' +
        '<input class="lc-range" type="range" min="0" max="' + (years.length - 1) +
          '" step="1" value="' + START + '" aria-label="Year" />' +
        '<div class="lc-ticks">' + ticks + "</div>" +
      "</div>" +
    "</div>";

  const wrap = host.querySelector(".lc");
  const plate = host.querySelector(".lc-plate");
  const range = host.querySelector(".lc-range");
  const play = host.querySelector(".lc-play");
  const badgeYear = host.querySelector(".lc-year");
  const badgeFlag = host.querySelector(".lc-flag");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Count a value up to its new target. Skipped entirely under reduced motion,
  // where an animating number is just a number that reads wrong for 400 ms.
  function countTo(node, target, fmt) {
    const from = Number(node.dataset.v || 0);
    node.dataset.v = target;
    if (reduce) {
      node.textContent = fmt(target);
      return;
    }
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min((now - t0) / 420, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      node.textContent = fmt(from + (target - from) * eased);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const intFmt = (v) => Math.round(v).toLocaleString();
  const base = d.years[String(years[0])];

  /* Which year is visible. Starts as a plain stack of <img> tiles, which is what
     shows if Leaflet never arrives, and is swapped for Leaflet image overlays
     once it does. Both paths cross-fade on the same CSS transition. */
  let paintYear = (year) =>
    plate.querySelectorAll(".lc-tile").forEach((t) =>
      t.classList.toggle("is-on", Number(t.dataset.year) === year)
    );

  /* The classified rasters are EPSG:4326 and the exporter already undid the
     geographic stretch by cos(latitude), so the PNGs carry the district at its
     true shape and drop straight onto the basemap at the raster's own bounds.
     Read from data/lulc/Lahore_2023_RF_LULC.tif; re-export and these move. */
  const LAHORE_BOUNDS = [
    [31.255982, 74.003483],
    [31.718165, 74.641376],
  ];

  function upgradeToMap(L) {
    const year = years[Number(range.value)];
    plate.innerHTML = "";
    const map = L.map(plate, {
      zoomControl: true,
      scrollWheelZoom: false,
      zoomSnap: 0.25,
      maxBounds: L.latLngBounds(LAHORE_BOUNDS).pad(1.2),
    });
    addBasemap(L, map);

    const overlays = {};
    years.forEach((y) => {
      const o = L.imageOverlay("assets/img/projects/lahore/tile_" + y + ".png",
                               LAHORE_BOUNDS,
                               { className: "lc-tile", opacity: 0, interactive: false });
      o.addTo(map);
      overlays[y] = o;
    });

    map.fitBounds(LAHORE_BOUNDS, { padding: [6, 6] });
    wheelOnClick(map);

    paintYear = (y) => years.forEach((yy) => overlays[yy].setOpacity(yy === y ? 1 : 0));
    paintYear(year);
    // The section can be inside a hidden tab panel when this runs, where Leaflet
    // measures the container as zero and paints a sliver of map.
    window.addEventListener("panelshown", () => map.invalidateSize());
    setTimeout(() => map.invalidateSize(), 50);
  }

  loadLeaflet()
    .then(upgradeToMap)
    .catch((e) => console.warn("Land-change basemap skipped:", e.message));

  function show(i) {
    const year = years[i];
    const rec = d.years[String(year)];

    paintYear(year);
    host.querySelectorAll(".lc-tick").forEach((t) =>
      t.classList.toggle("is-on", Number(t.dataset.year) === year)
    );

    badgeYear.textContent = year;
    badgeFlag.hidden = !rec.projected;
    wrap.classList.toggle("is-projected", !!rec.projected);

    classIds.forEach((c) => {
      countTo(host.querySelector('[data-ha="' + c + '"]'), rec.areaHa[c], intFmt);
      const pct = rec.sharePct[c];
      host.querySelector('[data-pct="' + c + '"]').textContent = pct.toFixed(1) + "%";
      host.querySelector('[data-bar="' + c + '"]').style.width = pct + "%";
    });

    countTo(host.querySelector("[data-carbon]"), rec.carbonMgC.best_Mg_C / 1e6,
            (v) => v.toFixed(2));
    host.querySelector("[data-band]").textContent =
      (rec.carbonMgC.low_Mg_C / 1e6).toFixed(2) + "-" +
      (rec.carbonMgC.high_Mg_C / 1e6).toFixed(2);

    const delta = rec.carbonMgC.best_Mg_C - base.carbonMgC.best_Mg_C;
    const note = host.querySelector("[data-delta]");
    note.textContent =
      year === years[0]
        ? "baseline year"
        : (delta < 0 ? "\u2212" : "+") + Math.abs(delta).toLocaleString() +
          " Mg C since " + years[0];
    note.classList.toggle("is-loss", delta < 0);
  }

  let timer = null;
  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
    play.textContent = "Play";
    play.setAttribute("aria-label", "Play the sequence");
  }

  range.addEventListener("input", () => {
    stop();
    show(Number(range.value));
  });

  host.querySelectorAll(".lc-tick").forEach((t) =>
    t.addEventListener("click", () => {
      stop();
      const i = years.indexOf(Number(t.dataset.year));
      range.value = i;
      show(i);
    })
  );

  play.addEventListener("click", () => {
    if (timer) {
      stop();
      return;
    }
    play.textContent = "Pause";
    play.setAttribute("aria-label", "Pause the sequence");
    timer = setInterval(() => {
      const next = (Number(range.value) + 1) % years.length;
      range.value = next;
      show(next);
    }, 1150);
  });

  show(Number(range.value));
}

/* ---------------------- Pakistan district map ----------------------
   A Leaflet choropleth over data/pakistan-districts.geojson, which
   scripts/build_pakistan_districts.py builds by running the live app's own
   analysis module against its cached GLC-FCS30D tables. The map and the app
   therefore cannot disagree: they are the same numbers.

   Leaflet is fetched from a CDN only once the section is actually approached.
   The rest of the site carries no third-party dependency and should not gain a
   blocking one for a section many visitors never scroll to. If the CDN is
   unreachable the section degrades to a link to the live app.

   Colour follows the job each metric does. Built-up share is a magnitude, so it
   takes one hue running light to dark. Carbon flux and vegetation change have a
   real zero, so they take two hues either side of a neutral midpoint. Dark mode
   gets its own steps rather than an inverted copy: on a dark surface the
   midpoint has to sit near the surface colour and the extremes have to be the
   bright end, which is the opposite arrangement to light mode. */

const PAK_RAMPS = {
  light: {
    diverging: ["#8f6a17", "#bd9430", "#dcbf6b", "#dfe3da", "#a9cfad", "#5d9a72", "#2c6045"],
    sequential: ["#e6efe1", "#c3ddc4", "#9bc6a6", "#6fa886", "#47866a", "#2c6045"],
    nodata: "#dce4d6",
    stroke: "#ffffff",
  },
  dark: {
    diverging: ["#eac96e", "#c29a3c", "#8a6f2a", "#3c4a42", "#3f7157", "#69ad83", "#a8dcb6"],
    sequential: ["#22322a", "#2f4d3c", "#417053", "#5c9670", "#7fbb92", "#a8dcb6"],
    nodata: "#2a3c33",
    stroke: "#16261f",
  },
};

const nf = (v, d = 0) =>
  Number(v).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

/* Breaks are fixed rather than quantile-derived, so the colour of a district
   means the same thing every time the page loads. They were chosen off the
   observed spread: the carbon breaks sit either side of zero at the quartiles,
   and the built-up breaks follow a roughly doubling progression because the
   distribution is heavily skewed by the few urban districts. */
const PAK_METRICS = {
  carbon: {
    key: "netMgCPerHa",
    kind: "diverging",
    button: "Carbon flux",
    title: "Net carbon flux per hectare, 2000 to 2022",
    breaks: [-2, -0.5, -0.1, 0.1, 0.5, 2],
    ends: ["2+ Mg C/ha lost", "no change", "2+ Mg C/ha gained"],
    fmt: (v) => (v > 0 ? "+" : "") + nf(v, 2) + " Mg C/ha",
    rank: "both",
    rankLabel: ["Largest net loss", "Largest net gain"],
  },
  builtup: {
    key: "builtupPct",
    kind: "sequential",
    button: "Built-up share",
    title: "Share of district classified built-up, 2022",
    breaks: [0.5, 1.5, 3, 6, 12],
    ends: ["under 0.5%", "", "over 12%"],
    fmt: (v) => nf(v, 2) + "%",
    rank: "high",
    rankLabel: ["Most built-up", ""],
  },
  veg: {
    key: "vegChangeHa",
    kind: "diverging",
    button: "Vegetation change",
    title: "Change in vegetated area, 2000 to 2022",
    breaks: [-20000, -5000, -1000, 1000, 5000, 20000],
    ends: ["20,000+ ha lost", "no change", "20,000+ ha gained"],
    fmt: (v) => (v > 0 ? "+" : "") + nf(v) + " ha",
    rank: "both",
    rankLabel: ["Largest vegetation loss", "Largest vegetation gain"],
  },
};

function pakRamp(metric) {
  return PAK_RAMPS[themeName()][metric.kind];
}

function pakColour(metric, value) {
  const ramp = pakRamp(metric);
  if (value === undefined || value === null) return PAK_RAMPS[themeName()].nodata;
  let i = 0;
  while (i < metric.breaks.length && value >= metric.breaks[i]) i++;
  return ramp[i];
}

function renderPakMap(fc) {
  const host = el("pakmap");
  if (!host || !fc || !fc.features) return;

  const withData = fc.features.filter((f) => f.properties.netMgC !== undefined);
  const totalMgC = withData.reduce((s, f) => s + f.properties.netMgC, 0);
  const m = fc.meta || {};

  const buttons = Object.keys(PAK_METRICS)
    .map(
      (k, i) =>
        '<button class="pm-tab' + (i === 0 ? " is-on" : "") + '" type="button" data-metric="' + k +
        '" aria-pressed="' + (i === 0) + '">' + PAK_METRICS[k].button + "</button>"
    )
    .join("");

  host.innerHTML =
    panelHeading("pakmap", "globe", "Every District in the Country", {
      tagline: "National map",
      subtitle:
        "Land cover and terrestrial carbon for Pakistan, 30 m pixels aggregated to districts. " +
        "The same tables drive the live app; this map is the quick read.",
    }) +
    '<div class="pm">' +
      '<div class="pm-tabs" role="group" aria-label="Choose a measure">' + buttons + "</div>" +
      '<div class="pm-stage">' +
        '<div class="pm-map" role="img" aria-label="Choropleth map of Pakistan districts. The ranked list below carries the same values."></div>' +
        '<div class="pm-hint">Click the map to zoom with the wheel</div>' +
      "</div>" +
      '<div class="pm-side">' +
        '<div class="pm-readout">' +
          '<p class="pm-place">Pakistan</p>' +
          '<p class="pm-prov">' + withData.length + " districts mapped</p>" +
          '<dl class="pm-figs"></dl>' +
        "</div>" +
        '<div class="pm-legend"></div>' +
        '<div class="pm-rank"></div>' +
      "</div>" +
      '<p class="pm-foot">' +
        "GLC-FCS30D at 30 m, " + m.yearFrom + " to " + m.yearTo + ", district tables from the " +
        '<a href="https://gee-lulc-pakistan.streamlit.app/" target="_blank" rel="noopener">live app</a>. ' +
        "Outlines from geoBoundaries. " + m.districtsWithData + " of " + m.districtsTotal +
        " districts carry a value, covering " + m.areaCoveredPct + "% of the accounted area; " +
        "Gilgit-Baltistan is held as one territory in the source, so its districts are drawn blank." +
      "</p>" +
    "</div>";

  const mapEl = host.querySelector(".pm-map");
  const legendEl = host.querySelector(".pm-legend");
  const rankEl = host.querySelector(".pm-rank");
  const figsEl = host.querySelector(".pm-figs");
  const placeEl = host.querySelector(".pm-place");
  const provEl = host.querySelector(".pm-prov");
  let metric = PAK_METRICS.carbon;
  let layer = null;
  let locked = null;

  const nationalFigs =
    '<div><dt>Net carbon flux</dt><dd>' + (totalMgC > 0 ? "+" : "") + nf(totalMgC / 1e6, 2) + " Tg C</dd></div>" +
    "<div><dt>Districts mapped</dt><dd>" + withData.length + "</dd></div>" +
    "<div><dt>Years</dt><dd>" + m.yearFrom + " to " + m.yearTo + "</dd></div>";

  function showNational() {
    placeEl.textContent = "Pakistan";
    provEl.textContent = withData.length + " districts mapped";
    figsEl.innerHTML = nationalFigs;
  }

  function showDistrict(p) {
    placeEl.textContent = p.name;
    provEl.textContent = p.province || "no district-level value in the source tables";
    figsEl.innerHTML =
      p.netMgC === undefined
        ? "<div><dt>Carbon flux</dt><dd>not resolved</dd></div>"
        : '<div><dt>Carbon flux</dt><dd>' + (p.netMgC > 0 ? "+" : "") + nf(p.netMgC / 1e6, 3) + " Tg C</dd></div>" +
          "<div><dt>Per hectare</dt><dd>" + PAK_METRICS.carbon.fmt(p.netMgCPerHa) + "</dd></div>" +
          "<div><dt>Built-up</dt><dd>" + PAK_METRICS.builtup.fmt(p.builtupPct) + "</dd></div>" +
          "<div><dt>Vegetation</dt><dd>" + PAK_METRICS.veg.fmt(p.vegChangeHa) + "</dd></div>";
  }

  function drawLegend() {
    const ramp = pakRamp(metric);
    legendEl.innerHTML =
      '<p class="pm-legend-title">' + metric.title + "</p>" +
      '<div class="pm-strip">' +
        ramp.map((c) => '<i style="--c:' + c + '"></i>').join("") +
      "</div>" +
      '<div class="pm-ends">' +
        metric.ends.map((t) => "<span>" + t + "</span>").join("") +
      "</div>" +
      '<p class="pm-nodata"><i style="--c:' + PAK_RAMPS[themeName()].nodata + '"></i>no value in the source</p>';
  }

  function drawRank() {
    const rows = withData
      .map((f) => f.properties)
      .filter((p) => p[metric.key] !== undefined)
      .sort((a, b) => b[metric.key] - a[metric.key]);
    const block = (title, list) =>
      title
        ? '<div class="pm-rank-block"><p class="pm-rank-title">' + title + "</p><ol>" +
          list
            .map(
              (p) =>
                '<li><button type="button" data-name="' + p.name + '">' +
                "<span>" + p.name + "</span><b>" + metric.fmt(p[metric.key]) + "</b></button></li>"
            )
            .join("") +
          "</ol></div>"
        : "";
    rankEl.innerHTML =
      metric.rank === "both"
        ? block(metric.rankLabel[0], rows.slice(-5).reverse()) + block(metric.rankLabel[1], rows.slice(0, 5))
        : block(metric.rankLabel[0], rows.slice(0, 8));
  }

  function style(feature) {
    const t = PAK_RAMPS[themeName()];
    return {
      fillColor: pakColour(metric, feature.properties[metric.key]),
      fillOpacity: 0.92,
      color: t.stroke,
      weight: 0.6,
      opacity: 0.9,
    };
  }

  function repaint() {
    if (layer) layer.setStyle(style);
    drawLegend();
    drawRank();
  }

  // Leaflet is only fetched once the section is within a screen of the viewport.
  // Most visitors never scroll this far, and the rest of the site has no
  // third-party dependency worth blocking the first paint for.
  function whenNear(fn) {
    if (!("IntersectionObserver" in window)) return fn();
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      io.disconnect();
      clearTimeout(backstop);
      fn();
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) go();
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(host);
    // A hidden tab produces no frames, so the observer never reports anything.
    // Every deferred thing on this page carries a timed backstop for that
    // reason; four seconds is long enough that a visible visitor has almost
    // always tripped the observer first.
    const backstop = setTimeout(go, 4000);
  }

  whenNear(() => loadLeaflet()
    .then((L) => {
      const map = L.map(mapEl, {
        zoomControl: true,
        scrollWheelZoom: false,
        zoomSnap: 0.25,
      });
      // The choropleth is opaque, so the basemap is not read through it. What it
      // gives is the surround: which districts touch India, which touch the sea,
      // where the mountains start. Without it the country floats on nothing.
      addBasemap(L, map);

      layer = L.geoJSON(fc, {
        style,
        onEachFeature: (feature, lyr) => {
          const p = feature.properties;
          lyr.bindTooltip(
            "<b>" + p.name + "</b>" +
              (p[metric.key] === undefined ? "" : "<br>" + metric.fmt(p[metric.key])),
            { sticky: true, className: "pm-tip" }
          );
          lyr.on("mouseover", () => {
            lyr.setStyle({ weight: 2, color: themeName() === "dark" ? "#e8f2e4" : "#243e36" });
            lyr.bringToFront();
            showDistrict(p);
          });
          lyr.on("mouseout", () => {
            layer.resetStyle(lyr);
            if (locked) showDistrict(locked);
            else showNational();
          });
          lyr.on("click", () => {
            locked = locked && locked.name === p.name ? null : p;
            if (locked) showDistrict(locked);
            else showNational();
          });
        },
      }).addTo(map);

      map.fitBounds(layer.getBounds(), { padding: [8, 8] });
      wheelOnClick(map);

      // This map is behind the second tab, so it is usually built while its
      // panel is hidden and Leaflet has measured the container as zero. The
      // first reveal needs a refit; later ones must only remeasure, or the
      // reader's own zoom would be thrown away every time they switch tabs.
      let fitted = !mapEl.closest(".tabpanel[hidden]");
      window.addEventListener("panelshown", () => {
        map.invalidateSize();
        if (!fitted && mapEl.getBoundingClientRect().width > 0) {
          map.fitBounds(layer.getBounds(), { padding: [8, 8] });
          fitted = true;
        }
      });

      // Tooltips are bound once, so switching metric has to rewrite them.
      function retip() {
        layer.eachLayer((lyr) => {
          const p = lyr.feature.properties;
          lyr.setTooltipContent(
            "<b>" + p.name + "</b>" +
              (p[metric.key] === undefined ? "" : "<br>" + metric.fmt(p[metric.key]))
          );
        });
      }

      host.querySelectorAll(".pm-tab").forEach((btn) => {
        btn.addEventListener("click", () => {
          metric = PAK_METRICS[btn.dataset.metric];
          host.querySelectorAll(".pm-tab").forEach((b) => {
            const on = b === btn;
            b.classList.toggle("is-on", on);
            b.setAttribute("aria-pressed", String(on));
          });
          repaint();
          retip();
        });
      });

      // The ranked list doubles as the keyboard and screen-reader route into the
      // map: every entry focuses, and picking one flies to that district.
      rankEl.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-name]");
        if (!btn) return;
        layer.eachLayer((lyr) => {
          if (lyr.feature.properties.name !== btn.dataset.name) return;
          locked = lyr.feature.properties;
          showDistrict(locked);
          map.fitBounds(lyr.getBounds(), { padding: [40, 40], maxZoom: 8 });
        });
      });

      window.addEventListener("themechange", repaint);
      showNational();
      repaint();
    })
    .catch((err) => {
      console.warn("District map skipped:", err.message);
      host.querySelector(".pm-stage").innerHTML =
        '<p class="pm-fallback">The interactive map could not load. ' +
        'The same account runs at <a href="https://gee-lulc-pakistan.streamlit.app/" ' +
        'target="_blank" rel="noopener">gee-lulc-pakistan.streamlit.app</a>.</p>';
      showNational();
      drawLegend();
      drawRank();
    }));

  // Painted immediately so the panel is never an empty box while Leaflet loads.
  showNational();
  drawLegend();
  drawRank();
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
    panelHeading("skills", "spark", "Skills", { tagline: "Toolkit" }) +
    `<div class="card-grid">${groups}</div>
     <h3 class="sub-head">Applied project skills</h3>
     <ul class="chip-list">${(profile.projectLevelSkills || [])
       .map((s) => `<li class="chip">${s}</li>`)
       .join("")}</ul>`;
}

function renderTalks(profile) {
  el("talks").innerHTML =
    panelHeading("talks", "mic", "Scientific Communication", { tagline: "Talks" }) +
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
    panelHeading("certifications", "award", "Certifications", { tagline: "Credentials" }) +
    `<div class="card-grid">${(profile.certifications || [])
      .map(
        (c) => `<div class="card cert-card"><span class="icon-badge">${ICONS.award}</span><span>${c}</span></div>`
      )
      .join("")}</div>`;
}

function renderFooter(profile) {
  el("contact").innerHTML = `
    <h2>Looking for a PhD position</h2>
    <p class="footer-lede">${profile.availability ? profile.availability.detail : ""}</p>
    <p><a class="btn-contact" href="mailto:${profile.email}">${ICONS.mail} ${profile.email}</a></p>
    ${socialRow(profile)}
    <p class="copyright">© ${new Date().getFullYear()} ${profile.name} · ${profile.location} · Built with plain HTML, CSS &amp; JS, hosted on GitHub Pages.</p>`;
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
    // The district map keeps its own light and dark ramps and has to restyle.
    window.dispatchEvent(new Event("themechange"));
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
    renderStats(profile, projects, publications);
    renderAbout(profile);
    // The grouped sections build their panels first. Every renderer below finds
    // its own node by id, and panelHeading() has to be able to see where that
    // node ended up.
    renderExplore();
    renderBackground();
    renderMethodsAudit(profile);
    renderResearch(profile);
    renderExperience(profile);
    renderPublications(publications);
    renderProjects(projects);

    // Loaded on its own and guarded: the scrubber is an enhancement, and a
    // missing or malformed data file must not take the rest of the page down
    // through the shared catch below.
    loadJson("data/pakistan-districts.geojson")
      .then(renderPakMap)
      .catch((e) => {
        console.warn("District map skipped:", e.message);
        dropPanel("pakmap");
      });

    loadJson("data/lahore-lulc.json")
      .then(renderLandChange)
      .catch((e) => {
        console.warn("Land-change scrubber skipped:", e.message);
        dropPanel("landchange");
      });
    renderSkills(profile);
    renderTalks(profile);
    renderCertifications(profile);
    renderFooter(profile);

    initTabs();
    initReveal();
    initParallax();
    initProgressBar();
    initScrollSpy();
  } catch (err) {
    console.error(err);
    document.querySelector("main").innerHTML =
      '<p style="padding:3rem;text-align:center;color:#8a7420">Could not load site content. Check the browser console for details.</p>';
  }
}

init();
