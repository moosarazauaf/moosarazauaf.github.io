import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { startSceneTracker } from "../animations/scrollAnimations";
import { useLenis } from "../hooks/useLenis";
import { useFinePointer, useMobile } from "../hooks/useMediaQuery";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { scene, type SceneKey } from "../three/sceneState";
import { startAnalytics } from "../lib/analytics";
import { CustomCursor } from "../components/cursor/CustomCursor";
import { Navigation } from "../components/navigation/Navigation";
import { MenuOverlay } from "../components/navigation/MenuOverlay";
import { Hero } from "../components/hero/Hero";
import { ResearchSection } from "../components/research/ResearchSection";
import { SensingSection } from "../components/sensing/SensingSection";
import { ProjectsSection } from "../components/projects/ProjectsSection";
import { ProjectOverlay } from "../components/projects/ProjectOverlay";
import { SoftwareSection } from "../components/software/SoftwareSection";
import { GeoDataScene } from "../components/maps/GeoDataScene";
import { PublicationsSection } from "../components/publications/PublicationsSection";
import { AboutSection } from "../components/about/AboutSection";
import { ContactSection } from "../components/contact/ContactSection";
import { NoiseOverlay } from "../components/ui/NoiseOverlay";
import { useProjectRoute } from "./useProjectRoute";

// Three.js, React Three Fiber and the globe load as their own chunk, after
// the page shell, so the name and content never wait on WebGL.
const EarthScene = lazy(() => import("../components/hero/EarthScene"));

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function App() {
  const reduced = useReducedMotion();
  const mobile = useMobile();
  const fine = useFinePointer();
  const webgl = useMemo(hasWebGL, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<SceneKey>("hero");
  const [ready, setReady] = useState(false);
  const { open: openSlug, openProject, closeProject } = useProjectRoute();

  scene.reducedMotion = reduced;
  scene.mobile = mobile;

  useLenis(!reduced);

  useEffect(() => startSceneTracker((_stage, key) => setActive(key)), []);
  useEffect(startAnalytics, []);

  // Pointer position for the globe's lean, kept out of React state.
  useEffect(() => {
    const on = (e: PointerEvent) => {
      scene.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scene.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);

  // No loading screen. The opening starts as soon as the typeface is in, or
  // after 300 ms without it, so nobody waits on a font or on the globe to
  // read the first line. The globe fades in whenever its chunk arrives.
  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setReady(true);
    };
    document.fonts.ready.then(go);
    const cap = window.setTimeout(go, 300);
    return () => window.clearTimeout(cap);
  }, []);

  // Pinned sections are measured when ScrollTrigger refreshes. Fonts, images
  // and the map's data all arrive later and change the page's height, so
  // re-measure whenever it does, or a pin ends in the wrong place and the next
  // section slides in underneath it.
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    let last = main.offsetHeight;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      const h = main.offsetHeight;
      if (Math.abs(h - last) < 2) return;
      last = h;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        last = main.offsetHeight;
      }, 236);
    });
    ro.observe(main);
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {webgl && (
        <Suspense fallback={null}>
          <EarthScene mobile={mobile} />
        </Suspense>
      )}
      <Navigation menuOpen={menuOpen} onMenu={toggleMenu} active={active} />
      <MenuOverlay open={menuOpen} onClose={closeMenu} />
      <main id="main">
        <Hero ready={ready} webgl={webgl} />
        <ResearchSection webgl={webgl} onOpenStudy={openProject} />
        <SensingSection />
        <ProjectsSection onOpen={openProject} />
        <SoftwareSection />
        <GeoDataScene />
        <PublicationsSection onOpenStudy={openProject} />
        <AboutSection />
        <ContactSection />
      </main>
      <ProjectOverlay slug={openSlug} onClose={closeProject} onOpen={openProject} />
      {fine && !reduced && <CustomCursor />}
      <NoiseOverlay />
    </>
  );
}
