import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroBanner() {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ENTRY */
      const entry = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      entry.from(imageRef.current, {
        scale: 1.25,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
      });

      entry.from(
        textRef.current,
        {
          y: 40,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
        },
        "-=0.5"
      );

      /* SCROLL */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
          pin: true,
          pinSpacing: false,
        },
      });

      tl.to(wrapperRef.current, {
        scale: 0.80,
        y: -30,
        ease: "none",
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        h-screen
        bg-[#000]
        flex flex-col items-center
        overflow-hidden
        pt-[120px]
      "
    >
      
      {/* WRAPPER */}
      <div
        ref={wrapperRef}
        className="w-full h-full flex flex-col items-center"
      >
        
        {/* TEXT */}
        <div ref={textRef} className="text-center mb-2">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-wide text-[#fec315]">
            CREATIVE TEAM
          </h1>

          <p className="mt-2 text-gray-500 text-lg">
            We build experiences that matter
          </p>
        </div>

        {/* IMAGE (AUTO FIT FIX) */}
        <div
          ref={imageRef}
          className="
            w-full 
            flex 
            justify-center 
            items-end 
            flex-1   /* 👈 THIS IS IMPORTANT */
          "
        >
          <img
            src="/team-1.png"
            alt="Team"
            className="
              w-[90%]
              max-h-[80vh]   /* 👈 LIMIT HEIGHT */
              object-cover
              
            "
          />
        </div>

      </div>

    </section>
  );
}