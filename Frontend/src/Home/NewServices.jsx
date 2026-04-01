import { useEffect, useRef, useState } from 'react'
// import { ChevronLeft, ChevronRight } from 'lucide-react'

const SERVICES = [
  {
    title: 'Brand Identity Creation',
    subtitle: 'Build a distinctive visual language and brand presence.',
    image: '/BrandIdentityCreation.webp',
    meta: ['Logo', 'Palette', 'Guidelines'],
  },
  {
    title: 'Social Media Marketing',
    subtitle: 'Create consistent campaigns that grow reach and engagement.',
    image: '/SocialMediaMarketing.webp',
    meta: ['Reels', 'Content', 'Growth'],
  },
  {
    title: 'Audio-Visual Production',
    subtitle: 'Produce cinematic visual content for campaigns and storytelling.',
    image: '/AudioVisualProduction.webp',
    meta: ['Video', 'Photography', 'Editing'],
  },
  {
    title: 'Website Design & Development',
    subtitle: 'Design and build modern websites that convert and perform.',
    image: '/WebsiteDesignDevelopment.webp',
    meta: ['UI/UX', 'Frontend', 'Launch'],
  },
  {
    title: 'Search Engine Optimization',
    subtitle: 'Improve visibility and rankings with long-term search strategy.',
    image: '/SearchEngineOptimization.png',
    meta: ['Technical', 'Content', 'Ranking'],
  },
  {
    title: 'Media Buying',
    subtitle: 'Plan and place ads efficiently across high-impact channels.',
    image: '/MediaBuying.webp',
    meta: ['Meta Ads', 'Google Ads', 'Scaling'],
  },
]

const getWrappedIndex = (index, length) => {
  if (index < 0) return length - 1
  if (index >= length) return 0
  return index
}

function ServiceCard({ service, offset, isActive, hasEntered }) {
  const absOffset = Math.abs(offset)
  const isHidden = absOffset > 2

  const transforms = {
    0: { x: '0%', scale: 1, opacity: 1, zIndex: 5, filter: 'blur(0px)' },
    1: { x: '68%', scale: 0.88, opacity: 1, zIndex: 4, filter: 'blur(0px)' },
    '-1': { x: '-68%', scale: 0.88, opacity: 1, zIndex: 4, filter: 'blur(0px)' },
    2: { x: '122%', scale: 0.78, opacity: 1, zIndex: 3, filter: 'blur(1px)' },
    '-2': { x: '-122%', scale: 0.78, opacity: 1, zIndex: 3, filter: 'blur(1px)' },
  }

  const styleSet = transforms[offset] || transforms[0]
  const shouldCollapseForIntro = !hasEntered && offset !== 0
  const currentX = shouldCollapseForIntro ? '0%' : styleSet.x
  const currentScale = shouldCollapseForIntro ? 0.92 : styleSet.scale
  const currentOpacity = shouldCollapseForIntro ? 0 : styleSet.opacity

  return (
    <article
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 'min(31vw, 300px)',
        minWidth: 200,
        aspectRatio: '0.72',
        transform: `translate(-50%, -50%) translateX(${currentX}) scale(${currentScale})`,
        opacity: isHidden ? 0 : currentOpacity,
        zIndex: styleSet.zIndex,
        filter: styleSet.filter,
        transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0s ease, filter 0.55s ease',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 26,
          overflow: 'hidden',
          background: '#111111',
        }}
      >
        <img
          src={service.image}
          alt={service.title}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.76) 10%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.04) 100%)',
          }}
        />


        <div
          style={{
            position: 'absolute',
            left: 18,
            right: 18,
            bottom: 18,
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(26px)',
            transition: 'opacity 0.45s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            pointerEvents: 'none',
          }}
        >
          <p
            style={{
              margin: '0 0 6px',
              fontSize: 12,
              color: 'rgba(255,255,255,0.66)',
            }}
          >
            Advolve Service
          </p>
          <h3
            style={{
              margin: 0,
              color: '#ffffff',
              fontSize: 'clamp(1.25rem, 1.8vw, 1.9rem)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              fontWeight: 500,
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            {service.title}
          </h3>
          <p
            style={{
              margin: '8px 0 0',
              color: 'rgba(255,255,255,0.78)',
              fontSize: 13,
              lineHeight: 1.4,
              maxWidth: 180,
            }}
          >
            {service.subtitle}
          </p>
        </div>
      </div>
    </article>
  )
}

