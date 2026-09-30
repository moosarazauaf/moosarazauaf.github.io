/* The hero graph, made live, and the cursor that follows the reader.

   main.js draws the constellation complete and static: every node at its home
   position, every edge in place, every click wired. This file only adds
   behaviour on top, so if it fails to load the diagram is still whole and
   still navigable. It needs no library.

   Three things happen here:

   1. The graph moves. Nodes orbit their shells, lean toward the pointer as if
      it had mass, and can be dragged. Edges are springs, so dragging one study
      tugs the studies it shares a method with, which is the behaviour of an
      Obsidian graph and the reason the edges mean something.
   2. Hovering a study lights it and its neighbours and dims the rest, with a
      label saying what it is and how many studies it links to.
   3. A cursor follower trails the pointer across the whole page and swells
      over anything clickable, which is the reference site's most noticeable
      effect.

   All of it is skipped under reduced motion or on a device with no hover. */

(function () {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ================================================================= graph */

  function graph() {
    const svg = document.querySelector(".cons");
    const mark = document.querySelector(".hero-mark");
    if (!svg || !mark) return;

    const C = 500;
    const nodeEls = [...svg.querySelectorAll(".cons-node")];
    if (!nodeEls.length) return;

    const nodes = nodeEls.map((el) => {
      const m = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(el.getAttribute("transform") || "");
      const x = m ? +m[1] : C, y = m ? +m[2] : C;
      return { el, slug: el.dataset.slug, r: +el.dataset.r, a: +el.dataset.a,
               x, y, vx: 0, vy: 0, hx: x, hy: y };
    });
    const bySlug = Object.fromEntries(nodes.map((n) => [n.slug, n]));

    const links = [...svg.querySelectorAll(".cons-link")]
      .map((el) => ({ el, a: bySlug[el.dataset.a], b: bySlug[el.dataset.b] }))
      .filter((l) => l.a && l.b);

    const spokes = Object.fromEntries(
      [...svg.querySelectorAll(".cons-spoke")].map((el) => [el.dataset.slug, el]));
    const self = svg.querySelector(".cons-self");

    const neighbours = Object.fromEntries(nodes.map((n) => [n.slug, new Set()]));
    links.forEach((l) => { neighbours[l.a.slug].add(l.b); neighbours[l.b.slug].add(l.a); });

    // Rest length of each spring is the distance between the two homes, so at
    // rest the springs pull nothing out of orbit. They only act once something
    // is disturbed, which is exactly when they should.
    const homeOf = (n, theta) => {
      const a = ((n.a + theta - 90) * Math.PI) / 180;
      return [C + n.r * Math.cos(a), C + n.r * Math.sin(a)];
    };

    const spin = svg.querySelector(".cons-spin");
    svg.classList.add("is-live");   // JS takes over the rotation from the CSS

    /* ---------------------------------------------------- pointer mapping */

    const toSvg = (cx, cy) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const pt = svg.createSVGPoint();
      pt.x = cx; pt.y = cy;
      return pt.matrixTransform(ctm.inverse());
    };
    const toScreen = (x, y) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const pt = svg.createSVGPoint();
      pt.x = x; pt.y = y;
      return pt.matrixTransform(ctm);
    };

    let pointer = null;           // in SVG units, or null when away
    let dragging = null;
    let dragMoved = false;
    let downAt = null;
    let hovered = null;

    mark.addEventListener("pointermove", (e) => {
      const p = toSvg(e.clientX, e.clientY);
      pointer = p ? { x: p.x, y: p.y } : null;
      if (dragging && downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 5) {
        dragMoved = true;
      }
    });
    mark.addEventListener("pointerleave", () => { pointer = null; });

    mark.addEventListener("pointerdown", (e) => {
      const el = e.target.closest(".cons-node");
      if (!el) return;
      dragging = bySlug[el.dataset.slug];
      dragMoved = false;
      downAt = { x: e.clientX, y: e.clientY };
      el.setPointerCapture?.(e.pointerId);
      mark.classList.add("is-dragging");
      focus(dragging);
    });
    const release = () => {
      if (!dragging) return;
      mark.classList.remove("is-dragging");
      dragging = null;
      if (!hovered) unfocus();
    };
    mark.addEventListener("pointerup", release);
    mark.addEventListener("pointercancel", release);

    // A drag ends in a click event on the node. Swallow that one so a study is
    // only opened by a deliberate click, never by letting go of a drag. Capture
    // phase, so this runs before the handler in main.js sees it.
    mark.addEventListener("click", (e) => {
      if (dragMoved) {
        e.stopImmediatePropagation();
        e.preventDefault();
        dragMoved = false;
      }
    }, true);

    /* ------------------------------------------------------ focus + label */

    const tip = document.createElement("div");
    tip.className = "cons-tip";
    tip.setAttribute("aria-hidden", "true");
    mark.appendChild(tip);

    function focus(n) {
      svg.classList.add("is-focusing");
      const near = neighbours[n.slug];
      nodes.forEach((m) => m.el.classList.toggle("is-lit", m === n || near.has(m)));
      links.forEach((l) => l.el.classList.toggle("is-lit", l.a === n || l.b === n));
      Object.entries(spokes).forEach(([slug, el]) => el.classList.toggle("is-lit", slug === n.slug));
      const count = near.size;
      tip.innerHTML =
        `<span class="cons-tip-group">${n.el.dataset.group}</span>` +
        `<span class="cons-tip-title">${n.el.dataset.title}</span>` +
        `<span class="cons-tip-meta">Linked to ${count} ${count === 1 ? "study" : "studies"} · click to open</span>`;
      tip.classList.add("is-on");
    }
    function unfocus() {
      svg.classList.remove("is-focusing");
      nodes.forEach((m) => m.el.classList.remove("is-lit"));
      links.forEach((l) => l.el.classList.remove("is-lit"));
      Object.values(spokes).forEach((el) => el.classList.remove("is-lit"));
      svg.classList.remove("is-self");
      tip.classList.remove("is-on");
    }

    /* The portrait is the centre of gravity. Hovering it lights every study
       and every spoke at once: one person, all of the work. */
    let onSelf = false;
    function focusSelf() {
      onSelf = true;
      svg.classList.add("is-focusing", "is-self");
      nodes.forEach((m) => m.el.classList.add("is-lit"));
      Object.values(spokes).forEach((el) => el.classList.add("is-lit"));
      const themes = new Set(nodes.map((m) => m.el.dataset.group)).size;
      tip.innerHTML =
        `<span class="cons-tip-group">The centre of gravity</span>` +
        `<span class="cons-tip-title">Every study here was designed, built and published by one person</span>` +
        `<span class="cons-tip-meta">${nodes.length} studies · ${themes} themes · click for the research statement</span>`;
      tip.classList.add("is-on");
    }
    if (self) {
      self.addEventListener("pointerenter", focusSelf);
      self.addEventListener("pointerleave", () => { onSelf = false; if (!hovered && !dragging) unfocus(); });
      self.addEventListener("focus", focusSelf);
      self.addEventListener("blur", () => { onSelf = false; unfocus(); });
    }

    nodes.forEach((n) => {
      n.el.addEventListener("pointerenter", () => { hovered = n; focus(n); });
      n.el.addEventListener("pointerleave", () => { hovered = null; if (!dragging) unfocus(); });
      // Keyboard users get the same highlight and label on focus.
      n.el.addEventListener("focus", () => { hovered = n; focus(n); });
      n.el.addEventListener("blur", () => { hovered = null; unfocus(); });
    });

    const placeTip = () => {
      if (onSelf && !dragging && !hovered && tip.classList.contains("is-on")) {
        // Centred under the portrait, clear of the halo. Placed beside it, the
        // label flipped left to stay on screen and landed on the face it was
        // describing.
        const s = toScreen(C, C + 136);
        const box = mark.getBoundingClientRect();
        if (!s) return;
        const w = tip.offsetWidth || 260;
        const x = Math.max(12, Math.min(window.innerWidth - 12 - w, s.x - w / 2));
        tip.style.transform = `translate(${Math.round(x - box.left)}px, ${Math.round(s.y - box.top)}px)`;
        return;
      }
      const n = dragging || hovered;
      if (!n || !tip.classList.contains("is-on")) return;
      const s = toScreen(n.x, n.y);
      const box = mark.getBoundingClientRect();
      if (!s) return;
      // Most studies sit on the right of the page, where a label drawn to the
      // right of its node would run off the screen. Flip it to the left
      // whenever it would not fit, measured against the viewport, not the
      // diagram, because the diagram itself bleeds past the right edge.
      const w = tip.offsetWidth || 260;
      const rightSide = s.x + 22 + w > window.innerWidth - 12;
      const x = rightSide ? s.x - 22 - w : s.x + 22;
      tip.style.transform =
        `translate(${Math.round(x - box.left)}px, ${Math.round(s.y - box.top - 18)}px)`;
    };

    /* -------------------------------------------------------- simulation */

    let theta = 0, last = performance.now(), running = false, raf = 0;

    function step(now) {
      if (!running) return;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      // One clock for shells and nodes, so labels and studies stay in step.
      // It slows right down while the reader is inside the diagram, rather
      // than stopping dead, so it never looks frozen.
      theta += dt * (pointer ? 0.6 : 3);
      // A CSS transform, pivoting on the transform-origin the stylesheet
      // already gives this group (500px 500px, the centre of the viewBox).
      // The SVG attribute form, rotate(t 500 500), must not be used here: the
      // browser maps that attribute onto the same CSS property and applies the
      // stylesheet's transform-origin on top of it, so the two offsets stack
      // and the shells swing round a point far off the diagram. That put the
      // rings' centre at (1898, 708) while the studies sat at (1122, 523).
      spin.style.transform = `rotate(${theta.toFixed(3)}deg)`;

      for (const n of nodes) {
        const [hx, hy] = homeOf(n, theta);
        n.hx = hx; n.hy = hy;
        if (n === dragging && pointer) {
          n.vx = (pointer.x - n.x) / Math.max(dt, 0.001) * 0.3;
          n.vy = (pointer.y - n.y) / Math.max(dt, 0.001) * 0.3;
          n.x = pointer.x; n.y = pointer.y;
          continue;
        }
        let fx = 18 * (hx - n.x), fy = 18 * (hy - n.y);   // back to orbit

        // The pointer has mass. Nodes within reach lean toward it, falling
        // off with distance, and the orbital spring keeps them from being
        // pulled in all the way.
        if (pointer && !dragging) {
          const dx = pointer.x - n.x, dy = pointer.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d > 1 && d < 230) {
            const k = 1 - d / 230;
            fx += (dx / d) * 1500 * k * k;
            fy += (dy / d) * 1500 * k * k;
          }
        }
        n.fx = fx; n.fy = fy;
      }

      // Edges are springs. At rest they pull nothing; disturb one study and
      // the studies it shares a method with feel it.
      for (const l of links) {
        const { a, b } = l;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const rest = Math.hypot(b.hx - a.hx, b.hy - a.hy);
        // Stiff enough that dragging one study visibly drags its neighbours,
        // which is the whole point of drawing the edges; at 3.2 a 180px drag
        // moved a neighbour 9px, too little to read as a connection.
        const f = 8 * (d - rest);
        const ux = dx / d, uy = dy / d;
        if (a !== dragging) { a.fx += f * ux; a.fy += f * uy; }
        if (b !== dragging) { b.fx -= f * ux; b.fy -= f * uy; }
      }

      for (const n of nodes) {
        if (n === dragging) continue;
        n.vx = (n.vx + n.fx * dt) * Math.exp(-7 * dt);
        n.vy = (n.vy + n.fy * dt) * Math.exp(-7 * dt);
        n.x += n.vx * dt;
        n.y += n.vy * dt;
      }

      for (const n of nodes) {
        n.el.setAttribute("transform", `translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})`);
      }
      for (const n of nodes) {
        const sp = spokes[n.slug];
        if (sp) { sp.setAttribute("x2", n.x.toFixed(1)); sp.setAttribute("y2", n.y.toFixed(1)); }
      }
      for (const l of links) {
        l.el.setAttribute("x1", l.a.x.toFixed(1));
        l.el.setAttribute("y1", l.a.y.toFixed(1));
        l.el.setAttribute("x2", l.b.x.toFixed(1));
        l.el.setAttribute("y2", l.b.y.toFixed(1));
      }
      placeTip();

      raf = requestAnimationFrame(step);
    }

    function play(on) {
      if (on === running) return;
      running = on;
      if (on) { last = performance.now(); raf = requestAnimationFrame(step); }
      else cancelAnimationFrame(raf);
    }

    // Nothing below the hero can see this, so it stops the moment the hero
    // leaves the screen or the tab is hidden.
    let visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => {
        visible = es[0].isIntersecting;
        play(visible && !document.hidden);
      }).observe(mark);
    }
    document.addEventListener("visibilitychange", () => play(visible && !document.hidden));
    play(true);
  }

  /* =============================================================== cursor */

  /* A dot that tracks the pointer closely and a ring that trails it. The
     native cursor stays: a follower is an accent, and hiding the real pointer
     costs precision everywhere, the maps above all. */
  function cursor() {
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cur-dot";
    ring.className = "cur-ring";
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");
    document.body.append(ring, dot);

    let tx = -100, ty = -100, dx = tx, dy = ty, rx = tx, ry = ty, shown = false;

    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX; ty = e.clientY;
      if (!shown) {
        dx = rx = tx; dy = ry = ty;
        shown = true;
        document.documentElement.classList.add("cur-on");
      }
      // Swell over anything that does something when clicked.
      const t = e.target;
      const hot = t.closest && t.closest(
        "a, button, [role='link'], [role='button'], .cons-node, .cons-label, .cons-self, .tick-item, summary, input, .leaflet-interactive"
      );
      ring.classList.toggle("is-hot", !!hot);
      ring.classList.toggle("is-node", !!(t.closest && t.closest(".cons-node, .cons-self")));
    }, { passive: true });

    document.addEventListener("pointerleave", () => {
      shown = false;
      document.documentElement.classList.remove("cur-on");
    });
    addEventListener("pointerdown", () => ring.classList.add("is-down"));
    addEventListener("pointerup", () => ring.classList.remove("is-down"));

    const tick = () => {
      dx += (tx - dx) * 0.45;
      dy += (ty - dy) * 0.45;
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      dot.style.transform = `translate(${dx}px, ${dy}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ============================================================= previews */

  /* Obsidian's page preview. Hover any mention of a study anywhere on the page
     and a card shows what it is before you commit to the click: the figure,
     the theme, the headline numbers, and why it is linked to the study you are
     reading, where that applies.

     This is information, not decoration, so it runs under reduced motion too;
     only its fade is dropped. Keyboard focus shows it as well. On touch it
     stays out of the way, because a tap is already the click. */
  function previews() {
    const card = document.createElement("div");
    card.className = "peek";
    card.setAttribute("aria-hidden", "true");
    document.body.appendChild(card);

    const slugOf = (p) => p.repoUrl.replace(/\/+$/, "").split("/").pop();
    let timer = 0, current = null;

    function fill(a) {
      const all = window.__projects || [];
      const p = all.find((x) => slugOf(x) === a.dataset.study);
      if (!p) return false;
      const g = window.__studyGraph ? window.__studyGraph(all) : null;
      const n = g ? (g.links[a.dataset.study] || []).length : 0;
      const metrics = (p.metrics || []).slice(0, 3)
        .map((m) => `<span class="peek-m"><b>${m.value}</b>${m.label}</span>`).join("");
      card.innerHTML =
        (p.image ? `<img class="peek-img" src="${p.image}" alt="" loading="eager" decoding="async" />` : "") +
        `<span class="peek-group">${p.theme || "Study"}</span>` +
        `<span class="peek-title">${p.title}</span>` +
        (metrics ? `<span class="peek-metrics">${metrics}</span>` : "") +
        (a.dataset.why ? `<span class="peek-why">Linked by ${a.dataset.why}</span>` : "") +
        `<span class="peek-foot">${n} linked ${n === 1 ? "study" : "studies"} · click to open</span>`;
      return true;
    }

    function place(a) {
      const r = a.getBoundingClientRect();
      const w = card.offsetWidth || 300, h = card.offsetHeight || 260;
      let x = r.left + r.width / 2 - w / 2;
      x = Math.max(12, Math.min(window.innerWidth - 12 - w, x));
      // Below the link if it fits, above it if not.
      let y = r.bottom + 10;
      if (y + h > window.innerHeight - 12) y = Math.max(12, r.top - 10 - h);
      card.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    }

    function show(a) {
      if (!fill(a)) return;
      card.classList.add("is-on");
      place(a);
      // The figure changes the card's height once it has loaded.
      const img = card.querySelector("img");
      if (img && !img.complete) img.addEventListener("load", () => current === a && place(a), { once: true });
    }
    function hide() {
      clearTimeout(timer);
      current = null;
      card.classList.remove("is-on");
    }

    document.addEventListener("pointerover", (e) => {
      if (e.pointerType !== "mouse") return;
      const a = e.target.closest && e.target.closest("a[data-study]");
      if (!a || a === current) return;
      current = a;
      clearTimeout(timer);
      timer = setTimeout(() => current === a && show(a), 220);   // not on a pass-over
    });
    document.addEventListener("pointerout", (e) => {
      const a = e.target.closest && e.target.closest("a[data-study]");
      if (!a || (e.relatedTarget && a.contains(e.relatedTarget))) return;
      hide();
    });
    document.addEventListener("focusin", (e) => {
      const a = e.target.closest && e.target.closest("a[data-study]");
      if (a) { current = a; show(a); }
    });
    document.addEventListener("focusout", (e) => {
      if (e.target.closest && e.target.closest("a[data-study]")) hide();
    });
    addEventListener("scroll", hide, { passive: true });
    document.addEventListener("click", hide);
  }

  /* ============================================================ spotlight */

  /* Every panel carries a soft light that follows the pointer across it, so
     the cursor has something to answer it in every section rather than only
     in the hero. It is one gradient positioned by two custom properties, and
     only the panel under the pointer is ever touched. */
  function spotlight() {
    const SEL = ".card, .slide .showcase, .audit-card, .pub-card, .exp-card, .pm-readout, .lc-panel";
    let last = null;
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const c = e.target.closest && e.target.closest(SEL);
      if (last && last !== c) last.classList.remove("has-spot");
      last = c;
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`);
      c.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`);
      c.classList.add("has-spot");
    }, { passive: true });
  }

  /* ================================================================= boot */

  function start() {
    if (reduced) return;
    graph();
    if (finePointer) { cursor(); spotlight(); }
  }

  // Previews are information, not motion, so they do not wait for the hero
  // graph and do not stop for reduced motion.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", previews);
  else previews();

  // The hero is rendered from JSON by main.js, so wait until it exists.
  const ready = () => {
    if (document.querySelector(".cons-node")) return start();
    let tries = 0;
    const wait = setInterval(() => {
      if (document.querySelector(".cons-node") || ++tries > 40) {
        clearInterval(wait);
        if (document.querySelector(".cons-node")) start();
      }
    }, 100);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
