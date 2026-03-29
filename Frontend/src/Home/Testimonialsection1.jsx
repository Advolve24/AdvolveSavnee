import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialSection() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo(
        cardRef.current,
        {
          scale: 0.4,              // 🔥 less aggressive = smoother feel
          y: 100,
          opacity: 0.7,
          filter: "blur(8px)",
        },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "none", // required for scrub smoothness
          scrollTrigger: {
            trigger: sectionRef.current,

            start: "top 90%",      // 🔥 starts earlier
            end: "top 10%",        // 🔥 longer scroll distance

            scrub: 2,              // 🔥 THIS is key (higher = smoother)

            invalidateOnRefresh: true,
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-40 bg-[#ffffff] flex justify-center items-center"
    >
      <div
        ref={cardRef}
        className="w-[1000px] origin-center bg-gradient-to-r from-[#111] to-[#1c1c1c] text-white rounded-[20px] px-[36px] py-[28px] flex items-center justify-between will-change-transform"
      >
        {/* LEFT */}
        <div className="flex flex-col">
          <div className="mb-4 px-4 py-[6px] border border-white/20 rounded-full text-[11px] text-gray-300 w-fit">
            Testimonials
          </div>

          <div className="flex items-start gap-[36px]">
            <div className="w-[180px] h-[180px] bg-white rounded-[16px] shrink-0" />

            <div className="flex flex-col pt-[8px]">
              <p className="text-[32px] leading-none mb-3 opacity-80">”</p>

              <p className="text-[16px] leading-[1.7] max-w-[460px] text-gray-200">
                We adapt to the needs of our<br />
                changing times by shedding previous<br />
                creative skins and taking on new<br />
                ideas & strategies.
              </p>

              <p className="text-[11px] mt-5 text-gray-400">
                PPC / Manufacturing Industry
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col justify-between h-[180px] items-end">
          <p className="text-[10px] text-gray-400 text-right w-full">
            Customer Satisfaction
          </p>

          <div className="w-full flex items-end justify-center gap-3">
            <div className="flex items-center gap-3 text-[12px] text-gray-300">
              <span>←</span>
              <span>2/5</span>
              <span>→</span>
            </div>

            <div className="w-[70px] h-[70px] bg-white rounded-[5px]" />
          </div>
        </div>
      </div>
    </section>
  );
}