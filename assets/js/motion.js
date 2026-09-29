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
        start: "top 88%",
        end: "bottom 78%",
        scrub: 0.6,
      },
    })
      // No fade on the numbers at all. Anything under full opacity costs
      // contrast against the gold, and these four were measured at 9.66:1 on
      // the assumption they are opaque. A reader who stops mid-scrub must not
      // be the one who gets the unreadable version, so the sequence is carried
      // entirely by the movement and the scan line.
      .from(items, { yPercent: 22, stagger: 0.4, ease: "none" })
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

  /* --------------------------------------------- 9. the depth field */

  /* The reference runs a canvas behind everything it calls "Tiefe", depth.
     Here that field is the view from orbit: stars at three distances drifting
     at three speeds, crossed occasionally by a satellite track.

     Deliberately cheap. Around 120 points, no per-frame allocation, a device
     pixel ratio capped at 2, and the loop stops entirely when the tab is
     hidden or the hero has scrolled away, because a background animation that
     keeps running off-screen is just a battery drain. */
  function depthField() {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const canvas = document.createElement("canvas");
    canvas.className = "depth-field";
    canvas.setAttribute("aria-hidden", "true");
    hero.insertBefore(canvas, hero.firstChild);
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue("--accent").trim() || "#d4b948";
    const sage = css.getPropertyValue("--sage").trim() || "#7ca982";

    let w = 0, h = 0, dpr = 1, stars = [], track = null, running = false, raf = 0;

    function size() {
      const r = hero.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const n = Math.round(Math.min(150, Math.max(50, (w * h) / 11000)));
      stars = Array.from({ length: n }, () => {
        const depth = Math.random();            // 0 far, 1 near
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.4 + depth * 1.5,
          v: 0.02 + depth * 0.10,               // near points drift faster
          a: 0.18 + depth * 0.5,
          warm: Math.random() < 0.14,           // a few carry the accent
        };
      });
    }

    function newTrack() {
      // A pass across the frame every so often, at the shallow angle a
      // near-polar orbit actually crosses a scene.
      track = { x: -0.15 * w, y: h * (0.2 + Math.random() * 0.6), v: 0.9 + Math.random() * 0.5 };
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        s.x -= s.v;
        if (s.x < -2) { s.x = w + 2; s.y = Math.random() * h; }
        ctx.globalAlpha = s.a;
        ctx.fillStyle = s.warm ? accent : sage;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!track && Math.random() < 0.0022) newTrack();
      if (track) {
        track.x += track.v;
        track.y -= track.v * 0.26;
        const grad = ctx.createLinearGradient(track.x - 150, track.y + 39, track.x, track.y);
        grad.addColorStop(0, "rgba(212,185,72,0)");
        grad.addColorStop(1, "rgba(212,185,72,0.5)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(track.x - 150, track.y + 39);
        ctx.lineTo(track.x, track.y);
        ctx.stroke();
        if (track.x > w + 160) track = null;
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function play(on) {
      if (on === running) return;
      running = on;
      if (on) raf = requestAnimationFrame(frame);
      else cancelAnimationFrame(raf);
    }

    size();
    addEventListener("resize", size, { passive: true });
    document.addEventListener("visibilitychange", () => play(!document.hidden && onScreen));

    // Stop as soon as the hero leaves: nothing below it can see this canvas.
    let onScreen = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (es) => { onScreen = es[0].isIntersecting; play(onScreen && !document.hidden); },
        { threshold: 0 }
      ).observe(hero);
    }
    play(true);
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
        depthField();
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
