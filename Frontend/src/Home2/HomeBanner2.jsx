import { useEffect, useRef } from "react";

const logos = [
  "/logo/blend.png",
  "/logo/Babus.png",
  "/logo/Mavi.png",
  "/logo/VHS.png",
  "/logo/VillaGulposh.png",
];

export default function HeroBanner() {
  const heroInnerRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const inner = heroInnerRef.current;
      if (!section || !inner) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      /**
       * Progress when next section overlaps:
       * starts when section top hits top (0)
       * ends when section bottom reaches top
       */
      const progress = Math.min(
        Math.max(-rect.top / (rect.height - vh), 0),
        1
      );

      // ONLY SCALE (no opacity fade)
      const scale = 1 - progress * 0.15;
      const radius = progress * 24;

      inner.style.transform = `scale(${scale})`;
      inner.style.borderRadius = `${radius}px`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ─── HERO WRAPPER ─── */}
      <div
        ref={sectionRef}
        className="relative"
        style={{ height: "200vh" ,backgroundColor: "#000"}}
      >
        {/* Sticky container */}
        <div className="sticky top-0 w-full overflow-hidden h-screen">

          {/* INNER */}
          <div
            ref={heroInnerRef}
            className="w-full h-full  flex items-center justify-center origin-top"
            style={{
              willChange: "transform, border-radius",
            }}
          >
            <div className="w-full max-w-[1300px] px-5 grid grid-cols-2 items-center gap-8">

              {/* LEFT */}
              <div className="flex flex-col justify-center">

                <img
                  src="/Year Zero White.svg"
                  alt="Year Zero"
                  className="w-[650px] mb-40"
                />

                {/* ─── LOGO SLIDER ─── */}
                <div className="relative w-full overflow-hidden mb-8 h-[80px] group">

                  {/* Gradient fades */}
                
                  <div className="logo-track flex items-center gap-8">
                    {[...logos, ...logos].map((logo, i) => (
                      <img
                        key={i}
                        src={logo}
                        alt="brand"
                        className="logo-item h-16 object-contain flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-[18px] text-white/90 leading-[1.45] max-w-[530px]">
                  Since its inception, ADVOLVE has grown into a creative partner for
                  brands across industries, bringing together strategy, storytelling
                  and design to create meaningful communication.
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex justify-center items-center h-full">
                <img
                  src="/teamnew.png"
                  alt="ADVOLVE Team"
                  className="w-full max-w-[630px] object-contain"
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ─── STYLES ─── */}
      <style>{`
        /* ─── LOGO MARQUEE ─── */
        .logo-track {
          width: max-content;
          animation: marquee 20s linear infinite;
        }

        /* Pause on hover */
        .group:hover .logo-track {
          animation-play-state: paused;
        }

        /* LOGO STYLE */
        .logo-item {
          filter: grayscale(100%);
          opacity: 0.6;
          transition: all 0.4s ease;
        }

        .logo-item:hover {
          filter: grayscale(0%);
          opacity: 1;
          transform: scale(1.05);
        }

        /* Infinite seamless loop */
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}