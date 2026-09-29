/* Signature motion.

   The reference site runs GSAP, ScrollTrigger and Lenis over a canvas depth
   field, with a handful of CSS keyframe loops on top. This is the same recipe
   minus Lenis: smooth-scroll hijacking fights the two Leaflet maps, the sticky
   nav's scroll-spy and every in-page anchor on this site, and native scrolling
   is good enough that the trade is not worth it.

   Everything in here is an enhancement over a page that already works. The
   libraries load after first paint, nothing waits on them, and if they never
   arrive the page keeps the CSS-only motion it shipped with. Every effect also
   checks prefers-reduced-motion before it starts.

   Loaded as a separate file rather than folded into main.js because main.js is
   the renderer and this is the choreography; they change for different reasons. */

(function () {
  "use strict";

  const reduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ libs */

  const GSAP = {
    core: {
      src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js",
      sri: "sha384-HOvlOYPIs/zjoIkWUGXkVmXsjr8GuZLV+Q+rcPwmJOVZVpvTSXQChiN4t9Euv9Vc",
    },
    scrollTrigger: {
      src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js",
      sri: "sha384-P8VzCVnT9NBUkMrpcIZrJbA7EBjJvh/fJS6PmP+4nLIM284DtsImIv8D0fFjIkeh",
    },
  };

  function script(def) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = def.src;
      s.integrity = def.sri;
      s.crossOrigin = "anonymous";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("failed: " + def.src));
      document.head.appendChild(s);
    });
  }

  async function loadGsap() {
    if (window.gsap && window.ScrollTrigger) return window.gsap;
    await script(GSAP.core);
    await script(GSAP.scrollTrigger);
    if (!window.gsap) throw new Error("gsap did not define itself");
    window.gsap.registerPlugin(window.ScrollTrigger);
    return window.gsap;
  }

  /* --------------------------------------------------- 1. hero text reveal */

  /* Splits a line into words wrapped in an overflow-hidden span, so each word
     can rise from behind its own edge. Words rather than characters: at this
     size a per-character stagger reads as a novelty effect, and a name is not
     something to make cute. */
  function splitWords(el) {
    if (el.dataset.split) return [...el.querySelectorAll(".w-in")];
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    const inners = words.map((w, i) => {
      const mask = document.createElement("span");
      mask.className = "w-mask";
      const inner = document.createElement("span");
      inner.className = "w-in";
      inner.textContent = w;
      mask.appendChild(inner);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
      return inner;
    });
    el.dataset.split = "1";
    return inners;
  }

  function heroText(gsap) {
    const name = document.querySelector(".hero-name");
    const claim = [...document.querySelectorAll(".hero-claim span")];
    const rest = [
      ".hero-eyebrow",
      ".hero-role",
      ".hero-foot",
    ].map((s) => document.querySelector(s)).filter(Boolean);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (name) {
      tl.from(splitWords(name), { yPercent: 118, duration: 0.9, stagger: 0.06 }, 0);
    }
    claim.forEach((line, i) => {
      tl.from(splitWords(line), { yPercent: 118, duration: 0.85, stagger: 0.045 },
              0.18 + i * 0.09);
    });
    tl.from(rest, { opacity: 0, y: 14, duration: 0.7, stagger: 0.09 }, 0.5);
    tl.from(".hero-mark", { opacity: 0, scale: 0.92, duration: 1.3, ease: "power2.out" }, 0);
  }

  /* ------------------------------------------------- 2. section title rise */

  function sectionTitles(gsap) {
    document.querySelectorAll(".sec-head h2").forEach((h) => {
      gsap.from(splitWords(h), {
        yPercent: 115,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: { trigger: h, start: "top 88%" },
      });
    });
    document.querySelectorAll(".sec-tagline, .sec-sub, .panel-note").forEach((p) => {
      gsap.from(p, {
        opacity: 0, y: 12, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: p, start: "top 92%" },
      });
    });
  }

  /* ------------------------------------------------ 3. the pinned stat scan */

  /* The stats band holds while the four numbers arrive one after another and a
     scan line crosses the block. This is the page's pin-and-scrub moment: the
     section stops, something happens, the page moves on. */
  function statScan(gsap) {
    const band = document.getElementById("stats");
    if (!band) return;
    const items = [...band.querySelectorAll(".stat-big")];
    if (!items.length) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: band,
        start: "top 72%",
        end: "bottom 60%",
        scrub: 0.6,
      },
    })
      .from(items, { opacity: 0.15, yPercent: 26, stagger: 0.5, ease: "none" })
      .fromTo(band, { "--scan": "0%" }, { "--scan": "100%", ease: "none" }, 0);
  }

  /* ------------------------------------- 4. projects: converge into the frame */

  /* The study frame assembles as it arrives rather than fading in as a block:
     media from one side, text from the other, metrics last. The reference uses
     the same move to introduce its big panels. */
  function projectEntrance(gsap) {
    const showcase = document.querySelector("#projects .showcase");
    if (!showcase) return;
    gsap.timeline({ scrollTrigger: { trigger: "#projects .carousel", start: "top 80%" } })
      .from("#projects .showcase-media", { xPercent: -6, opacity: 0, duration: 0.8, ease: "power3.out" }, 0)
      .from("#projects .showcase-body", { xPercent: 6, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.05)
      .from("#projects .stat", { y: 18, opacity: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" }, 0.35)
      .from("#projects .pfilter", { y: -10, opacity: 0, duration: 0.4, stagger: 0.05 }, 0);
  }

  /* --------------------------------------------------- 5. parallax the blocks */

  function blockParallax(gsap) {
    document.querySelectorAll(".band-tint, .band-invert").forEach((b) => {
      const inner = b.querySelector(".container");
      if (!inner) return;
      gsap.fromTo(inner, { y: 30 }, {
        y: -30, ease: "none",
        scrollTrigger: { trigger: b, start: "top bottom", end: "bottom top", scrub: 0.5 },
      });
    });
  }

  /* -------------------------------------------------- 6. magnetic buttons */

  /* The primary actions lean toward the pointer. Small travel, and it snaps
     back on leave, so it reads as responsive rather than slippery. */
  function magnetic(gsap) {
    if (matchMedia("(hover: none)").matches) return;
    document.querySelectorAll(".btn-primary, .btn-ghost, .scroll-cue").forEach((btn) => {
      const strength = 0.28;
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
          duration: 0.45, ease: "power3.out",
        });
      });
      btn.addEventListener("pointerleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.45)" });
      });
    });
  }

  /* ------------------------------------------------ 7. drag the orbit mark */

  /* The reference invites you to drag its circles. Here the same gesture tilts
     the orbit, which is the one interaction on this page that is also true:
     changing your viewing geometry is what you do with an orbit. It spins on
     its own until touched, and eases back to drifting when released. */
  function dragOrbit(gsap) {
    const mark = document.querySelector(".hero-mark");
    const svg = mark && mark.querySelector(".orbit");
    if (!svg) return;

    let tilt = 0, spin = 0, vx = 0, dragging = false, last = 0;
    mark.classList.add("is-draggable");

    const apply = () => {
      svg.style.transform = `rotateX(${tilt}deg) rotateZ(${spin}deg)`;
    };

    mark.addEventListener("pointerdown", (e) => {
      dragging = true;
      last = e.clientX;
      mark.setPointerCapture(e.pointerId);
      mark.classList.add("is-dragging");
    });
    mark.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - last;
      last = e.clientX;
      vx = dx * 0.35;
      spin += vx;
      tilt = Math.max(-26, Math.min(26, tilt + e.movementY * -0.12));
      apply();
    });
    const release = () => {
      if (!dragging) return;
      dragging = false;
      mark.classList.remove("is-dragging");
      // Let the throw decay instead of stopping dead, then return to level.
      gsap.to({ v: vx }, {
        v: 0, duration: 1.6, ease: "power2.out",
        onUpdate() { spin += this.targets()[0].v; apply(); },
      });
      gsap.to({ t: tilt }, {
        t: 0, duration: 1.8, ease: "power2.inOut",
        onUpdate() { tilt = this.targets()[0].t; apply(); },
      });
    };
    mark.addEventListener("pointerup", release);
    mark.addEventListener("pointercancel", release);
  }

  /* --------------------------------------------------------- backstop */

  /* gsap.from() hides a word the instant it is set up and only shows it when
     its trigger fires. If a trigger is measured against a layout that then
     changes, or never fires because the tab was in the background, a heading
     is left invisible. This site has shipped that bug before, so: anything
     already scrolled past that is still hidden gets cleared outright.

     It runs on a timer and again on every refresh, and it only ever makes text
     more visible, never less. */
  function revealBackstop(gsap) {
    const sweep = () => {
      const limit = window.scrollY + window.innerHeight;
      document.querySelectorAll(".w-in").forEach((w) => {
        const mask = w.parentElement;
        if (!mask) return;
        const top = mask.getBoundingClientRect().top + window.scrollY;
        if (top > limit) return;                   // not reached yet, leave it
        const t = getComputedStyle(w).transform;
        if (t && t !== "none" && !t.includes("matrix(1, 0, 0, 1, 0, 0)")) {
          gsap.set(w, { clearProps: "transform,opacity" });
        }
      });
    };
    setTimeout(sweep, 4000);
    window.addEventListener("load", () => setTimeout(sweep, 1200));
    // A reader who lands mid-page, or returns to a backgrounded tab, is the
    // case the timer alone does not cover.
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) setTimeout(sweep, 400);
    });
  }

  /* ------------------------------------------------------------ 8. boot */

  function start() {
    if (reduced()) return;
    loadGsap()
      .then((gsap) => {
        heroText(gsap);
        sectionTitles(gsap);
        statScan(gsap);
        projectEntrance(gsap);
        blockParallax(gsap);
        magnetic(gsap);
        dragOrbit(gsap);
        document.documentElement.classList.add("motion-on");
        // Sections render from JSON after this file runs, and tab panels change
        // height when opened, so the trigger positions have to be recomputed.
        window.ScrollTrigger.refresh();
        window.addEventListener("panelshown", () => window.ScrollTrigger.refresh());
        window.addEventListener("load", () => window.ScrollTrigger.refresh());
        revealBackstop(gsap);
      })
      .catch((e) => console.warn("Signature motion skipped:", e.message));
  }

  // The renderers build the DOM this choreographs, so wait for them to finish.
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(start, 350);
  } else {
    document.addEventListener("DOMContentLoaded", () => setTimeout(start, 350));
  }
})();