export default function ServicesCarousel({ theme = 'light' }) {
  const [activeIndex, setActiveIndex] = useState(2)
  const [hasEntered, setHasEntered] = useState(false)
  const sectionRef = useRef(null)
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    deltaX: 0,
  })
  const isDark = theme === 'dark'

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => getWrappedIndex(current + 1, SERVICES.length))
    }, 4200)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setHasEntered(true)
        observer.disconnect()
      },
      { threshold: 0.35 }
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  const activeService = SERVICES[activeIndex]
  const goPrev = () => setActiveIndex((current) => getWrappedIndex(current - 1, SERVICES.length))
  const goNext = () => setActiveIndex((current) => getWrappedIndex(current + 1, SERVICES.length))

  const handlePointerDown = (event) => {
    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      deltaX: 0,
    }
  }

  const handlePointerMove = (event) => {
    if (!dragStateRef.current.isDragging) return
    dragStateRef.current.deltaX = event.clientX - dragStateRef.current.startX
  }

  const handlePointerUp = () => {
    const { isDragging, deltaX } = dragStateRef.current
    if (!isDragging) return

    if (deltaX <= -60) goNext()
    if (deltaX >= 60) goPrev()

    dragStateRef.current = {
      isDragging: false,
      startX: 0,
      deltaX: 0,
    }
  }

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        background: isDark ? '#050505' : '#ffffff',
        transition: 'background-color 0.35s ease',
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '100%',
          margin: '0 auto',
          minHeight: 'min(72vw, 760px)',
          overflow: 'hidden',
          backgroundImage: `linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.8)), url('${activeService.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.7s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(10px)',
            background: isDark ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.22)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: 'clamp(20px, 3vw, 28px)',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: 520 }}>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.62)',
              }}
            >
              Our Services
            </p>
            <h2
              style={{
                margin: '10px 0 0',
                color: '#ffffff',
                fontSize: 'clamp(1.7rem, 3.6vw, 3.4rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.05em',
                fontWeight: 500,
                fontFamily: 'Helvetica, Arial, sans-serif',
              }}
            >
              Services that open like featured stories
            </h2>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: 'min(50vw, 460px)',
            cursor: 'grab',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <button
            onClick={goPrev}
            style={{
              position: 'absolute',
              left: 'max(42% - min(29vw, 280px) - 180px, 16px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 8,
              width: 46,
              height: 46,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgb(238, 238, 238)',
              color: '#000000',
              backdropFilter: 'blur(10px)',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Previous service"
          >
         <span>{"<"}</span> {/* <ChevronLeft size={18} strokeWidth={2.25} /> */}
          </button>

          <button
            onClick={goNext}
            style={{
              position: 'absolute',
              right: 'max(42% - min(29vw, 280px) - 180px, 16px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 8,
              width: 46,
              height: 46,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgb(238, 238, 238)',
              color: '#000000',
              backdropFilter: 'blur(10px)',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Next service"
          >
          
           <span>{">"}</span>  {/* <ChevronRight size={18} strokeWidth={2.25} /> */}
          </button>

          {SERVICES.map((service, index) => {
            const rawOffset = index - activeIndex
            let offset = rawOffset

            if (rawOffset > 2) offset = rawOffset - SERVICES.length
            if (rawOffset < -2) offset = rawOffset + SERVICES.length

            return (
              <ServiceCard
                key={service.title}
                service={service}
                offset={offset}
                isActive={offset === 0}
                hasEntered={hasEntered}
              />
            )
          })}
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            padding: '0 20px 26px',
            marginTop: 'clamp(12px, 3vw, 22px)',
            flexWrap: 'wrap',
          }}
        >
          {activeService.meta.map((item) => (
            <span
              key={item}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 68,
                padding: '8px 14px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.13)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#ffffff',
                fontSize: 11,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                backdropFilter: 'blur(10px)',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

    </section>
  )
}