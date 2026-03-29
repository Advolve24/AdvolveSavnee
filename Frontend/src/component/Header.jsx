import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-6 left-0 w-full z-50 flex justify-center">
      
      <div
        className={`
          flex items-center justify-between
          px-10 py-3
          w-[55%] max-w-[1100px]
          rounded-full
          transition-all duration-300
          ${
            scrolled
              ? "bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              : "bg-white/60 backdrop-blur-xl"
          }
          border border-white/30
        `}
      >

        {/* LEFT */}
        <nav className="flex items-center gap-10 text-[14px] font-medium text-gray-700">
          <a href="#" className="hover:text-black transition">Home</a>
          <a href="#" className="hover:text-black transition">About</a>
          <a href="#" className="hover:text-black transition">Work</a>
        </nav>

        {/* CENTER LOGO */}
        <div className="flex items-center justify-center">
          <img
            src="/Advolve-text-logo.svg" // 👈 use your uploaded logo file
            alt="ADVOLVE"
            className="h-5 object-contain"
          />
        </div>

        {/* RIGHT */}
        <nav className="flex items-center gap-10 text-[14px] font-medium text-gray-700">
          <a href="#" className="hover:text-black transition">Services</a>
          <a href="#" className="hover:text-black transition">Careers</a>
          <a href="#" className="hover:text-black transition">Contact</a>
        </nav>

      </div>

    </header>
  );
}