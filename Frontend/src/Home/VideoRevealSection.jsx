import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VideoRevealSection() {
  const sectionRef = useRef(null);
  const maskRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // ✅ ensure video plays
      videoRef.current.play();

      // ✅ VERY IMPORTANT: set initial state via GSAP (not only CSS)
      gsap.set(maskRef.current, {
        clipPath: "circle(8% at 50% 50%)", // use % instead of px
        WebkitClipPath: "circle(6% at 50% 50%)",
        force3D: true,
      });

      gsap.set(textRef.current, {
        opacity: 0,
        scale: 0.8,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 🔥 TEXT APPEAR SMOOTHLY
      tl.to(textRef.current, {
        opacity: 1,
        scale: 1,
        ease: "none",
      }, 0);

      // 🔥 SUPER SMOOTH CIRCLE EXPANSION
      tl.to(maskRef.current, {
        clipPath: "circle(150% at 50% 50%)",
        WebkitClipPath: "circle(150% at 50% 50%)",
        ease: "none",
      }, 0);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-black flex items-center justify-center overflow-hidden"
    >

      {/* TOP TEXT */}
      <div className="absolute top-20 text-white text-sm tracking-wide">
        And much more...
      </div>

      {/* VIDEO MASK */}
      <div
        ref={maskRef}
        className="absolute inset-0 will-change-[clip-path]"
      >
        <video
          ref={videoRef}
          src="/7180172-hd_1920_1080_25fps.mp4"
          muted
          loop
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* CENTER UI */}
      <div className="relative flex items-center justify-center">

        {/* 🔄 CIRCULAR TEXT */}
        <div className="absolute w-[200px] h-[200px] animate-spin-slow pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <path
                id="circlePathTight"
                d="
                  M 100,100
                  m -65,0
                  a 65,65 0 1,1 130,0
                  a 65,65 0 1,1 -130,0
                "
              />
            </defs>

            <text
              fill="white"
              fontSize="17"
              letterSpacing="4"
              style={{
                fontWeight: "700",
                textTransform: "uppercase",
                fontFamily: "Antonio, sans-serif",
              }}
            >
              <textPath href="#circlePathTight">
                PLAY VIDEO • PLAY VIDEO • PLAY VIDEO •
              </textPath>
            </text>
          </svg>
        </div>

        {/* 🎯 GLASS BUTTON */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center relative z-10"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), rgba(255,255,255,0.05))",
            backdropFilter: "blur(25px)",
            WebkitBackdropFilter: "blur(25px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.02))",
            }}
          />

          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#F2E6DC"
            className="ml-1 relative z-10"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

      </div>
    </section>
  );
}