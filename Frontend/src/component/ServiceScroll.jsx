import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const SERVICES = [
  { label:"Social Media Marketing",  tag:"30% Emissions", desc:"The clean industrial revolution starts with transforming how we make everything in the world—from steel and cement to everyday materials.", link:"/service/social-media", video:"/Social Media.mp4" },
  { label:"Audio Visual Production", tag:"25% Emissions", desc:"Powering the world with clean energy means rebuilding the grid from the ground up—smarter, faster, and renewable at every node.", link:"/service/audio-visual", video:"/Audio-Visual.mp4" },
  { label:"Brand Creation",          tag:"19% Emissions", desc:"Feeding a growing planet without burning it requires reinventing the way we grow, harvest, and deliver food across the globe.", link:"/service/brand-creation", video:"/Brand Creation.mp4" },
  { label:"Media Buying",            tag:"16% Emissions", desc:"Moving people and goods with zero emissions demands a complete transformation of vehicles, fuels, and infrastructure.", link:"/service/media-buying", video:"/Media Buying.mp4" },
  { label:"Website Development",     tag:"6% Emissions",  desc:"The buildings we live and work in must evolve—becoming zero-carbon structures that generate as much energy as they consume.", link:"/service/web-development", video:"/Website Development.mp4" },
  { label:"SEO Optimization",        tag:"Cross-Sector",  desc:"Breakthrough technologies—from long-duration storage to direct air capture—unlock solutions that transcend any single sector.", link:"/service/seo", video:"/SEO Optimization.mp4" },
];

const INIT = [
  { top:20, left:52 }, { top:15, left:70 }, { top:40, left:62 },
  { top:58, left:76 }, { top:75, left:56 }, { top:50, left:46 },
];
const EXIT_V = [
  null,
  { x:25,  y:120 }, { x:-20, y:140 }, { x:35,  y:110 },
  { x:-30, y:125 }, { x:10,  y:135 },
];
const TW = 12;
const TH = 8;
const LABEL_FADE_MS = 320;

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const clamp = (v,a,b) => Math.min(Math.max(v,a),b);
const inv   = (a,b,v) => clamp((v-a)/(b-a),0,1);
const lerp  = (a,b,t) => a+(b-a)*t;
const eOut  = (t,p=3) => 1-Math.pow(1-t,p);
const eIO   = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const css   = (el,s)  => { if(el) Object.assign(el.style,s); };

