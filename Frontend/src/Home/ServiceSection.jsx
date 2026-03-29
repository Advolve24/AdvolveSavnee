import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StickyImageShowcase() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const group1Ref = useRef(null);
  const group2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const g1 = group1Ref.current.children;
      const g2 = group2Ref.current.children;

      /* ================= INITIAL ================= */

      gsap.set(textRef.current, { y: 20, opacity: 0 });

      gsap.set(g1, { y: 100, opacity: 0 });
      gsap.set(g2, { y: 100, opacity: 0 });

      gsap.set(group1Ref.current, { zIndex: 2 });
      gsap.set(group2Ref.current, { zIndex: 1 });

      /* ================= TIMELINE ================= */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=280%",
          scrub: 1.2, // 🔥 smoother
          pin: true,
          anticipatePin: 1,
        },
      });

      /* ================= PHASE 1 ================= */

      tl.addLabel("phase1", 0);

      // TEXT
      tl.to(textRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      }, "phase1");

      // GROUP 1 (SMOOTH)
      tl.to(g1, {
        y: 0,
        opacity: 1,
        stagger: 0.15, 
        duration: 0.8,
        ease: "power3.out",
      }, "phase1+=0.35");

      // HOLD
      tl.to({}, { duration: 0.10 });

      tl.addLabel("phase2");
      tl.set(group2Ref.current, { zIndex: 3 });
      tl.to(g1, {
        y: -160,
        opacity: 0,
        stagger: 0.1, 
        duration: 0.7,
        ease: "power2.inOut",
      }, "phase2");

      tl.to({}, { duration: 0.6 });

      tl.to(g2, {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      }, "phase2+=0.3");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#ffff] overflow-hidden"
    >
      <div className="max-w-[1300px] mx-auto flex items-center h-full px-4">

        {/* LEFT TEXT */}
        <div ref={textRef} className="w-[500px] px-6">
          <p className="border rounded-full text-xs w-fit text-gray-500 mb-4 px-4 py-[6px]">
            Advolving Everyday
          </p>

          <h2 className="text-4xl leading-tight mb-6">
            We’re dedicated 
            to capturing<br /> the 
            <span className="font-bold">
              essence of each <br /> brand
            </span>
          </h2>

           <div className="flex items-center gap-2 mt-6">

                        {/* TEXT BUTTON */}
                        <button className="bg-black text-white px-4 py-4 rounded-full text-[14px] leading-none">
                            View Our Services
                        </button>

                        {/* ARROW BUTTON */}
                        <button className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full text-[14px] rotate-[-25deg]">
                            →
                        </button>

                    </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="w-[70%] relative h-[420px]">

          {/* GROUP 1 */}
          <div ref={group1Ref} className="absolute inset-0">
            <div className="absolute left-[5%] bottom-[10%] w-[260px] h-[330px] bg-gray-300 rounded-2xl" />
            <div className="absolute left-[40%] bottom-[0%] w-[200px] h-[250px] bg-gray-300 rounded-2xl" />
            <div className="absolute right-[5%] bottom-[12%] w-[220px] h-[270px] bg-gray-300 rounded-2xl" />
          </div>

          {/* GROUP 2 */}
          <div ref={group2Ref} className="absolute inset-0">
            <div className="absolute left-[5%] bottom-[10%] w-[260px] h-[330px] bg-gray-400 rounded-2xl" />
            <div className="absolute left-[40%] bottom-[0%] w-[200px] h-[250px] bg-gray-400 rounded-2xl" />
            <div className="absolute right-[5%] bottom-[12%] w-[220px] h-[270px] bg-gray-400 rounded-2xl" />
          </div>

        </div>
      </div>
    </section>
  );
}