import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";


// ─── Data ────────────────────────────────────────────────────────────────────
const SERVICES = [
  { label:"Social Media Marketing",  tag:"30% Emissions", desc:"The clean industrial revolution starts with transforming how we make everything in the world—from steel and cement to everyday materials.", link:"/service/social-media", video:"/Social Media.mp4" },
  { label:"Audio Visual Production",    tag:"25% Emissions", desc:"Powering the world with clean energy means rebuilding the grid from the ground up—smarter, faster, and renewable at every node.", link:"/service/audio-visual", video:"/Audio-Visual.mp4" },
  { label:"Brand Creation",    tag:"19% Emissions", desc:"Feeding a growing planet without burning it requires reinventing the way we grow, harvest, and deliver food across the globe.", link:"/service/brand-creation", video:"/Brand Creation.mp4" },
  { label:"Media Buying", tag:"16% Emissions", desc:"Moving people and goods with zero emissions demands a complete transformation of vehicles, fuels, and infrastructure.", link:"/service/media-buying", video:"/Media Buying.mp4" },
  { label:"Website Development",      tag:"6% Emissions", desc:"The buildings we live and work in must evolve—becoming zero-carbon structures that generate as much energy as they consume.", link:"/service/web-development", video:"/Website Development.mp4" },
  { label:"SEO Optimization",     tag:"Cross-Sector", desc:"Breakthrough technologies—from long-duration storage to direct air capture—unlock solutions that transcend any single sector.", link:"/service/seo", video:"/SEO Optimization.mp4" },
];

const INIT = [
  { top:20, left:52 }, { top:15,  left:70 }, { top:40, left:62 },
  { top:58, left:76 }, { top:75, left:56 }, { top:50, left:46 },
];
const EXIT_V = [
  null,
  { x:25,  y:120 }, { x:-20, y:140 }, { x:35,  y:110 },
  { x:-30, y:125 }, { x:10,  y:135 },
];
const TW = 12;
const TH = 8;



// ─── Helpers ─────────────────────────────────────────────────────────────────
const clamp = (v,a,b) => Math.min(Math.max(v,a),b);
const inv   = (a,b,v) => clamp((v-a)/(b-a),0,1);
const lerp  = (a,b,t) => a+(b-a)*t;
const eOut  = (t,p=3) => 1-Math.pow(1-t,p);
const eIO   = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const css   = (el,s)  => { if(el) Object.assign(el.style,s); };