export default function ServicesBanner() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState(0);
  const [dotsVisible, setDotsVisible] = useState(false);
  const [btnIdx,      setBtnIdx     ] = useState(0);

  const introRef      = useRef(null);
  const thumb0Ref     = useRef(null);
  const grad0Ref      = useRef(null);
  const cont0Ref      = useRef(null);
  const thumbRefs     = useRef([]);
  const cardRefs      = useRef([]);
  const contentRefs   = useRef([]);
  const video0Ref     = useRef(null);
  const cardVideoRefs = useRef([]);
  const lblWrapRef    = useRef(null);

  const lblLayerARefs  = useRef({ gray: null, green: null });
  const lblLayerBRefs  = useRef({ gray: null, green: null });
  const activeLblLayer = useRef('A');
  const lblFadeTimer   = useRef(null);
  const outroWrapRef   = useRef(null);

  const L      = useRef({});
  const rawY   = useRef(0);
  const smoY   = useRef(0);
  const prevP  = useRef(-1);
  const rafId  = useRef(null);

  const crossfadeLabel = useCallback((text) => {
    if (lblFadeTimer.current) clearTimeout(lblFadeTimer.current);
    const isA      = activeLblLayer.current === 'A';
    const incoming = isA ? lblLayerBRefs.current : lblLayerARefs.current;
    const outgoing = isA ? lblLayerARefs.current : lblLayerBRefs.current;
    if (incoming.gray)  incoming.gray.textContent  = text;
    if (incoming.green) incoming.green.textContent = text;
    if (incoming.gray)  { incoming.gray.style.transition  = `opacity ${LABEL_FADE_MS}ms ease`; incoming.gray.style.opacity  = '1'; }
    if (incoming.green) { incoming.green.style.transition = `opacity ${LABEL_FADE_MS}ms ease`; incoming.green.style.opacity = '1'; }
    if (outgoing.gray)  { outgoing.gray.style.transition  = `opacity ${LABEL_FADE_MS}ms ease`; outgoing.gray.style.opacity  = '0'; }
    if (outgoing.green) { outgoing.green.style.transition = `opacity ${LABEL_FADE_MS}ms ease`; outgoing.green.style.opacity = '0'; }
    activeLblLayer.current = isA ? 'B' : 'A';
  }, []);

  const computeLayout = useCallback(() => {
    const VH = window.innerHeight;
    const VW = window.innerWidth;
    const mob = VW < 768;

    const cardW    = mob ? VW * 0.96 : Math.min(VW * 0.92, 1250);
    const cardH    = mob ? VH * 0.55 : Math.min(VH * 0.72, 520);
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
    const segH         = mob ? VH * 1.10 : VH * 1.30;
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

    const activeLayer = activeLblLayer.current === 'A' ? lblLayerARefs.current : lblLayerBRefs.current;
    const span = activeLayer.gray;
    let textH = 0;
    if (span) {
      const r = span.getBoundingClientRect();
      textH = r.height;
    }
    if (textH < 20) {
      const fs = parseFloat(window.getComputedStyle(wrap).fontSize) || (mob ? 44 : 80);
      textH = Math.ceil(fs * 1.1);
    }

    wrap.style.height     = `${textH}px`;
    wrap.style.top        = `${cardTopY - textH / 2}px`;
    wrap.style.visibility = '';
  }, []);

  const draw = useCallback((sy) => {
    const {
      VH, VW, cardW, cardH,
      th0W, th0H, th0CX, th0CY, cardCX, cardCY,
      introFade, scatterStart, scatterEnd,
      morphStart, morphEnd,
      sliderStart, segH, sliderEnd,
      outroStart, outroEnd,
    } = L.current;
    if (!VH) return;

    const mob = VW < 768;

    const iT = inv(0, introFade, sy);
    css(introRef.current, {
      opacity:   `${1 - iT}`,
      transform: mob
        ? `translateY(-50%) translateY(${-iT * 40}px)`
        : `translateY(-50%) translateX(${-iT * 90}px)`,
    });

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

    const mT   = inv(morphStart, morphEnd, sy);
    const ePos = eOut(inv(0,    0.65, mT), 3);
    const eSz  = eOut(inv(0,    0.70, mT), 3);
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
        borderRadius:  '0px',
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
        left:         mob ? '50%' : `${INIT[0].left}%`,
        top:          mob ? '22%' : `${INIT[0].top}%`,
        width:        mob ? '56vw' : `${TW}vw`,
        height:       mob ? '37vw' : `${TH}vw`,
        borderRadius: '0px',
        transform:    mob ? 'translateX(-50%)' : 'none',
        opacity:      '1',
        zIndex:       '20',
        overflow:     'hidden',
      });
      css(grad0Ref.current,  { opacity: '0' });
      css(cont0Ref.current,  { opacity: '0', transform: 'translateY(40px)' });
    }

    const inSlider   = sy >= sliderStart;
    const afterCards = sy > sliderEnd + VH * 0.05;
    setDotsVisible(inSlider && !afterCards);

    let lblOp = 0;
    if (!inSlider) {
      lblOp = eOut(inv(0.72, 1.0, mT), 2);
    } else if (!afterCards) {
      lblOp = 1;
    } else {
      const fadeOutT = inv(sliderEnd + VH * 0.05, sliderEnd + VH * 0.35, sy);
      lblOp = clamp(1 - eOut(fadeOutT, 2), 0, 1);
    }

    css(lblWrapRef.current, {
      opacity:   `${lblOp}`,
      transform: `translateY(${lerp(-10, 0, clamp(lblOp * 2, 0, 1))}px)`,
    });

    const outroT  = inv(outroStart, outroEnd, sy);
    const outroOp = eOut(outroT, 2.5);
    css(outroWrapRef.current, {
      opacity:       `${outroOp}`,
      pointerEvents: outroOp > 0.05 ? 'all' : 'none',
    });

    if (!inSlider) {
      if (prevP.current !== 0) {
        prevP.current = 0;
        crossfadeLabel(SERVICES[0].label);
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
      crossfadeLabel(SERVICES[labelCard].label);
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
  }, [crossfadeLabel]);

  useEffect(() => {
    const layerA = lblLayerARefs.current;
    const layerB = lblLayerBRefs.current;
    if (layerA.gray)  { layerA.gray.textContent  = SERVICES[0].label; layerA.gray.style.opacity  = '1'; }
    if (layerA.green) { layerA.green.textContent = SERVICES[0].label; layerA.green.style.opacity = '1'; }
    if (layerB.gray)  { layerB.gray.textContent  = SERVICES[0].label; layerB.gray.style.opacity  = '0'; }
    if (layerB.green) { layerB.green.textContent = SERVICES[0].label; layerB.green.style.opacity = '0'; }

    computeLayout();
    if (document.fonts) document.fonts.ready.then(() => computeLayout());
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
      if (lblFadeTimer.current) clearTimeout(lblFadeTimer.current);
      window.removeEventListener('resize', computeLayout);
      cancelAnimationFrame(rafId.current);
    };
  }, [computeLayout, draw]);

  const scrollToPanel = i => {
    const { sliderStart, segH } = L.current;
    window.scrollTo({ top: sliderStart + segH * i + 60, behavior: 'smooth' });
  };

  const totalH = `calc(${SERVICES.length - 1} * 130vh + 560vh)`;

  const HALF_BASE = {
    position:       'absolute',
    inset:          '0',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    fontFamily:     FONT,
    fontSize:       'clamp(30px, 7.5vw, 104px)',
    fontWeight:     700,
    lineHeight:     '1',
    whiteSpace:     'nowrap',
    letterSpacing:  '-1px',
    userSelect:     'none',
    pointerEvents:  'none',
    opacity:        '0',
  };

  // ── All white, no yellow ──────────────────────────────────────────────────
  const tagStyle = {
    display:       'inline-block',
    background:    'rgba(255,255,255,0.12)',
    border:        '1px solid rgba(255,255,255,0.22)',
    color:         '#fff',
    fontSize:      '11px',
    fontWeight:    600,
    letterSpacing: '1.4px',
    textTransform: 'uppercase',
    padding:       '5px 13px',
    borderRadius:  '0px',
    marginBottom:  '11px',
    fontFamily:    FONT,
  };

  const descStyle = {
    fontFamily: FONT,
    fontSize:   'clamp(13px, 1.4vw, 16px)',
    fontWeight: 400,
    color:      'rgba(255,255,255,0.88)',
    lineHeight: 1.65,
    maxWidth:   '420px',
  };

  const btnStyle = {
    background:    '#ffffff',       // white button
    color:         '#080808',       // dark text on white
    border:        'none',
    fontFamily:    FONT,
    fontSize:      '13px',
    fontWeight:    700,
    letterSpacing: '0.3px',
    padding:       '0 40px',
    height:        '46px',
    borderRadius:  '30px',
    cursor:        'pointer',
    whiteSpace:    'nowrap',
  };

  const videoBg = {
    position:  'absolute',
    inset:     0,
    width:     '100%',
    height:    '100%',
    objectFit: 'cover',
    display:   'block',
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { background:#080808; overflow-x:hidden; }
        :root { --accent:#ffffff; }

        @media (max-width: 767px) {
          .sb-intro {
            left: 50% !important;
            top: 42% !important;
            transform: translate(-50%, -50%) !important;
            text-align: center !important;
            max-width: 88vw !important;
            padding: 0 16px !important;
          }
          .sb-intro h1 {
            font-size: clamp(16px, 4.5vw, 22px) !important;
          }
          .sb-scatter-thumb {
            display: none !important;
          }
          .sb-card-content {
            padding: 14px 16px 18px !important;
          }
          .sb-desc {
            font-size: 12px !important;
            max-width: 100% !important;
            line-height: 1.55 !important;
          }
          .sb-tag {
            font-size: 10px !important;
            padding: 4px 10px !important;
            margin-bottom: 8px !important;
          }
          .sb-dots {
            right: 10px !important;
            gap: 8px !important;
          }
          .sb-cta-wrap {
            width: 90vw !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
          .sb-cta-btn {
            width: 100% !important;
            min-width: unset !important;
            font-size: 12px !important;
          }
          .sb-outro-inner {
            padding: 0 20px !important;
          }
          .sb-outro-heading {
            font-size: clamp(20px, 5.5vw, 32px) !important;
          }
          .sb-outro-btn {
            min-width: 80vw !important;
          }
          .sb-label-wrap {
            font-size: clamp(26px, 7vw, 52px) !important;
            letter-spacing: -0.5px !important;
          }
        }
      `}</style>

      <div style={{ height: totalH, position: 'relative', background: '#080808' }}>

        <div style={{ position: 'fixed', inset: 0, background: '#080808' }}>

          {/* INTRO TEXT */}
          <div
            ref={introRef}
            className="sb-intro"
            style={{
              position:      'absolute',
              top:           '50%',
              left:          '5%',
              transform:     'translateY(-50%)',
              maxWidth:      '530px',
              zIndex:        20,
              willChange:    'transform,opacity',
              pointerEvents: 'none',
            }}
          >
            <h1 style={{
              fontFamily:    FONT,
              fontSize:      'clamp(17px, 2.4vw, 29px)',
              fontWeight:    600,
              lineHeight:    1.2,
              color:         '#fff',
              letterSpacing: '-0.3px',
            }}>
              We craft experiences that connect, campaigns that convert, and strategies that transform{' '}
              {/* accent span now white — same as body text, just kept for structure */}
              <span style={{ color: '#ffffff' }}>your brand into a force of opportunity</span>
            </h1>
          </div>

          {/* THUMB[0] */}
          <div
            ref={thumb0Ref}
            style={{
              position:     'absolute',
              top:          `${INIT[0].top}%`,
              left:         `${INIT[0].left}%`,
              width:        `${TW}vw`,
              height:       `${TH}vw`,
              borderRadius: '0px',
              overflow:     'hidden',
              zIndex:       20,
              pointerEvents:'auto',
            }}
          >
            <video ref={video0Ref} src={SERVICES[0].video} autoPlay loop muted playsInline style={videoBg} />
            <div ref={grad0Ref} style={{ position: 'absolute', inset: 0, opacity: 0 }} />
            <div
              ref={cont0Ref}
              className="sb-card-content"
              style={{
                position:   'absolute',
                bottom:     0,
                left:       0,
                right:      0,
                padding:    '22px 30px 28px',
                zIndex:     5,
                opacity:    0,
                transform:  'translateY(40px)',
                willChange: 'opacity,transform',
              }}
            >
              <div className="sb-tag" style={tagStyle}>{SERVICES[0].tag}</div>
              <p className="sb-desc" style={descStyle}>{SERVICES[0].desc}</p>
            </div>
          </div>

          {/* SCATTER THUMBS [1-5] */}
          {SERVICES.slice(1).map((s, idx) => {
            const i = idx + 1;
            return (
              <div
                key={`th-${i}`}
                ref={el => thumbRefs.current[i] = el}
                className="sb-scatter-thumb"
                style={{
                  position:    'absolute',
                  top:         `${INIT[i].top}%`,
                  left:        `${INIT[i].left}%`,
                  width:       `${TW}vw`,
                  height:      `${TH}vw`,
                  borderRadius:'0px',
                  overflow:    'hidden',
                  willChange:  'transform,opacity',
                  zIndex:      8 - i,
                }}
              >
                <video src={s.video} autoPlay loop muted playsInline style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              </div>
            );
          })}

          {/* LABEL WRAPPER — both layers now white */}
          <div
            ref={lblWrapRef}
            className="sb-label-wrap"
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
            {/* Both top and bottom halves are white */}
            <span ref={el => { lblLayerARefs.current.gray  = el; }} style={{ ...HALF_BASE, color: '#ffffff', clipPath: 'inset(0 0 50% 0)' }} />
            <span ref={el => { lblLayerARefs.current.green = el; }} style={{ ...HALF_BASE, color: '#ffffff', clipPath: 'inset(50% 0 0 0)' }} />
            <span ref={el => { lblLayerBRefs.current.gray  = el; }} style={{ ...HALF_BASE, color: '#ffffff', clipPath: 'inset(0 0 50% 0)' }} />
            <span ref={el => { lblLayerBRefs.current.green = el; }} style={{ ...HALF_BASE, color: '#ffffff', clipPath: 'inset(50% 0 0 0)' }} />
          </div>

          {/* SLIDER CARDS */}
          {SERVICES.map((s, i) => (
            <div
              key={`panel-${i}`}
              onClick={() => navigate(s.link)}
              style={{
                position:      'absolute',
                inset:         0,
                display:       'flex',
                alignItems:    'center',
                justifyContent:'center',
                cursor:        'pointer',
                pointerEvents: activePanel === i ? 'auto' : 'none',
                zIndex:        5,
              }}
            >
              <div
                ref={el => cardRefs.current[i] = el}
                style={{
                  position:     'relative',
                  width:        'min(92vw, 1280px)',
                  height:       'min(72vh, 520px)',
                  borderRadius: '0px',
                  overflow:     'hidden',
                  opacity:      0,
                  transform:    i === 0 ? 'translateY(0) scale(1)' : 'translateY(115%) scale(0.9)',
                  willChange:   'transform,opacity',
                  zIndex:       2,
                  flexShrink:   0,
                }}
              >
                <video
                  ref={el => cardVideoRefs.current[i] = el}
                  src={s.video}
                  autoPlay loop muted playsInline
                  style={videoBg}
                />
                <div style={{ position: 'absolute', inset: 0 }} />
                <div
                  ref={el => contentRefs.current[i] = el}
                  className="sb-card-content"
                  style={{
                    position:   'absolute',
                    bottom:     0,
                    left:       0,
                    right:      0,
                    padding:    '22px 30px 28px',
                    zIndex:     4,
                    opacity:    0,
                    transform:  'translateY(40px)',
                    willChange: 'opacity,transform',
                  }}
                >
                  <div className="sb-tag" style={tagStyle}>{s.tag}</div>
                  <p className="sb-desc" style={descStyle}>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}

          {/* OUTRO */}
          <div
            ref={outroWrapRef}
            style={{
              position:      'absolute',
              inset:         0,
              background:    '#080808',
              opacity:       0,
              willChange:    'opacity',
              pointerEvents: 'none',
              zIndex:        12,
            }}
          >
            <div
              className="sb-outro-inner"
              style={{
                position:       'absolute',
                inset:          0,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
              }}
            >
              <h2
                className="sb-outro-heading"
                style={{
                  fontFamily:    FONT,
                  fontSize:      'clamp(26px, 4.2vw, 50px)',
                  fontWeight:    700,
                  color:         '#ffffff',
                  lineHeight:    1.18,
                  textAlign:     'center',
                  maxWidth:      '680px',
                  letterSpacing: '-0.2px',
                }}
              >
                This is{' '}
                <span style={{ color: '#ffffff' }}>creative innovation</span>
                <br />on a global scale
              </h2>
            </div>
            <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)' }}>
              <button className="sb-outro-btn" style={{ ...btnStyle, padding: '0 40px', minWidth: '200px' }}>
                Full Portfolio
              </button>
            </div>
          </div>

        </div>

        {/* SIDE DOTS — active dot now white filled with white border */}
        <div
          className="sb-dots"
          style={{
            position:      'fixed',
            right:         '22px',
            top:           '50%',
            transform:     'translateY(-50%)',
            zIndex:        200,
            display:       'flex',
            flexDirection: 'column',
            gap:           '10px',
            opacity:       dotsVisible ? 1 : 0,
            transition:    'opacity 0.4s',
            pointerEvents: dotsVisible ? 'all' : 'none',
          }}
        >
          {SERVICES.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPanel(i)}
              style={{
                width:        6,
                height:       6,
                borderRadius: '50%',
                border:       `1.5px solid ${activePanel === i ? '#ffffff' : 'rgba(255,255,255,0.38)'}`,
                background:   activePanel === i ? '#ffffff' : 'transparent',
                cursor:       'pointer',
                padding:      0,
                transform:    activePanel === i ? 'scale(1.5)' : 'scale(1)',
                transition:   'all 0.28s',
              }}
            />
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div
          className="sb-cta-wrap"
          style={{
            position:      'fixed',
            bottom:        '28px',
            left:          '50%',
            transform:     'translateX(-50%)',
            zIndex:        200,
            opacity:       dotsVisible ? 1 : 0,
            transition:    'opacity 0.4s',
            pointerEvents: dotsVisible ? 'all' : 'none',
          }}
        >
          <button
            className="sb-cta-btn"
            onClick={() => navigate(SERVICES[activePanel].link)}
            style={{
              ...btnStyle,
              padding:        '0 28px',
              minWidth:       '230px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              overflow:       'hidden',
            }}
          >
            <div style={{ height: '18px', overflow: 'hidden', lineHeight: '18px' }}>
              <div style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                transform:     `translateY(-${btnIdx * 18}px)`,
                transition:    'transform 0.38s cubic-bezier(0.76,0,0.24,1)',
              }}>
                {SERVICES.map((s, i) => (
                  <span key={i} style={{ height: '18px', lineHeight: '18px', whiteSpace: 'nowrap', display: 'block', fontFamily: FONT }}>
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </button>
        </div>

      </div>
    </>
  );
}