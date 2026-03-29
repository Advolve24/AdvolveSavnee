import { useRef } from "react";

export default function CleanBanner() {
  const videoRef = useRef(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <section className="relative w-full h-screen overflow-hidden bg-black">

        {/* VIDEO */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/Brand Creation.mp4"   // ✅ YOUR VIDEO HERE
          autoPlay
          muted
          loop
          playsInline
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80" />

        {/* CONTENT */}
        <div className="relative z-10 h-full flex flex-col justify-end px-10 pb-20 md:px-16 md:pb-24">

          <h1
            className="text-white leading-none tracking-tight max-w-4xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 900,
            }}
          >
            Brand 
            <br />
            <em>Creation</em>
          </h1>

          <p className="mt-6 text-white/60 text-sm max-w-md font-light">
            We craft high-impact social media strategies that engage,
            convert, and build powerful brand presence.
          </p>
        </div>

      </section>
    </>
  );
}