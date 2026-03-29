import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WinsSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray(".slide");
      const totalSlides = slides.length;

      const getMaxScroll = () =>
        trackRef.current.scrollWidth - window.innerWidth;

      const tween = gsap.to(trackRef.current, {
        x: () => -getMaxScroll(), // ✅ PIXEL BASED (KEY FIX)
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => "+=" + getMaxScroll(),

        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,

        animation: tween,

        snap: {
          snapTo: (value) => {
            const snap = 1 / (totalSlides - 1);
            return Math.round(value / snap) * snap;
          },
          duration: 0.3,
          ease: "power1.out",
          inertia: false,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#ffff] overflow-hidden"
    >
      {/* HEADER */}
      <div className="absolute left-[6vw] top-[80px] z-20 px-8 ">
        <p className="text-xs tracking-widest text-gray-500">OUR WINS</p>
      </div>

      {/* TRACK */}
      <div ref={trackRef} className="flex h-screen">

        {/* ================= SLIDE 1 ================= */}
         <div className="slide w-[100vw] h-screen shrink-0 flex items-center justify-center px-12">
          <div className="w-full flex justify-center gap-[6rem] ">
          {/* LEFT */}
          <div className="flex flex-col gap-2">
            <div className="mb-5 px-4 py-[6px] border rounded-full text-xs w-fit">
            <i>  Work that worked wonders</i>
            </div>

            <div className="w-[660px] h-[400px] bg-[#111] rounded-[24px] flex p-[10px] ">
              
              <div className="w-[44%] bg-white rounded-[16px] overflow-hidden">
                <img
                  src="/work1.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-[56%] px-7 py-7 text-white flex flex-col justify-between">
                <div>
                  <p className="text-[11px] opacity-50 mb-3">
                    Social Media Management
                  </p>

                  <p className="text-[20px] leading-[1.6]">
                    Revamped <b>social identity</b>
                    <br />
                    with minimal design,
                    <br />
                    <b>modern storytelling</b> and
                    <br />
                    close-up elegance.
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <button className="text-sm px-5 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition">
                    Case studies
                  </button>

                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                    →
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-3">
            <h2 className="text-[28px] max-w-[340px]">
              We help you create an impact worldwide
            </h2>

            <div className="flex items-center gap-6 relative">
              <div className="w-[240px] h-[360px] bg-gray-200 rounded-[22px] overflow-hidden">
                <img
                  src="/work2.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute left-[210px] top-1/2 -translate-y-1/2">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                  →
                </div>
              </div>

              <div className="pl-6">
                <div className="mb-5 px-4 py-[6px] border rounded-full text-xs w-fit">
                  FMCG
                </div>

                <p className="text-[28px] font-semibold">305k</p>
                <p className="text-xs text-gray-400">views</p>

                <p className="text-sm text-gray-500 mt-3 max-w-[200px]">
                  Read about how we achieved it
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* ================= SLIDE 2 ================= */}
         <div className="slide w-[100vw] h-screen shrink-0 flex items-center justify-center px-12">
          <div className="w-full flex justify-center gap-[6rem] ">
          {/* LEFT */}
          <div className="flex flex-col gap-2">
            <div className="mb-5 px-4 py-[6px] border rounded-full text-xs w-fit">
            <i>  Work that worked wonders</i>
            </div>

            <div className="w-[660px] h-[400px] bg-[#111] rounded-[24px] flex p-[10px] ">
              
              <div className="w-[44%] bg-white rounded-[16px] overflow-hidden">
                <img
                  src="/work1.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-[56%] px-7 py-7 text-white flex flex-col justify-between">
                <div>
                  <p className="text-[11px] opacity-50 mb-3">
                    Social Media Management
                  </p>

                  <p className="text-[20px] leading-[1.6]">
                    Revamped <b>social identity</b>
                    <br />
                    with minimal design,
                    <br />
                    <b>modern storytelling</b> and
                    <br />
                    close-up elegance.
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <button className="text-sm px-5 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition">
                    Case studies
                  </button>

                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                    →
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-3">
            <h2 className="text-[28px] max-w-[340px]">
              We help you create an impact worldwide
            </h2>

            <div className="flex items-center gap-6 relative">
              <div className="w-[240px] h-[360px] bg-gray-200 rounded-[22px] overflow-hidden">
                <img
                  src="/work2.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute left-[210px] top-1/2 -translate-y-1/2">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                  →
                </div>
              </div>

              <div className="pl-6">
                <div className="mb-5 px-4 py-[6px] border rounded-full text-xs w-fit">
                  FMCG
                </div>

                <p className="text-[28px] font-semibold">305k</p>
                <p className="text-xs text-gray-400">views</p>

                <p className="text-sm text-gray-500 mt-3 max-w-[200px]">
                  Read about how we achieved it
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>

           {/* ================= SLIDE  ================= */}
         <div className="slide w-[100vw] h-screen shrink-0 flex items-center justify-center px-12">
          <div className="w-full flex justify-center gap-[6rem] ">
          {/* LEFT */}
          <div className="flex flex-col gap-2">
            <div className="mb-5 px-4 py-[6px] border rounded-full text-xs w-fit">
            <i>  Work that worked wonders</i>
            </div>

            <div className="w-[660px] h-[400px] bg-[#111] rounded-[24px] flex p-[10px] ">
              
              <div className="w-[44%] bg-white rounded-[16px] overflow-hidden">
                <img
                  src="/work1.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-[56%] px-7 py-7 text-white flex flex-col justify-between">
                <div>
                  <p className="text-[11px] opacity-50 mb-3">
                    Social Media Management
                  </p>

                  <p className="text-[20px] leading-[1.6]">
                    Revamped <b>social identity</b>
                    <br />
                    with minimal design,
                    <br />
                    <b>modern storytelling</b> and
                    <br />
                    close-up elegance.
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <button className="text-sm px-5 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition">
                    Case studies
                  </button>

                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                    →
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-3">
            <h2 className="text-[28px] max-w-[340px]">
              We help you create an impact worldwide
            </h2>

            <div className="flex items-center gap-6 relative">
              <div className="w-[240px] h-[360px] bg-gray-200 rounded-[22px] overflow-hidden">
                <img
                  src="/work2.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute left-[210px] top-1/2 -translate-y-1/2">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                  →
                </div>
              </div>

              <div className="pl-6">
                <div className="mb-5 px-4 py-[6px] border rounded-full text-xs w-fit">
                  FMCG
                </div>

                <p className="text-[28px] font-semibold">305k</p>
                <p className="text-xs text-gray-400">views</p>

                <p className="text-sm text-gray-500 mt-3 max-w-[200px]">
                  Read about how we achieved it
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>


      </div>
    </section>
  );
}