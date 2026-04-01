import { useEffect, useRef } from "react";

const LEFT_COLS = [
    {
        marginTop: 48,
        images: [
            { src: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=400&q=70&auto=format", alt: "Creative workspace", ar: "1 / 1.1" },
            { src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=70&auto=format", alt: "Person at desk", ar: "1 / 1.1" },
        ],
    },
    {
        marginTop: 10,
        images: [
            { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=70&auto=format", alt: "Open office", ar: "1 / 0.75" },
            { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=70&auto=format", alt: "Hands on tablet", ar: "1 / 1.0" },
            { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=70&auto=format", alt: "People at laptop", ar: "1 / 0.75" },
        ],
    },
    {
        marginTop: 28,
        images: [
            { src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=70&auto=format", alt: "Workspace", ar: "1 / 2.15" },
        ],
    },
    {
        marginTop: 0,
        images: [
            { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=70&auto=format", alt: "Professional portrait", ar: "1 / 2.16" },
        ],
    },
];

const RIGHT_COLS = [
    {
        marginTop: 0,
        images: [
            { src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=70&auto=format", alt: "Plant and chair", ar: "1 / 2.16" },
        ],
    },
    {
        marginTop: 28,
        images: [
            { src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=70&auto=format", alt: "Window office", ar: "1 / 2.15" },
        ],
    },
    {
        marginTop: 10,
        images: [
            { src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=70&auto=format", alt: "Person at computer", ar: "1 / 0.73" },
            { src: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=70&auto=format", alt: "Library", ar: "1 / 1.00" },
            { src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=70&auto=format", alt: "Business meeting", ar: "1 / 0.73" },
        ],
    },
    {
        marginTop: 48,
        images: [
            { src: "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=400&q=70&auto=format", alt: "Conference panel", ar: "1 / 1.1" },
            { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=70&auto=format", alt: "Group discussion", ar: "1 / 1.1" },
        ],
    },
];

const ALL_COLS = [...LEFT_COLS, ...RIGHT_COLS];

// Left col: 2 images | Center col: 1 image (tall) | Right col: 2 images
const MOBILE_COLS = [
    {
        marginTop: 20,
        images: [
            { src: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=300&q=70&auto=format", alt: "Creative workspace", ar: "1 / 1.15" },
            { src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300&q=70&auto=format", alt: "Person at desk",      ar: "1 / 1.15" },
        ],
    },
    {
        marginTop: 14, // offset center col down for the staggered look
        images: [
            { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=70&auto=format", alt: "Professional portrait", ar: "1 / 1.5" },
        ],
    },
    {
        marginTop:20,
        images: [
            { src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&q=70&auto=format", alt: "Person at computer", ar: "1 / 1.15" },
            { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&q=70&auto=format", alt: "Group discussion",   ar: "1 / 1.15" },
        ],
    },
];

function preloadImages(srcs) {
    return Promise.all(
        srcs.map(src => new Promise(resolve => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = src;
        }))
    );
}

function ImgCard({ src, alt, ar }) {
    return (
        <div style={{
            width: "100%",
            aspectRatio: ar,
            borderRadius: "20px",
            overflow: "hidden",
            background: "#e8e8e8",
            flexShrink: 0,
            position: "relative",
        }}>
            <div className="tb-shimmer" />
            <img
                src={src}
                alt={alt}
                onLoad={e => {
                    e.currentTarget.style.opacity = "1";
                    const shimmer = e.currentTarget.previousSibling;
                    if (shimmer) shimmer.style.display = "none";
                }}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                }}
            />
        </div>
    );
}

// ── Desktop grid (8 staggered columns) ───────────────────────────────────────
function DesktopGrid() {
    const colRefs = useRef([]);

    useEffect(() => {
        const staggerOrder = [3, 4, 2, 5, 1, 6, 0, 7];
        const allSrcs = ALL_COLS.flatMap(c => c.images.map(i => i.src));

        preloadImages(allSrcs).then(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    colRefs.current.forEach((col, i) => {
                        if (!col) return;
                        const rank = staggerOrder.indexOf(i);
                        setTimeout(() => col.classList.add("tb-col-revealed"), rank * 60);
                    });
                });
            });
        });
    }, []);

    return (
        <div className="tb-grid">
            {ALL_COLS.map((col, ci) => (
                <div
                    key={ci}
                    className="tb-col"
                    ref={el => colRefs.current[ci] = el}
                    style={{ marginTop: col.marginTop }}
                >
                    {col.images.map((img, ii) => (
                        <ImgCard key={ii} src={img.src} alt={img.alt} ar={img.ar} />
                    ))}
                </div>
            ))}
        </div>
    );
}

// ── Mobile grid: left(2) | center(1) | right(2) ───────────────────────────────
function MobileGrid() {
    const colRefs = useRef([]);

    useEffect(() => {
        const allSrcs = MOBILE_COLS.flatMap(c => c.images.map(i => i.src));

        preloadImages(allSrcs).then(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Stagger: center first (1), then left (0), then right (2)
                    const staggerOrder = [1, 0, 2];
                    colRefs.current.forEach((col, i) => {
                        if (!col) return;
                        const rank = staggerOrder.indexOf(i);
                        setTimeout(() => col.classList.add("tb-mob-col-revealed"), rank * 80);
                    });
                });
            });
        });
    }, []);

    return (
        <div className="tb-mob-grid">
            {MOBILE_COLS.map((col, ci) => (
                <div
                    key={ci}
                    className="tb-mob-col"
                    ref={el => colRefs.current[ci] = el}
                    style={{ marginTop: col.marginTop }}
                >
                    {col.images.map((img, ii) => (
                        <ImgCard key={ii} src={img.src} alt={img.alt} ar={img.ar} />
                    ))}
                </div>
            ))}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TestimonialsBanner() {
    return (
        <>
            <style>{`

        .tb-section {
          width: 100%;
          background: #fff;
          overflow: hidden;
          padding: 20px;
        }

        /* ── Shimmer ── */
        .tb-shimmer {
          position: absolute;
          inset: 0;
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ════════════════════════════════
           DESKTOP  (≥ 640px)
        ════════════════════════════════ */
        .tb-desktop-wrap { display: block; }
        .tb-mobile-wrap  { display: none;  }

        .tb-grid-wrap {
          position: relative;
          height: clamp(320px, 46vw, 620px);
          overflow: hidden;
        }

        .tb-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 15px;
          padding: 0 12px;
          align-items: start;
          height: 100%;
        }

        .tb-col {
          display: flex;
          flex-direction: column;
          gap: 15px;
          will-change: transform, opacity;
          opacity: 0;
          transform: translateY(60px);
        }

        .tb-col-revealed {
          opacity: 1;
          transform: translateY(0);
          transition:
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.5s ease;
        }

        /* ════════════════════════════════
           MOBILE  (< 640px)
        ════════════════════════════════ */
        @media (max-width: 639px) {
          .tb-desktop-wrap { display: none;  }
          .tb-mobile-wrap  { display: block; }
        }

        .tb-mob-grid-wrap {
          position: relative;
          height: clamp(260px, 88vw, 400px);
          overflow: hidden;
        }

        /* 3 columns — equal width */
        .tb-mob-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          padding: 0 4px;
          align-items: start;
          height: 100%;
        }

        /* Each mobile col animates as a whole (same as desktop cols) */
        .tb-mob-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
          will-change: transform, opacity;
          opacity: 0;
          transform: translateY(60px);
        }

        .tb-mob-col-revealed {
          opacity: 1;
          transform: translateY(0);
          transition:
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.5s ease;
        }

        /* ── Shared fades ── */
        .tb-fade {
          position: absolute;
          pointer-events: none;
          z-index: 10;
        }
        .tb-fade-top {
          top: 0; left: 0; right: 0;
          height: 40px;
          
        }
        .tb-fade-bottom {
          bottom: 0; left: 0; right: 0;
          height: 120px;
          
        }
        .tb-fade-left {
          top: 0; bottom: 0; left: 0;
          width: 24px;
        
        }
        .tb-fade-right {
          top: 0; bottom: 0; right: 0;
          width: 24px;
         
        }

        /* ── Text block ── */
        .tb-text {
          text-align: center;
          padding: 0 16px 44px;
          margin-top: -130px;
          position: relative;
          z-index: 20;
        }

        @media (max-width: 639px) {
          .tb-text { margin-top: -50px; }
        }

        .tb-pill {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(0,0,0,0.18);
          border-radius: 999px;
          padding: 5px 18px;
          font-size: 13px;
          font-weight: 500;
          color: #333;
          background: #fff;
          margin-bottom: 14px;
          letter-spacing: 0.05px;
        }

        .tb-heading {
          font-size: clamp(20px, 2.8vw, 38px);
          font-weight: 700;
          color: #111;
          line-height: 1.15;
          margin: 0 0 8px;
        }

        @media (max-width: 639px) {
          .tb-heading { font-size: clamp(22px, 6vw, 30px); }
        }

        .tb-sub {
          font-size: clamp(14px, 1.5vw, 20px);
          font-weight: 400;
          color: #9a9a9a;
          margin: 0;
        }

        @media (max-width: 639px) {
          .tb-sub { font-size: 15px; }
        }
      `}</style>

            <section className="tb-section">

                {/* ── DESKTOP ── */}
                <div className="tb-desktop-wrap">
                    <div className="tb-grid-wrap">
                        <DesktopGrid />
                        <div className="tb-fade tb-fade-top" />
                        <div className="tb-fade tb-fade-bottom" />
                        <div className="tb-fade tb-fade-left" />
                        <div className="tb-fade tb-fade-right" />
                    </div>
                </div>

                {/* ── MOBILE ── */}
                <div className="tb-mobile-wrap">
                    <div className="tb-mob-grid-wrap">
                        <MobileGrid />
                        <div className="tb-fade tb-fade-top" />
                        <div className="tb-fade tb-fade-bottom" />
                        <div className="tb-fade tb-fade-left" />
                        <div className="tb-fade tb-fade-right" />
                    </div>
                </div>

                {/* ── Text — shared ── */}
                <div className="tb-text">
                    <div><span className="tb-pill">Testimonials</span></div>
                    <h2 className="tb-heading">Trusted by creatives and leaders</h2>
                    <p className="tb-sub">from various industries</p>
                </div>

            </section>
        </>
    );
}