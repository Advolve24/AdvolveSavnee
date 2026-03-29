import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutResponsiveExact() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            const items = gsap.utils.toArray(".reveal-item");

            gsap.set(items, {
                y: 60,
                opacity: 0,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reset",
                },
            });

            tl.to(items, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.out",
                stagger: {
                    amount: 0.6, // 🔥 smooth sequence
                },
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full bg-[#ffff] py-[8vw] px-[6vw]"
        >
            <div className="w-full max-w-[1200px] mx-auto flex justify-between items-start">

                {/* LEFT SIDE */}
                <div className="reveal w-[40%] max-w-[480px]">

                   <p className="reveal-item mb-5 px-4 py-[6px] border rounded-full text-xs w-fit">
                        <i> Advolving Everyday</i>
                    </p>

                   <h2 className="reveal-item text-[2vw] leading-[1.4] text-gray-900 font-normal">
                        We're dedicated to capturing
                        <br />
                        the <span className="font-semibold">essence of each brand</span><br />
                        through our comprehensive<br /> range of services.
                    </h2>



                  <div className="reveal-item flex items-center gap-2 mt-6">

                        {/* TEXT BUTTON */}
                        <button className="bg-black text-white px-4 py-4 rounded-full text-[14px] leading-none">
                            Know More About Us
                        </button>

                        {/* ARROW BUTTON */}
                        <button className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full text-[14px] rotate-[-25deg]">
                            →
                        </button>

                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex gap-[2vw] w-[50%] justify-end">

                    {/* BIG CARD */}
                   <div className="reveal-item w-[50%] h-[330px] bg-[#d9d9d9] rounded-[1vw] relative">

                        <div className="absolute bottom-[0.8vw] right-[0.8vw] w-[3vw] h-[3vw] min-w-[26px] min-h-[26px] bg-white rounded-full flex items-center justify-center text-[18px] ">
                            ↗
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col justify-center gap-4 w-[50%]">

                        {/* SMALL CARD */}
                        <div className="reveal-item w-full h-[220px] bg-[#d9d9d9] flex items-start justify-end rounded-[0.8vw]">

                            <span className="text-[13px] min-text-[10px] text-gray-500 mt-2 mr-2">
                                <i> About ADVOLVE</i>
                            </span>

                        </div>

                        {/* TEXT */}
                       <p className="reveal-item text-[14px] text-gray-500 leading-[1.6]">
                            We adapt to the needs of our changing<br /> times by shedding previous
                            creative<br /> skins and taking on new ideas & <br />strategies.
                        </p>

                    </div>

                </div>

            </div>
        </section>
    );
}