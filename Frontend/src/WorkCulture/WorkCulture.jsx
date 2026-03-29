import { useEffect, useRef } from "react";
import { animate, scroll, cubicBezier } from "motion";

// ─── Image Data ───────────────────────────────────────────────────────────────
const LAYER_1_IMAGES = [
    "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1556304044-0699e31c6a34?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1590330297626-d7aff25a0431?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1565321590372-09331b9dd1eb?w=800&auto=format&fit=crop&q=60",
];

const LAYER_2_IMAGES = [
    "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1637414165749-9b3cd88b8271?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1699911251220-8e0de3b5ce88?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1667483629944-6414ad0648c5?w=800&auto=format&fit=crop&q=60",
    "https://plus.unsplash.com/premium_photo-1706078438060-d76ced26d8d5?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1525385444278-b7968e7e28dc?w=800&auto=format&fit=crop&q=60",
];

const LAYER_3_IMAGES = [
    "https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=60",
];

const CENTER_IMAGE =
    "https://assets.codepen.io/605876/model-shades.jpg?format=auto&quality=100";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ScrollReveal() {
    const scalerImgRef = useRef(null);
    const firstSectionRef = useRef(null);
    const layer1Ref = useRef(null);
    const layer2Ref = useRef(null);
    const layer3Ref = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) return;

        const image = scalerImgRef.current;
        const firstSection = firstSectionRef.current;
        const layers = [layer1Ref.current, layer2Ref.current, layer3Ref.current];

        if (!image || !firstSection || layers.some((l) => !l)) return;

        // ─── VIEWPORT (START STATE) ───
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // ─── CALCULATE GRID CARD SIZE (FINAL STATE) ───
        const grid = image.closest(".grid-layout");

        const styles = getComputedStyle(grid);
        const gap = parseFloat(styles.gap);

        const gridWidth = grid.clientWidth;

        // 5 columns → 4 gaps
        const columnWidth = (gridWidth - gap * 4) / 5;

        // Maintain SAME ratio as other images
        const cardWidth = columnWidth;
        const cardHeight = columnWidth * 1.25; // 4:5 ratio

        // ── PHASE 1: FULLSCREEN → PERFECT GRID CARD ──
        const finalScale = cardWidth / vw;

        const TIMELINE = {
            SHRINK: [0, 0.3],
            GRID_IN: [0.3, 0.7],
            FINAL: [0.7, 1],
        };

       scroll((progress) => {

  // ───────────────
  // PHASE 1 → IMAGE SHRINK
  // ───────────────
  if (progress >= TIMELINE.SHRINK[0] && progress <= TIMELINE.SHRINK[1]) {
    const p = (progress - TIMELINE.SHRINK[0]) /
              (TIMELINE.SHRINK[1] - TIMELINE.SHRINK[0]);

    image.style.width = `${vw - (vw - cardWidth) * p}px`;
    image.style.height = `${vh - (vh - cardHeight) * p}px`;
    image.style.borderRadius = `${16 * p}px`;
  }

  // ───────────────
  // PHASE 2 → GRID REVEAL
  // ───────────────
  if (progress >= TIMELINE.GRID_IN[0] && progress <= TIMELINE.GRID_IN[1]) {
    const p = (progress - TIMELINE.GRID_IN[0]) /
              (TIMELINE.GRID_IN[1] - TIMELINE.GRID_IN[0]);

    layers.forEach((layer, i) => {
      const delay = i * 0.1;
      const localP = Math.max(0, Math.min(1, p - delay));

      layer.style.opacity = localP;
      layer.style.transform = `scale(${localP})`;
    });
  }

  // ───────────────
  // PHASE 3 → FINAL STATE LOCK
  // ───────────────
  if (progress > TIMELINE.FINAL[0]) {
    layers.forEach(layer => {
      layer.style.opacity = 1;
      layer.style.transform = "scale(1)";
    });
  }

}, {
  target: firstSection
});

    }, []);

    return (
        <>
            <style>{`
        /* ── Fluid type ── */
        .fluid-h1 {
          font-size: clamp(4rem, 12vw, 12rem);
          line-height: 0.9;
          margin: 0;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .fluid-h2 {
          font-size: clamp(0.75rem, 2vw, 1.5rem);
          line-height: 1;
          margin: 0;
          padding-top: 48px;
          font-weight: 400;
          opacity: 0.6;
        }

        /* ── Grid ── */
        .grid-layout {
  --offset: 0;
  --gap: clamp(10px, 7.35vw, 80px);

  width: 100vw;              /* 🔥 FULL WIDTH */
  max-width: 100vw;          /* 🔥 REMOVE SIDE GAP */
  margin: 0;                 /* 🔥 NO AUTO CENTER */

  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: var(--gap);

  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
}
        @media (max-width: 600px) {
          .grid-layout {
            grid-template-columns: repeat(3, 1fr);
            max-width: calc(100% - 2rem);
            --offset: -1;
          }
          .layer-1 { display: none !important; }
        }

        /* ── Subgrid layers ── */
        .grid-layer {
          display: grid;
          grid-column: 1 / -1;
          grid-row: 1 / -1;
          grid-template-columns: subgrid;
          grid-template-rows: subgrid;
        }

        /* Layer 1 — outer edges */
        .layer-1 div:nth-of-type(odd)  { grid-column: 1; }
        .layer-1 div:nth-of-type(even) { grid-column: -2; }

        /* Layer 2 — inner columns */
        .layer-2 div:nth-of-type(odd)  { grid-column: calc(2 + var(--offset)); }
        .layer-2 div:nth-of-type(even) { grid-column: calc(-3 - var(--offset)); }

        /* Layer 3 — center top & bottom */
        .layer-3 div:first-of-type {
          grid-column: calc(3 + var(--offset));
          grid-row: 1;
        }
        .layer-3 div:last-of-type {
          grid-column: calc(3 + var(--offset));
          grid-row: -1;
        }

        /* ── Center scaler cell ── */
        .scaler {
          position: relative;
          grid-area: 2 / calc(3 + var(--offset));
          z-index: 2;
          width: 100%;
          height: 100%;
        }

        /* The img inside .scaler is animated by Motion — starts fullscreen */
    .scaler img {
  position: fixed;
  top: 50%;
  left: 50%;

  width: 100vw;
  height: 80vh; 

  transform: translate(-50%, -50%);
  object-fit: cover;

  border-radius: 0;
  z-index: 50;
}
        /* Grid card images (non-scaler) */
        .grid-layer img {
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          border-radius: 1rem;
          display: block;
        }

        .grid-layout {
  position: relative;
  z-index: 1;
}
      
        .grid-layer {
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
}
        /* ── Scroll hint arrow ── */
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(8px); }
        }
        .scroll-hint { animation: bounce 1.8s ease-in-out infinite; }
      `}</style>

            <div className="bg-black text-white overflow-clip"
                style={{ fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif" }}>

                {/* ── HERO — fullscreen center image is visible here on load ── */}
                <header className="relative min-h-screen flex flex-col items-start justify-end pb-16 pl-12 overflow-hidden">
                    {/* The center image renders here too (via the sticky section below),
              so we show a title overlay on top of the blank hero */}
                    <div className="relative z-10 pointer-events-none select-none">
                       <h1 className="fluid-h1">
  we build<br />brands.
</h1>
<p className="fluid-h2">
  Ideas. Chaos. Late nights. Scroll to step inside →
</p>
                    </div>

                    {/* Scroll hint */}
                    <div className="scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
                        <span className="text-xs tracking-widest uppercase">scroll</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 3v14M4 11l6 6 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </header>

                {/* ── MAIN SCROLL SECTION ── */}
                <main>
                    {/*
            This section is 360vh tall — giving plenty of scroll room.
            Phase 1 (0–50%): center image shrinks from fullscreen → grid cell.
            Phase 2 (50–100%): grid layers fade + scale in.
          */}
                    <section
                        ref={firstSectionRef}
                        style={{ minHeight: "360vh" }}
                    >
                        <div className="h-screen w-screen sticky top-0 overflow-hidden">
                            <div className="grid-layout">

                                {/* Layer 1 — outer edges */}
                                <div ref={layer1Ref} className="grid-layer layer-1">
                                    {LAYER_1_IMAGES.map((src, i) => (
                                        <div key={i}>
                                            <img src={src} alt="" />
                                        </div>
                                    ))}
                                </div>

                                {/* Layer 2 — inner columns */}
                                <div ref={layer2Ref} className="grid-layer layer-2">
                                    {LAYER_2_IMAGES.map((src, i) => (
                                        <div key={i}>
                                            <img src={src} alt="" />
                                        </div>
                                    ))}
                                </div>

                                {/* Layer 3 — center top & bottom */}
                                <div ref={layer3Ref} className="grid-layer layer-3">
                                    {LAYER_3_IMAGES.map((src, i) => (
                                        <div key={i}>
                                            <img src={src} alt="" />
                                        </div>
                                    ))}
                                </div>

                                {/* Center scaler — starts fullscreen, shrinks to this cell */}
                                <div className="scaler">
                                    <img
                                        ref={scalerImgRef}
                                        src={CENTER_IMAGE}
                                        alt="center"
                                    />
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* ── FIN ── */}
                    <section className="min-h-screen grid place-items-center">
                        <h2 className="fluid-h1">Join US</h2>
                    </section>
                </main>
            </div>
        </>
    );
}