// ─────────────────────────────────────────────────────────────────────────────
export default function ServicesBanner() {
    const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState(0);
  const [dotsVisible, setDotsVisible] = useState(false);
  const [btnIdx,      setBtnIdx     ] = useState(0);

  const introRef    = useRef(null);
  const thumb0Ref   = useRef(null);
  const grad0Ref    = useRef(null);
  const cont0Ref    = useRef(null);
  const thumbRefs   = useRef([]);
  const cardRefs    = useRef([]);
  const contentRefs = useRef([]);
  const video0Ref   = useRef(null);
  const cardVideoRefs = useRef([]);

  const lblWrapRef  = useRef(null);
  const lblGrayRef  = useRef(null);
  const lblGreenRef = useRef(null);

  const outroWrapRef = useRef(null);

  const L      = useRef({});
  const rawY   = useRef(0);
  const smoY   = useRef(0);
  const prevP  = useRef(-1);
  const rafId  = useRef(null);

  // ── computeLayout ──────────────────────────────────────────────────────────
  const computeLayout = useCallback(() => {
    const VH = window.innerHeight;
    const VW = window.innerWidth;

    const cardW    = Math.min(VW * 0.92, 1250);
    const cardH    = Math.min(VH * 0.72, 520);
    const th0W     = VW * TW / 100;
    const th0H     = VW * TH / 100;
    const th0CX    = VW * INIT[0].left / 100 + th0W / 2;
    const th0CY    = VH * INIT[0].top  / 100 + th0H / 2;
    const cardCX   = VW / 2;
    const cardCY   = VH / 2;
    const cardTopY = cardCY - cardH / 2;

    const introFade    = VH * 0.55;
    const scatterStart = VH * 0.40;
    const scatterEnd   = VH * 1.80;
    const morphStart   = VH * 0.45;
    const morphEnd     = VH * 2.60;
    const sliderStart  = morphEnd;
    const segH         = VH * 1.30;
    const sliderEnd    = sliderStart + segH * (SERVICES.length - 1);
    const outroStart   = sliderEnd + VH * 0.15;
    const outroEnd     = outroStart + VH * 0.80;

    L.current = {
      VH, VW, cardW, cardH,
      th0W, th0H, th0CX, th0CY, cardCX, cardCY, cardTopY,
      introFade, scatterStart, scatterEnd,
      morphStart, morphEnd,
      sliderStart, segH, sliderEnd,
      outroStart, outroEnd,
    };

    const wrap = lblWrapRef.current;
    if (!wrap) return;

    wrap.style.visibility = 'hidden';
    wrap.style.height     = '200px';
    wrap.style.top        = '0px';

    const span = lblGrayRef.current;
    let textH = 0;
    if (span) {
      const r = span.getBoundingClientRect();
      textH = r.height;
    }
    if (textH < 20) {
      const fs = parseFloat(window.getComputedStyle(wrap).fontSize) || 80;
      textH = Math.ceil(fs * 1.1);
    }

    wrap.style.height     = `${textH}px`;
    wrap.style.top        = `${cardTopY - textH / 2}px`;
    wrap.style.visibility = '';
  }, []);

  // ── draw ──────────────────────────────────────────────────────────────────
  const draw = useCallback((sy) => {
    const {
      VH, cardW, cardH,
      th0W, th0H, th0CX, th0CY, cardCX, cardCY, cardTopY,
      introFade, scatterStart, scatterEnd,
      morphStart, morphEnd,
      sliderStart, segH, sliderEnd,
      outroStart, outroEnd,
    } = L.current;
    if (!VH) return;

    // ── Intro ────────────────────────────────────────────────────────────────
    const iT = inv(0, introFade, sy);
    css(introRef.current, {
      opacity:   `${1 - iT}`,
      transform: `translateY(-50%) translateX(${-iT * 90}px)`,
    });

    // ── Scatter thumbs [1-5] ─────────────────────────────────────────────────
    for (let i = 1; i < 6; i++) {
      const el = thumbRefs.current[i];
      if (!el) continue;
      const stag = (i - 1) * 0.07;
      const t    = clamp(inv(scatterStart, scatterEnd, sy) - stag, 0, 1);
      const e    = eOut(t, 2.5);
      css(el, {
        transform: `translate(${EXIT_V[i].x * e}vw, ${EXIT_V[i].y * e}vh) scale(${lerp(1, 0.75, e)})`,
        opacity:   `${clamp(1 - e * 1.6, 0, 1)}`,
      });
    }

    // ── Thumb[0] morph ───────────────────────────────────────────────────────
    const mT   = inv(morphStart, morphEnd, sy);
    const ePos = eOut(inv(0,    0.65, mT), 3);
    const eSz  = eOut(inv(0,    0.70, mT), 3);
    const eBr  = eOut(inv(0,    0.70, mT), 2);
    const eG   = eOut(inv(0.55, 0.90, mT), 2);
    const eC   = eOut(inv(0.66, 1.00, mT), 3);

    const curCX = lerp(th0CX, cardCX, ePos);
    const curCY = lerp(th0CY, cardCY, ePos);
    const curW  = lerp(th0W, cardW, eSz);
    const curH  = lerp(th0H, cardH, eSz);
    const handoff = clamp(1 - (sy - sliderStart) / 80, 0, 1);

    if (sy >= sliderStart + 80) {
      css(thumb0Ref.current, { opacity: '0', pointerEvents: 'none' });
    } else if (mT > 0) {
      css(thumb0Ref.current, {
        position:      'fixed',
        left:          `${curCX - curW / 2}px`,
        top:           `${curCY - curH / 2}px`,
        width:         `${curW}px`,
        height:        `${curH}px`,
        borderRadius:  `${lerp(0, 0, eBr)}px`,
        transform:     'none',
        opacity:       `${sy >= sliderStart ? handoff : 1}`,
        zIndex:        '20',
        pointerEvents: 'none',
        overflow:      'hidden',
      });
      css(grad0Ref.current, { opacity: `${eG}` });
      css(cont0Ref.current, {
        opacity:   `${eC}`,
        transform: `translateY(${lerp(40, 0, eC)}px)`,
      });
    } else {
      css(thumb0Ref.current, {
        position:     'absolute',
        left:         `${INIT[0].left}%`,
        top:          `${INIT[0].top}%`,
        width:        `${TW}vw`,
        height:       `${TH}vw`,
        borderRadius: '0px',
        transform:    'none',
        opacity:      '1',
        zIndex:       '20',
        overflow:     'hidden',
      });
      css(grad0Ref.current,  { opacity: '0' });
      css(cont0Ref.current,  { opacity: '0', transform: 'translateY(40px)' });
    }

    // ── Split label ──────────────────────────────────────────────────────────
    const inSlider   = sy >= sliderStart;
    const afterCards = sy > sliderEnd + VH * 0.05;
    setDotsVisible(inSlider && !afterCards);

    let lblOp = 0;
    if (!inSlider) {
      // Fade in at end of morph
      lblOp = eOut(inv(0.72, 1.0, mT), 2);
    } else if (!afterCards) {
      // Show label only when card is stable; hide during transition swap
      const rawIdx2 = inv(sliderStart, sliderEnd, sy) * (SERVICES.length - 1);
      const localT2 = rawIdx2 - Math.floor(clamp(rawIdx2, 0, SERVICES.length - 2));
      if (localT2 < 0.18) {
        lblOp = clamp(1 - localT2 * (1 / 0.18), 0, 1); // fade out
      } else if (localT2 > 0.82) {
        lblOp = clamp((localT2 - 0.82) * (1 / 0.18), 0, 1); // fade in
      } else {
        lblOp = 0; // fully hidden during swap
      }
    } else {
      const fadeOutT = inv(sliderEnd + VH * 0.05, sliderEnd + VH * 0.35, sy);
      lblOp = clamp(1 - eOut(fadeOutT, 2), 0, 1);
    }

    css(lblWrapRef.current, {
      opacity:   `${lblOp}`,
      transform: `translateY(${lerp(-10, 0, clamp(lblOp * 2, 0, 1))}px)`,
    });

    const updateLabel = idx => {
      const t = SERVICES[idx].label;
      if (lblGrayRef.current)  lblGrayRef.current.textContent  = t;
      if (lblGreenRef.current) lblGreenRef.current.textContent = t;
    };

    // ── Outro ────────────────────────────────────────────────────────────────
    const outroT  = inv(outroStart, outroEnd, sy);
    const outroOp = eOut(outroT, 2.5);
    css(outroWrapRef.current, {
      opacity:       `${outroOp}`,
      pointerEvents: outroOp > 0.05 ? 'all' : 'none',
    });

    // ── Slider cards ─────────────────────────────────────────────────────────
    if (!inSlider) {
      if (prevP.current !== 0) {
        prevP.current = 0;
        updateLabel(0);
        setActivePanel(0);
        setBtnIdx(0);
      }
      cardRefs.current.forEach((el, i) => {
        css(el, {
          opacity:   '0',
          transform: i === 0 ? 'translateY(0) scale(1)' : 'translateY(115%) scale(0.9)',
          zIndex:    '5',
        });
        css(contentRefs.current[i], { opacity: '0', transform: 'translateY(40px)' });
      });
      return;
    }

    const rawIdx = inv(sliderStart, sliderEnd, sy) * (SERVICES.length - 1);
    const pIdx   = clamp(Math.floor(rawIdx), 0, SERVICES.length - 2);
    const localT = rawIdx - pIdx;

    const labelCard = localT < 0.5 ? pIdx : pIdx + 1;
    if (labelCard !== prevP.current) {
      prevP.current = labelCard;
      setActivePanel(labelCard);
      setBtnIdx(labelCard);
      updateLabel(labelCard);
    }

    for (let i = 0; i < SERVICES.length; i++) {
      const card    = cardRefs.current[i];
      const content = contentRefs.current[i];
      if (!card) continue;

      if (i < pIdx) {
        css(card,    { opacity: '0', transform: 'translateY(-120%) scale(0.90)', zIndex: '5' });
        css(content, { opacity: '0', transform: 'translateY(0)' });
      } else if (i === pIdx) {
        const e = eIO(localT);
        css(card, {
          opacity:   `${lerp(1, 0, eOut(localT, 2))}`,
          transform: `translateY(${lerp(0, -118, e)}%) scale(${lerp(1.0, 0.90, e)})`,
          zIndex:    '7',
        });
        css(content, {
          opacity:   `${clamp(1 - localT * 2.5, 0, 1)}`,
          transform: `translateY(${localT * -24}px)`,
        });
      } else if (i === pIdx + 1) {
        const e  = eIO(localT);
        const cT = eOut(clamp((localT - 0.38) / 0.62, 0, 1), 2);
        css(card, {
          opacity:   `${lerp(0, 1, eOut(localT, 2))}`,
          transform: `translateY(${lerp(118, 0, e)}%) scale(${lerp(0.90, 1.0, e)})`,
          zIndex:    '8',
        });
        css(content, {
          opacity:   `${cT}`,
          transform: `translateY(${lerp(36, 0, cT)}px)`,
        });
      } else {
        css(card,    { opacity: '0', transform: 'translateY(115%) scale(0.9)', zIndex: '5' });
        css(content, { opacity: '0', transform: 'translateY(40px)' });
      }
    }
  }, []);

  // ── Mount ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    computeLayout();

    if (document.fonts) {
      document.fonts.ready.then(() => computeLayout());
    }
    const t1 = setTimeout(computeLayout, 150);
    const t2 = setTimeout(computeLayout, 600);
    const t3 = setTimeout(computeLayout, 1500);

    window.addEventListener('resize', computeLayout);
    window.addEventListener('scroll', () => { rawY.current = window.scrollY; }, { passive: true });

    const tick = () => {
      smoY.current = lerp(smoY.current, rawY.current, 0.09);
      draw(smoY.current);
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      window.removeEventListener('resize', computeLayout);
      cancelAnimationFrame(rafId.current);
    };
  }, [computeLayout, draw]);

  const scrollToPanel = i => {
    const { sliderStart, segH } = L.current;
    window.scrollTo({ top: sliderStart + segH * i + 60, behavior: 'smooth' });
  };

  const totalH = `calc(${SERVICES.length - 1} * 130vh + 560vh)`;

  const HALF = {
    position:       'absolute',
    inset:          '0',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    fontFamily:     "'Bebas Neue', sans-serif",
    fontSize:       'clamp(54px, 9.8vw, 144px)',
    lineHeight:     '1',
    whiteSpace:     'nowrap',
    letterSpacing:  '2px',
    userSelect:     'none',
    pointerEvents:  'none',
  };

  // Shared video props for background videos
  const videoBg = {
    position:   'absolute',
    inset:      0,
    width:      '100%',
    height:     '100%',
    objectFit:  'cover',
    display:    'block',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;600;700&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { background:#080808; overflow-x:hidden; }
        :root { --accent:#fec315; }
      `}</style>

      <div style={{ height: totalH, position: 'relative', background: '#080808' }}>
        {/* ── Fixed stage ─────────────────────────────────────────────────── */}
        <div style={{ position: 'fixed', inset: 0, background: '#080808' }}>

          {/* NAV */}
          <nav style={{ position:'absolute', inset:'0 0 auto 0', zIndex:300, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 40px', pointerEvents:'none' }}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" style={{ pointerEvents:'all' }}>
              {[[20,6],[30,10],[34,20],[30,30],[20,34],[10,30],[6,20],[10,10]].map(([cx,cy],k) =>
                <circle key={k} cx={cx} cy={cy} r="2.8" fill="white" opacity=".85"/>)}
            </svg>
            <button style={{ background:'none', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', gap:'5px', pointerEvents:'all' }}>
              {[0,1,2].map(k => <span key={k} style={{ display:'block', width:'22px', height:'1.5px', background:'#fff', borderRadius:'2px' }}/>)}
            </button>
          </nav>

          {/* INTRO TEXT */}
          <div ref={introRef} style={{ position:'absolute', top:'50%', left:'5%', transform:'translateY(-50%)', maxWidth:'530px', zIndex:20, willChange:'transform,opacity', pointerEvents:'none' }}>
            <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(19px,2.4vw,29px)', fontWeight:600, lineHeight:1.2, color:'#fff', letterSpacing:'-0.3px' }}>
              We craft experiences that connect, campaigns that convert, and strategies that transform{' '}
              <span style={{ color:'var(--accent)' }}>your brand into a force of opportunity</span>
            </h1>
          </div>

          {/* THUMB[0] — morphs scatter thumbnail → full card */}
          <div ref={thumb0Ref} style={{ position:'absolute', top:`${INIT[0].top}%`, left:`${INIT[0].left}%`, width:`${TW}vw`, height:`${TH}vw`, borderRadius:'0px', overflow:'hidden', zIndex:20, pointerEvents:'auto' }}>
            {/* Video replaces image */}
            <video
              ref={video0Ref}
              src={SERVICES[0].video}
              autoPlay
              loop
              muted
              playsInline
              style={videoBg}
            />
            <div ref={grad0Ref} style={{ position:'absolute', inset:0, opacity:0 }}/>
            <div ref={cont0Ref} style={{ position:'absolute', bottom:0, left:0, right:0, padding:'22px 30px 28px', zIndex:5, opacity:0, transform:'translateY(40px)', willChange:'opacity,transform' }}>
              <div style={{ display:'inline-block', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.22)', color:'#fff', fontSize:'11px', fontWeight:600, letterSpacing:'1.4px', textTransform:'uppercase', padding:'5px 13px', borderRadius:'0px', marginBottom:'11px', fontFamily:"'DM Sans',sans-serif" }}>{SERVICES[0].tag}</div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(13px,1.4vw,16px)', fontWeight:400, color:'rgba(255,255,255,0.88)', lineHeight:1.65, maxWidth:'420px' }}>{SERVICES[0].desc}</p>
            </div>
          </div>

          {/* SCATTER THUMBS [1-5] */}
          {SERVICES.slice(1).map((s, idx) => {
            const i = idx + 1;
            return (
              <div key={`th-${i}`} ref={el => thumbRefs.current[i] = el}
                style={{ position:'absolute', top:`${INIT[i].top}%`, left:`${INIT[i].left}%`, width:`${TW}vw`, height:`${TH}vw`, borderRadius:'0px', overflow:'hidden', willChange:'transform,opacity', zIndex:8-i }}>
                <video
                  src={s.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                />
              </div>
            );
          })}

          {/* LABEL — positioned above card, hidden during transitions */}
          <div
            ref={lblWrapRef}
            style={{
              position:      'fixed',
              top:           '0px',
              left:          '0',
              width:         '100vw',
              height:        '80px',
              zIndex:        150,
              opacity:       0,
              willChange:    'opacity,transform',
              pointerEvents: 'none',
              overflow:      'visible',
            }}
          >
            {/* Gray — above card (dark bg visible) */}
            <span ref={lblGrayRef} style={{ ...HALF, color:'#ffffff', clipPath:'inset(0 0 50% 0)' }}>
              {SERVICES[0].label}
            </span>
            {/* Accent — below card top (over video) */}
            <span ref={lblGreenRef} style={{ ...HALF, color:'var(--accent)', clipPath:'inset(50% 0 0 0)' }}>
              {SERVICES[0].label}
            </span>
          </div>

          {/* SLIDER CARDS [0-5] — videos instead of images */}
          {SERVICES.map((s, i) => (
            <div key={`panel-${i}`} onClick={() => navigate(s.link)} style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', cursor: 'pointer', pointerEvents: activePanel === i ? 'auto' : 'none', zIndex:5 }}>
              <div
                ref={el => cardRefs.current[i] = el}
                style={{ position:'relative', width:'92vw', maxWidth:'1250px', height:'72vh', maxHeight:'520px', borderRadius:'0px', overflow:'hidden', opacity:0, transform: i===0 ? 'translateY(0) scale(1)' : 'translateY(115%) scale(0.9)', willChange:'transform,opacity', zIndex:2, flexShrink:0 }}
              >
                {/* Video background */}
                <video
                  ref={el => cardVideoRefs.current[i] = el}
                  src={s.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={videoBg}
                />
                <div style={{ position:'absolute', inset:0 }}/>
                <div
                  ref={el => contentRefs.current[i] = el}
                  style={{ position:'absolute', bottom:0, left:0, right:0, padding:'22px 30px 28px', zIndex:4, opacity:0, transform:'translateY(40px)', willChange:'opacity,transform' }}
                >
                  <div style={{ display:'inline-block', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.22)', color:'#fff', fontSize:'11px', fontWeight:700, letterSpacing:'1.4px', textTransform:'uppercase', padding:'5px 13px', borderRadius:'0px', marginBottom:'11px', fontFamily:"'DM Sans',sans-serif" }}>{s.tag}</div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(13px,1.4vw,16px)', fontWeight:400, color:'rgba(255,255,255,0.88)', lineHeight:1.65, maxWidth:'420px' }}>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}

          {/* ══════════════════════════════════════════════════════════════════
              OUTRO — plain black, centered text reveal + "Full Portfolio" CTA
              Matches screenshot exactly: dark bg, white/accent text, pill button
          ══════════════════════════════════════════════════════════════════ */}
          <div
            ref={outroWrapRef}
            style={{
              position:      'absolute',
              inset:         0,
              background:    '#080808',
              opacity:       0,
              willChange:    'opacity,transform',
              pointerEvents: 'none',
              zIndex:        12,
            }}
          >
            {/* Centered heading */}
            <div style={{
              position:       'absolute',
              inset:          0,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}>
              <h2 style={{
                fontFamily:    "'DM Sans', sans-serif",
                fontSize:      'clamp(26px, 4.2vw, 60px)',
                fontWeight:    700,
                color:         '#ffffff',
                lineHeight:    1.18,
                textAlign:     'center',
                maxWidth:      '680px',
                letterSpacing: '-0.4px',
              }}>
                This is{' '}
                <span style={{ color: 'var(--accent)' }}>creative innovation</span>
                <br/>on a global scale
              </h2>
            </div>

            {/* Button pinned to bottom — same position as the slider CTA */}
            <div style={{
              position:        'absolute',
              bottom:          '28px',
              left:            '50%',
              transform:       'translateX(-50%)',
              display:         'flex',
              justifyContent:  'center',
            }}>
              <button
                style={{
                  background:    'var(--accent)',
                  color:         '#000',
                  border:        'none',
                  fontFamily:    "'DM Sans', sans-serif",
                  fontSize:      '13px',
                  fontWeight:    700,
                  letterSpacing: '0.3px',
                  padding:       '0 40px',
                  height:        '46px',
                  borderRadius:  '10px',
                  cursor:        'pointer',
                  minWidth:      '200px',
                  whiteSpace:    'nowrap',
                }}
              >
                Full Portfolio
              </button>
            </div>
          </div>

        </div>

        {/* SIDE DOTS */}
        <div style={{ position:'fixed', right:'22px', top:'50%', transform:'translateY(-50%)', zIndex:200, display:'flex', flexDirection:'column', gap:'10px', opacity: dotsVisible ? 1 : 0, transition:'opacity 0.4s', pointerEvents: dotsVisible ? 'all' : 'none' }}>
          {SERVICES.map((_, i) => (
            <button key={i} onClick={() => scrollToPanel(i)}
              style={{ width:6, height:6, borderRadius:'50%', border:`1.5px solid ${activePanel===i ? 'var(--accent)' : 'rgba(255,255,255,0.38)'}`, background: activePanel===i ? 'var(--accent)' : 'transparent', cursor:'pointer', padding:0, transform: activePanel===i ? 'scale(1.5)' : 'scale(1)', transition:'all 0.28s' }}/>
          ))}
        </div>

        {/* BOTTOM CTA — per-panel during slider */}
        <div style={{ position:'fixed', bottom:'28px', left:'50%', transform:'translateX(-50%)', zIndex:200, opacity: dotsVisible ? 1 : 0, transition:'opacity 0.4s', pointerEvents: dotsVisible ? 'all' : 'none' }}>
          <button onClick={() => navigate(SERVICES[activePanel].link)} style={{ background:'var(--accent)', color:'#000', border:'none', fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:700, letterSpacing:'0.3px', padding:'0 28px', height:'46px', borderRadius:'10px', cursor: 'pointer', pointerEvents: 'auto', minWidth:'230px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
            <div style={{ height:'18px', overflow:'hidden', lineHeight:'18px' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', transform:`translateY(-${btnIdx*18}px)`, transition:'transform 0.38s cubic-bezier(0.76,0,0.24,1)' }}>
                {SERVICES.map((s, i) => (
                  <span key={i} style={{ height:'18px', lineHeight:'18px', whiteSpace:'nowrap', display:'block' }}>{s.companies} {s.label} Companies</span>
                ))}
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}