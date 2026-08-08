// Renders the whole site from data/*.json. Edit the JSON files to update
// content — this file only reads them and builds DOM; no content lives here.

const ICONS = {
  github:
    '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M0 1.15C0 .52.53 0 1.19 0h13.62C15.47 0 16 .52 16 1.15v13.7c0 .63-.53 1.15-1.19 1.15H1.19C.53 16 0 15.48 0 14.85V1.15Zm4.94 12.32V6.16H2.42v7.31h2.52ZM3.68 5.13c.88 0 1.43-.58 1.43-1.31-.02-.75-.55-1.31-1.41-1.31-.86 0-1.43.57-1.43 1.31 0 .73.55 1.31 1.39 1.31h.02Zm4.59 8.34V9.36c0-.22.02-.44.08-.6.18-.44.58-.9 1.27-.9.89 0 1.25.68 1.25 1.68v3.93h2.52V9.24c0-2.33-1.24-3.41-2.9-3.41-1.34 0-1.93.74-2.26 1.26v.03h-.02l.02-.03V6.16H5.71c.03.71 0 7.31 0 7.31h2.56Z"/></svg>',
  mail:
    '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M1.5 3A1.5 1.5 0 0 0 0 4.5v7A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 14.5 3h-13Zm0 1h13a.5.5 0 0 1 .5.5v.35l-7 4.38-7-4.38V4.5a.5.5 0 0 1 .5-.5Zm-.5 1.85 6.72 4.2a.5.5 0 0 0 .56 0L15 5.85V11.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V5.85Z"/></svg>',
};

function socialLinksHtml(profile) {
  return `
    <div class="social-links">
      <a href="${profile.social.github}" target="_blank" rel="noopener">${ICONS.github} GitHub</a>
      <a href="${profile.social.linkedin}" target="_blank" rel="noopener">${ICONS.linkedin} LinkedIn</a>
      <a href="mailto:${profile.email}">${ICONS.mail} Email</a>
    </div>`;
}

function renderHero(profile) {
  document.getElementById("hero").innerHTML = `
    <img class="hero-photo" src="${profile.photo}" alt="Photo of ${profile.name}" />
    <div class="hero-content">
      <h1>${profile.name}</h1>
      <p class="hero-tagline">${profile.tagline}</p>
      <p class="hero-location">${profile.location}</p>
      ${socialLinksHtml(profile)}
    </div>`;
}

function renderAbout(profile) {
  document.getElementById("about").innerHTML = `
    <h2>About</h2>
    ${profile.about.map((p) => `<p>${p}</p>`).join("")}
    <ul class="chip-list">
      ${profile.coreCompetencies.map((c) => `<li class="chip">${c}</li>`).join("")}
    </ul>`;
}

function renderEducation(profile) {
  document.getElementById("education").innerHTML = `
    <h2>Education</h2>
    ${profile.education
      .map(
        (e) => `
      <div class="timeline-item">
        <div class="timeline-meta">${e.degree} — ${e.institution}</div>
        ${e.period ? `<div class="timeline-period">${e.period}</div>` : ""}
        <ul>${e.details.map((d) => `<li>${d}</li>`).join("")}</ul>
      </div>`
      )
      .join("")}`;
}

function renderExperience(profile) {
  document.getElementById("experience").innerHTML = `
    <h2>Research Experience</h2>
    ${profile.experience
      .map(
        (e) => `
      <div class="timeline-item">
        <div class="timeline-meta">${e.role} — ${e.org}</div>
        <div class="timeline-period">${e.period}</div>
        <ul>${e.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
      </div>`
      )
      .join("")}`;
}

function renderPublications(publications) {
  document.getElementById("publications").innerHTML = `
    <h2>Publications</h2>
    ${publications
      .map(
        (p) => `
      <div class="publication-card">
        <h3>${p.title}</h3>
        <div class="publication-meta">${p.authors} — ${p.journal} (${p.year})</div>
        <span class="status-badge">${p.status}</span>
      </div>`
      )
      .join("")}`;
}

function renderProjects(projects) {
  document.getElementById("projects").innerHTML = `
    <h2>Projects</h2>
    <div class="projects-grid">
      ${projects
        .map(
          (p) => `
        <div class="project-card">
          <img src="${p.image}" alt="${p.title} preview" loading="lazy" />
          <div class="project-card-body">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <ul>${p.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>
            <div class="project-tags">
              ${p.tags.map((t) => `<span class="project-tag">${t}</span>`).join("")}
            </div>
            <div class="project-links">
              <a href="${p.repoUrl}" target="_blank" rel="noopener">View on GitHub</a>
              ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener">Live Demo</a>` : ""}
            </div>
          </div>
        </div>`
        )
        .join("")}
    </div>`;
}

function renderSkills(profile) {
  const groups = Object.entries(profile.skills)
    .map(
      ([group, items]) => `
      <div class="skills-group">
        <h3>${group}</h3>
        <ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>
      </div>`
    )
    .join("");
  document.getElementById("skills").innerHTML = `
    <h2>Skills</h2>
    <div class="skills-grid">${groups}</div>
    <h3 style="margin-top: var(--space-lg)">Applied Project Skills</h3>
    <ul class="chip-list">
      ${profile.projectLevelSkills.map((s) => `<li class="chip">${s}</li>`).join("")}
    </ul>`;
}

function renderTalks(profile) {
  document.getElementById("talks").innerHTML = `
    <h2>Scientific Communication</h2>
    ${profile.talks
      .map(
        (t) => `
      <div class="talk-item">
        <div class="talk-role">${t.role}</div>
        <div class="talk-period">${t.period}</div>
        <p>${t.detail}</p>
      </div>`
      )
      .join("")}`;
}

function renderCertifications(profile) {
  document.getElementById("certifications").innerHTML = `
    <h2>Certifications</h2>
    ${profile.certifications.map((c) => `<div class="cert-item">${c}</div>`).join("")}`;
}

function renderFooter(profile) {
  const year = new Date().getFullYear();
  document.getElementById("contact").innerHTML = `
    <h2 style="color: var(--white)">Get in touch</h2>
    ${socialLinksHtml(profile)}
    <p class="copyright">© ${year} ${profile.name}. Built with plain HTML, CSS &amp; JS — hosted on GitHub Pages.</p>`;
}

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

async function init() {
  try {
    const [profile, projects, publications] = await Promise.all([
      loadJson("data/profile.json"),
      loadJson("data/projects.json"),
      loadJson("data/publications.json"),
    ]);

    renderHero(profile);
    renderAbout(profile);
    renderEducation(profile);
    renderExperience(profile);
    renderPublications(publications);
    renderProjects(projects);
    renderSkills(profile);
    renderTalks(profile);
    renderCertifications(profile);
    renderFooter(profile);
  } catch (err) {
    console.error(err);
    document.querySelector("main").innerHTML =
      '<p style="padding:2rem;text-align:center;color:#7a2e2e">Could not load site content. Check the browser console for details.</p>';
  }
}

init();
