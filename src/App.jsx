/**
 * ============================================================
 *  PREMIUM PORTFOLIO — Single File React App
 *  Stack: React 18 + GSAP (ScrollTrigger) + Lenis
 *
 *  INSTALL:
 *    npm create vite@latest portfolio -- --template react
 *    cd portfolio
 *    npm install gsap lenis
 *
 *  Then replace src/App.jsx with this file.
 *  Add to src/index.css (or import a reset):
 *    * { margin: 0; padding: 0; box-sizing: border-box; }
 *    body { background: #0a0a0a; cursor: none; overflow-x: hidden; }
 *
 *  Google Fonts — add to index.html <head>:
 *  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet"/>
 * ============================================================
 */

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);


const DATA = {
  name: "</SHUBHAM>",
  surname: "SAINI",
  role: " ",
  tag: "Available for work · 2026",
  heroDesc:
    "Frontend developer & <em>creative technologist</em> crafting digital experiences at the intersection of design and engineering.",
  stats: [
    { val: "1st", lab: "Year B.Tech" },
    { val: "8+", lab: "Cgpa" },
    { val: "3", lab: "Community Roles" },
  ],
  aboutParas: [
    "I'm a <strong>Computer Engineering</strong> undergrad at Shri Vishwakarma Skill University based in Delhi NCR region. I specialize in building highly interactive and visually engaging web experiences , focusing primarily on React , React Native and briging modern UI UX designs to life. <br> Outside of pushing code, I'm highly active in my campus tech ecosystem - serving as a <strong>Google Student Ambassador</strong> and a core tech team member for <strong>TEDxSVSU.</strong> <br> Whether I'm building real world projects, tackling complex DSA problems in C++ , or experimenting with GSAP animations , I'm always looking to push my technical boundaries. <br> I am currently  seeking <strong>Frontend Development internship </strong> where i can collaborate with driven teams , bridge the gap between design and engineering , and build digital products that users actually love to experience ",
  ],
  projects: [
    {
      name: "MediBuddy",
      tags: ["React", "FastAPI", "AI" , "Taliwind"],
      desc: "AI-powered pharmacogenomics platform analyzing VCF files to generate personalized drug safety recommendations.",
      link: "https://medi-buddyy.netlify.app/",
      accent: "#ccff00",
      bg: "#0f120a",
      letter: "M",
    },
    {
      name: "TEDxSVSU",
      tags: ["HTML" , "CSS" , "JS" , "VENTA JS"],
      desc: "Official landing page for TEDxSVSU ",
      link: "https://tedxsvsu.in/",
      accent: "#ff4500",
      bg: "#120a0a",
      letter: "SVSU",
    },
  ],
  skills: [
    "REACT","PYTHON", "C/C++" , "HTML" , "CSS" , "JavaScript",
    "GSAP", "TAILWIND", "FASTAPI", "Google Cloud"
  ],
  email: "shubham.saini.dev.cse@gmail.com", // ✏️ your email
  social: [
    { label: "GitHub",   href: "https://github.com/shubhamsaini-commits" }, // ✏️ your links
    { label: "LinkedIn", href: "www.linkedin.com/in/shubham-saini-630502379" },
    { label: "Instagram",  href: "https://www.instagram.com/shubham_commits?igsh=MWtuMDNva2dncDZreA==" }
  ],
};

/* ============================================================
   STYLES  (injected into <head> once)
   ============================================================ */
const CSS = `
  :root {
    --bg: #0a0a0a;
    --surface: #111;
    --border: rgba(245,245,245,0.07);
    --text: #f5f5f5;
    --muted: rgba(245,245,245,0.38);
    --accent: #ccff00;
    --glass: rgba(10,10,10,0.78);
    --fh: 'Syne', sans-serif;
    --fb: 'DM Sans', sans-serif;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--fb);
    overflow-x: hidden;
    cursor: none;
  }
  a { color: inherit; text-decoration: none; }
  img { display: block; width: 100%; object-fit: cover; }
  ::selection { background: var(--accent); color: #000; }

  /* ── CURSOR ── */
  .c-dot {
    position: fixed; width: 8px; height: 8px;
    background: var(--accent); border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transform: translate(-50%,-50%);
    mix-blend-mode: difference;
    transition: width .18s, height .18s;
  }
  .c-ring {
    position: fixed; width: 36px; height: 36px;
    border: 1.5px solid var(--accent); border-radius: 50%;
    pointer-events: none; z-index: 9998;
    transform: translate(-50%,-50%);
    opacity: .55;
    transition: width .28s cubic-bezier(.23,1,.32,1),
                height .28s cubic-bezier(.23,1,.32,1), opacity .28s;
  }
  .cursor-grow .c-dot { width: 54px; height: 54px; }
  .cursor-grow .c-ring { opacity: 0; width: 62px; height: 62px; }

  /* ── LOADER ── */
  .loader {
    position: fixed; inset: 0; background: #0a0a0a;
    z-index: 8000; display: flex; align-items: center;
    justify-content: center; flex-direction: column; gap: 20px;
  }
  .loader-num {
    font-family: var(--fh);
    font-size: clamp(64px,12vw,136px);
    font-weight: 800; letter-spacing: -4px; line-height: 1;
  }
  .loader-track {
    width: 200px; height: 1px;
    background: rgba(255,255,255,0.1);
  }
  .loader-fill {
    height: 100%; width: 0%;
    background: var(--accent);
    transition: width .05s linear;
  }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 500;
    padding: 20px 5vw;
    display: flex; align-items: center; justify-content: space-between;
    background: var(--glass);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    transform: translateY(-100%);
  }
  .nav-logo {
    font-family: var(--fh); font-size: 18px;
    font-weight: 800; letter-spacing: -.5px;
  }
  .nav-logo em { color: var(--accent); font-style: normal; }
  .nav-links { display: flex; gap: 28px; }
  .nav-links a {
    font-size: 12px; font-weight: 500;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--muted); transition: color .2s;
  }
  .nav-links a:hover { color: var(--text); }
  .nav-cta {
    font-family: var(--fh); font-size: 12px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    padding: 9px 22px;
    border: 1.5px solid var(--accent); color: var(--accent);
    border-radius: 2px; cursor: none;
    transition: background .2s, color .2s;
  }
  .nav-cta:hover { background: var(--accent); color: #000; }

  /* ── HERO ── */
  .hero {
    min-height: 100svh; display: flex;
    flex-direction: column; justify-content: flex-end;
    /* padding-top pushes content clear of the fixed nav (~72px tall) */
    padding: 96px 5vw 8vh; position: relative; overflow: hidden;
  }
  .hero-noise {
    position: absolute; inset: 0; opacity: .032; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
  }
  .hero-orb {
    position: absolute; border-radius: 50%;
    filter: blur(110px); pointer-events: none;
  }
  .orb-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(204,255,0,.16) 0%, transparent 70%);
    top: -160px; right: -80px;
  }
  .orb-2 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, rgba(255,69,0,.11) 0%, transparent 70%);
    bottom: 80px; left: -60px;
  }
  .hero-tag {
    font-size: 11px; font-weight: 500;
    letter-spacing: .22em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 22px;
    opacity: 0; transform: translateY(18px);
  }
  .hero-headline {
    font-family: var(--fh);
    font-size: clamp(36px, 9.5vw, 156px);
    font-weight: 800; line-height: .92; letter-spacing: -2px;
  }
  .hero-line { overflow: hidden; display: block; }
  .hero-word { display: inline-block; transform: translateY(110%); }
  .hero-bottom {
    margin-top: 30px;
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 20px;
  }
  .hero-desc {
    max-width: 360px; color: var(--muted);
    font-size: clamp(14px,1.05vw,16px); line-height: 1.8;
    opacity: 0; transform: translateY(18px);
  }
  .hero-desc em { color: var(--text); font-style: normal; font-weight: 500; }
  .hero-scroll {
    display: flex; flex-direction: column;
    align-items: center; gap: 10px; opacity: 0;
  }
  .hero-scroll span {
    font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
    color: var(--muted); writing-mode: vertical-rl;
  }
  .scroll-line {
    width: 1px; height: 56px;
    background: linear-gradient(to bottom, var(--accent), transparent);
    animation: pulse 1.6s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { transform: scaleY(1); opacity: 1; }
    50% { transform: scaleY(.55); opacity: .35; }
  }

  /* ── ABOUT ── */
  .about { padding: 0 5vw; background: var(--bg); }
  .about-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    min-height: 150vh;
  }
  .about-left {
    position: sticky; top: 0; height: 100vh;
    display: flex; flex-direction: column;
    justify-content: center; padding-right: 8vw;
  }
  .eyebrow {
    font-size: 11px; letter-spacing: .22em;
    text-transform: uppercase; color: var(--accent);
    margin-bottom: 16px;
  }
  .section-title {
    font-family: var(--fh);
    font-size: clamp(34px,4.5vw,66px);
    font-weight: 800; line-height: .98; letter-spacing: -2px;
  }
  .about-ghost {
    font-family: var(--fh);
    font-size: clamp(80px,13vw,190px);
    font-weight: 800; color: transparent;
    -webkit-text-stroke: 1px rgba(245,245,245,0.055);
    line-height: 1; margin-top: 18px; letter-spacing: -6px;
    user-select: none;
  }
  .about-right {
    padding: 14vh 0 10vh;
    display: flex; flex-direction: column;
    gap: 36px; justify-content: center;
  }
  .about-para {
    font-size: clamp(15px,1.2vw,18px);
    line-height: 1.85; color: var(--muted);
  }
  .about-para strong { color: var(--accent); font-weight: 600; }
  .about-divider { width: 36px; height: 1px; background: var(--border); }
  .stats { display: flex; gap: 36px; }
  .stat-val {
    font-family: var(--fh); font-size: 34px;
    font-weight: 800; letter-spacing: -1px;
  }
  .stat-lab {
    font-size: 11px; letter-spacing: .14em;
    text-transform: uppercase; color: var(--muted); margin-top: 4px;
  }

  /* ── PROJECTS ── */
  .projects-outer { height: 280vh; }
  .projects-sticky {
    position: sticky; top: 0; height: 100vh;
    overflow: hidden; display: flex;
    flex-direction: column; justify-content: center;
  }
  .projects-header {
    padding: 0 5vw; margin-bottom: 36px;
    display: flex; align-items: flex-end; justify-content: space-between;
  }
  .proj-count {
    font-family: var(--fh); font-size: 13px;
    color: var(--muted); letter-spacing: .05em;
  }
  .proj-count strong { color: var(--text); }
  .projects-track {
    display: flex; gap: 24px;
    padding: 0 5vw; will-change: transform;
  }
  .proj-card {
    flex: 0 0 clamp(290px,34vw,500px);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px; overflow: hidden;
    cursor: none;
    transition: border-color .3s;
  }
  .proj-card:hover { border-color: rgba(204,255,0,.28); }
  .proj-img {
    height: 250px; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .proj-letter {
    font-family: var(--fh); font-weight: 800;
    font-size: clamp(60px,8vw,110px); letter-spacing: -4px;
    color: transparent; transition: transform .5s cubic-bezier(.23,1,.32,1);
    user-select: none;
  }
  .proj-card:hover .proj-letter { transform: scale(1.08); }
  .proj-body { padding: 22px 26px 26px; }
  .proj-tags { display: flex; gap: 7px; margin-bottom: 12px; flex-wrap: wrap; }
  .proj-tag {
    font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
    padding: 3px 9px; border: 1px solid var(--border);
    border-radius: 2px; color: var(--muted);
  }
  .proj-name {
    font-family: var(--fh);
    font-size: clamp(20px,2.2vw,30px);
    font-weight: 800; letter-spacing: -1px; margin-bottom: 10px;
    transition: transform .28s, skew .28s;
    display: inline-block;
  }
  .proj-card:hover .proj-name { transform: skewX(-5deg); }
  .proj-desc {
    font-size: 13px; color: var(--muted);
    line-height: 1.7; margin-bottom: 18px;
  }
  .proj-link {
    font-size: 11px; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--accent); display: inline-flex;
    align-items: center; gap: 7px;
  }
  .proj-link::after { content: '→'; transition: transform .2s; }
  .proj-card:hover .proj-link::after { transform: translateX(5px); }

  /* ── SKILLS MARQUEE ── */
  .skills { overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .marquee-row { display: flex; overflow: hidden; max-width: 100vw; }
  .marquee-row + .marquee-row { border-top: 1px solid var(--border); }
  .marquee-track { display: flex; will-change: transform; flex-shrink: 0; }
  .m-item {
    font-family: var(--fh);
    font-size: clamp(22px,5.5vw,76px);
    font-weight: 800; letter-spacing: -2px;
    padding: 12px 36px; white-space: nowrap;
    color: transparent;
    -webkit-text-stroke: 1px rgba(245,245,245,0.16);
    transition: color .22s, -webkit-text-stroke .22s;
    cursor: none;
    display: inline-flex; align-items: center; gap: 36px;
  }
  .m-item:hover {
    color: var(--accent);
    -webkit-text-stroke: 1px transparent;
  }
  .m-dot {
    display: inline-block; width: 9px; height: 9px;
    background: var(--accent); border-radius: 50%; flex-shrink: 0;
  }

  /* ── CONTACT ── */
  .contact {
    position: relative; z-index: 2;
    background: var(--bg);
    padding: 120px 5vw 80px; overflow: hidden;
  }
  .contact-orb {
    position: absolute; width: 800px; height: 800px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(204,255,0,.08) 0%, transparent 65%);
    top: 50%; left: 50%; transform: translate(-50%,-50%);
    pointer-events: none;
  }
  .contact-big {
    font-family: var(--fh);
    font-size: clamp(46px,10.5vw,168px);
    font-weight: 800; line-height: .87; letter-spacing: -5px;
    position: relative;
  }
  .contact-line { overflow: hidden; display: block; }
  .contact-word { display: inline-block; }
  .contact-accent { color: var(--accent); }
  .contact-row {
    margin-top: 60px; padding-top: 40px;
    border-top: 1px solid var(--border);
    display: flex; align-items: flex-start;
    justify-content: space-between; flex-wrap: wrap; gap: 36px;
  }
  .contact-left { display: flex; flex-direction: column; gap: 18px; }
  .mag-btn {
    position: relative; display: inline-flex;
    align-items: center; gap: 11px;
    padding: 15px 34px;
    background: var(--accent); color: #000;
    font-family: var(--fh); font-size: 13px;
    font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
    border-radius: 2px; cursor: none; overflow: hidden;
    transition: filter .2s;
  }
  .mag-btn:hover { filter: brightness(1.12); }
  .social-row { display: flex; gap: 18px; flex-wrap: wrap; }
  .soc-link {
    font-size: 11px; font-weight: 600;
    letter-spacing: .15em; text-transform: uppercase;
    color: var(--muted);
    border-bottom: 1px solid transparent;
    transition: color .2s, border-color .2s;
    padding-bottom: 2px;
  }
  .soc-link:hover { color: var(--accent); border-color: var(--accent); }
  .contact-right { max-width: 340px; }
  .contact-right p { font-size: 14px; color: var(--muted); line-height: 1.8; }
  .contact-right strong { color: var(--text); }
  .footer-bar {
    margin-top: 80px; padding-top: 22px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center;
    justify-content: space-between; flex-wrap: wrap; gap: 14px;
  }
  .footer-copy { font-size: 11px; color: var(--muted); letter-spacing: .05em; }
  .footer-top {
    font-family: var(--fh); font-size: 11px; font-weight: 700;
    letter-spacing: .14em; text-transform: uppercase;
    color: var(--muted); transition: color .2s;
    cursor: none;
  }
  .footer-top:hover { color: var(--accent); }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .about-grid { grid-template-columns: 1fr; }
    .about-left { position: relative; height: auto; padding: 60px 0 20px; }
    .about-right { padding: 0 0 60px; }
    .nav-links { display: none; }
    .hero-scroll { display: none; }
    /* on mobile: stack from top instead of pinning to bottom */
    .hero {
      padding-top: 100px;
      justify-content: center;
      min-height: 100svh;
    }
    .hero-bottom { margin-top: 24px; flex-direction: column; align-items: flex-start; }
    /* projects: disable horizontal scroll, stack vertically */
    .projects-outer { height: auto; }
    .projects-sticky { position: relative; height: auto; overflow: visible; }
    .projects-track { overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
    .projects-track::-webkit-scrollbar { display: none; }
    .proj-card { flex: 0 0 80vw; }
    /* marquee: smaller text + tighter gap on mobile */
    .m-item { font-size: clamp(18px,6vw,32px); padding: 8px 20px; gap: 20px; letter-spacing: -1px; }
    .m-dot { width: 6px; height: 6px; }
    .contact-row { flex-direction: column; }
    .contact-big { letter-spacing: -2px; }
    .mag-btn { font-size: 11px; padding: 12px 22px; }
  }
`;
function useGlobalStyles() {
  useEffect(() => {
    const id = "portfolio-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = CSS;
    document.head.appendChild(tag);
    // Google Fonts
    const fontId = "portfolio-fonts";
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";
      document.head.appendChild(link);
    }
  }, []);
}

/* ============================================================
   LENIS SMOOTH SCROLL  (singleton)
   ============================================================ */
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smooth: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
    return () => lenis.destroy();
  }, []);
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function Cursor() {
  const dotRef  = useRef();
  const ringRef = useRef();

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const dot  = dotRef.current;
    const ring = ringRef.current;

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", onMove);

    let rafId;
    const tick = () => {
      rx += (mx - rx) * 0.09;
      ry += (my - ry) * 0.09;
      dot.style.left  = mx + "px";
      dot.style.top   = my + "px";
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const grow = () => document.body.classList.add("cursor-grow");
    const shrink = () => document.body.classList.remove("cursor-grow");
    const targets = document.querySelectorAll("a, button, .proj-card, .mag-btn, .nav-cta");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="c-dot"  ref={dotRef}  />
      <div className="c-ring" ref={ringRef} />
    </>
  );
}

/* ============================================================
   LOADER
   ============================================================ */
function Loader({ onDone }) {
  const loaderRef = useRef();
  const numRef    = useRef();
  const fillRef   = useRef();

  useEffect(() => {
    let count = 0;
    const iv = setInterval(() => {
      count += Math.floor(Math.random() * 4) + 1;
      if (count >= 100) count = 100;
      numRef.current.textContent  = String(count).padStart(2, "0");
      fillRef.current.style.width = count + "%";
      if (count >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          const tl = gsap.timeline({ onComplete: onDone });
          tl.to(numRef.current, { yPercent: -110, opacity: 0, duration: 0.45, ease: "power3.in" })
            .set(loaderRef.current, { clipPath: "circle(150% at 50% 50%)" })
            .to(loaderRef.current, {
              clipPath: "circle(0% at 50% 50%)",
              duration: 1.0,
              ease: "power4.inOut",
            });
        }, 300);
      }
    }, 26);
    return () => clearInterval(iv);
  }, [onDone]);

  return (
    <div className="loader" ref={loaderRef}>
      <div className="loader-num" ref={numRef}>00</div>
      <div className="loader-track">
        <div className="loader-fill" ref={fillRef} />
      </div>
    </div>
  );
}

/* ============================================================
   NAV
   ============================================================ */
function Nav() {
  const navRef = useRef();

  useEffect(() => {
    gsap.to(navRef.current, { y: 0, duration: 0.8, delay: 2.5, ease: "power3.out" });
  }, []);

  return (
    <nav className="nav" ref={navRef}>
      <div className="nav-logo">
        <span style={{color: "#ccff00"}}>
          {"<S.S/>"}
        </span>
      </div>
      <div className="nav-links">
        {["About", "Work", "Skills", "Contact"].map((l) => (
          <a key={l} href={"#" + l.toLowerCase()}>{l}</a>
        ))}
      </div>
      <a className="nav-cta" href={`mailto:${DATA.email}`}>Hire Me</a>
    </nav>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero() {
  const sectionRef = useRef();
  const orb1Ref    = useRef();
  const orb2Ref    = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(".hero-word",  { yPercent: 0, duration: 1.0, stagger: 0.07, ease: "power4.out" })
        .to(".hero-tag",   { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.6")
        .to(".hero-desc",  { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .to(".hero-scroll",{ opacity: 1, duration: 0.6 }, "-=0.3");
    }, sectionRef);

    // Mouse parallax on orbs
    const onMouseMove = (e) => {
      const rx = (e.clientX / window.innerWidth  - 0.5) * 28;
      const ry = (e.clientY / window.innerHeight - 0.5) * 28;
      gsap.to(orb1Ref.current, { x: rx * 1.2,  y: ry * 1.2,  duration: 1.2, ease: "power2.out" });
      gsap.to(orb2Ref.current, { x: -rx * 0.8, y: -ry * 0.8, duration: 1.4, ease: "power2.out" });
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const words = [`${DATA.name} ${DATA.surname}`, DATA.role];

  return (
    <section className="hero" id="hero" ref={sectionRef}>
      <div className="hero-noise" />
      <div className="hero-orb orb-1" ref={orb1Ref} />
      <div className="hero-orb orb-2" ref={orb2Ref} />

      <div className="hero-tag">{DATA.tag}</div>

      <h1 className="hero-headline">
      <div  style={{
        fontSize : "2.5rem"
      }}>Hii I'm</div>
        {words.map((line, i) => (
          <span className="hero-line" key={i}>
            {line.split(" ").map((word, j) => (
              <span className="hero-word" key={j}>{word}&nbsp;</span>
            ))}
          </span>
        ))}
      </h1>

      <div className="hero-bottom">
        <p
          className="hero-desc"
          dangerouslySetInnerHTML={{ __html: DATA.heroDesc }}
        />
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </div>
    </section>
  );
}


function About() {
  const ref = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-scrubbed paragraph opacity
      document.querySelectorAll(".about-para").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.15 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: el,
              start: "top 72%",
              end:   "bottom 38%",
              scrub: true,
            },
          }
        );
      });

      gsap.from([".about-left .eyebrow", ".about-left .section-title"], {
        opacity: 0, y: 36,
        stagger: 0.14, duration: 0.8,
        scrollTrigger: { trigger: ".about-left", start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="about" id="about" ref={ref}>
      <div className="about-grid">
        {/* Sticky left */}
        <div className="about-left">
          <div className="eyebrow">About Me</div>
          <h2 className="section-title">
            Crafting<br />digital<br />futures.
          </h2>
          <div className="about-ghost">02</div>
        </div>

        {/* Scrolling right */}
        <div className="about-right">
          {DATA.aboutParas.map((p, i) => (
            <p
              key={i}
              className="about-para"
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ))}
          <div className="about-divider" />
          <div className="stats">
            {DATA.stats.map((s, i) => (
              <div key={i}>
                <div className="stat-val">{s.val}</div>
                <div className="stat-lab">{s.lab}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PROJECTS  (horizontal scroll via ScrollTrigger pin + scrub)
   ============================================================ */
function Projects() {
  const outerRef = useRef();
  const trackRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track     = trackRef.current;
      const isMobile  = window.innerWidth <= 768;

      if (!isMobile) {
        const totalMove = track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: -totalMove,
          ease: "none",
          scrollTrigger: {
            trigger:       outerRef.current,
            start:         "top top",
            end:           () => `+=${totalMove * 1.3}`,
            scrub:         1.1,
            pin:           ".projects-sticky",
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.from(".projects-header", {
        opacity: 0, y: 28,
        scrollTrigger: { trigger: outerRef.current, start: "top 80%" },
      });
    }, outerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="projects-outer" id="work" ref={outerRef}>
      <div className="projects-sticky">
        <div className="projects-header">
          <div>
            <div className="eyebrow">Selected Work</div>
            <h2 className="section-title" style={{ fontSize: "clamp(26px,3.2vw,48px)" }}>
              Featured Projects
            </h2>
          </div>
          <div className="proj-count">
            <strong>{String(DATA.projects.length).padStart(2, "0")}</strong> projects
          </div>
        </div>

        <div className="projects-track" ref={trackRef}>
          {DATA.projects.map((p, i) => (
            <div className="proj-card" key={i}>
              {/* ✏️ Replace proj-img div with <img src="..." alt={p.name}/> */}
              <div
                className="proj-img"
                style={{ background: p.bg }}
              >
                <span
                  className="proj-letter"
                  style={{ WebkitTextStroke: `2px ${p.accent}`, color: "transparent" }}
                >
                  {p.letter}
                </span>
              </div>
              <div className="proj-body">
                <div className="proj-tags">
                  {p.tags.map((t, j) => <span className="proj-tag" key={j}>{t}</span>)}
                </div>
                <div className="proj-name" style={{ color: p.accent }}>{p.name}</div>
                <p className="proj-desc">{p.desc}</p>
                <a className="proj-link" href={p.link} target="_blank" rel="noreferrer">
                  View Project
                </a>
              </div>
            </div>
          ))}
          <div style={{ flexShrink: 0, width: "5vw" }} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SKILLS MARQUEE  (dual rows, CSS animation)
   ============================================================ */
function Skills() {
  const half  = Math.ceil(DATA.skills.length / 2);
  const row1  = DATA.skills.slice(0, half);
  const row2  = DATA.skills.slice(half);

  // Duplicate each row for seamless looping
  const renderRow = (skills, id, reverse = false) => {
    const items = [...skills, ...skills]; // duplicate
    return (
      <div className="marquee-row" key={id}>
        <div
          className="marquee-track"
          style={{
            animation: `marquee${reverse ? "R" : ""} ${skills.length * 4}s linear infinite`,
          }}
        >
          {items.map((s, i) => (
            <span className="m-item" key={i}>
              {s}
              <span className="m-dot" />
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Inject keyframes once
  useEffect(() => {
    const id = "marquee-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes marquee  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      @keyframes marqueeR { from { transform: translateX(-50%); } to { transform: translateX(0); } }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <section className="skills" id="skills">
      {renderRow(row1, "r1", false)}
      {renderRow(row2, "r2", true)}
    </section>
  );
}

/* ============================================================
   CONTACT  (curtain reveal + magnetic button)
   ============================================================ */
function Contact() {
  const sectionRef = useRef();
  const btnRef     = useRef();

  // Section reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-word", {
        yPercent: 115,
        duration: 1.1,
        stagger:  0.09,
        ease:     "power4.out",
        scrollTrigger: { trigger: ".contact-big", start: "top 82%" },
      });
      gsap.from(".contact-row", {
        opacity: 0, y: 36,
        duration: 0.8,
        scrollTrigger: { trigger: ".contact-row", start: "top 88%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Magnetic button
  useEffect(() => {
    const btn    = btnRef.current;
    const RADIUS = 65;

    const onMove = (e) => {
      const r    = btn.getBoundingClientRect();
      const cx   = r.left + r.width  / 2;
      const cy   = r.top  + r.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS) {
        const pull = (RADIUS - dist) / RADIUS;
        gsap.to(btn, { x: dx * pull * 0.42, y: dy * pull * 0.42, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const lines = ["LET'S", "BUILD", "SOMETHING"];

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="contact-orb" />

      <div className="contact-big">
        {lines.map((w, i) => (
          <span className="contact-line" key={i}>
            <span className="contact-word">{w}&nbsp;</span>
          </span>
        ))}
        <span className="contact-line">
          <span className="contact-word contact-accent">GREAT.</span>
        </span>
      </div>

      <div className="contact-row">
        <div className="contact-left">
          <a className="mag-btn" ref={btnRef} href={`mailto:${DATA.email}`}>
            ✉&nbsp; {DATA.email}
          </a>
          <div className="social-row">
            {DATA.social.map((s, i) => (
              <a key={i} className="soc-link" href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="contact-right">
          <p>
            <strong>Let's collaborate</strong> I'm currently a first year B.tech student seeking frontend develoment internships.
            I'm looking for opportunities to apply my skills in <strong>React</strong> and <strong>UI UX</strong>
            design to real world products.
          </p>
        </div>
      </div>

      <div className="footer-bar">
        <span className="footer-copy">
          © 2025 {DATA.name} {DATA.surname}. Designed &amp; built with obsession.
        </span>
        <a className="footer-top" href="#hero">↑ Back to top</a>
      </div>
    </section>
  );
}

/* ============================================================
   APP ROOT
   ============================================================ */
export default function App() {
  const [loaded, setLoaded] = useState(false);

  useGlobalStyles();
  useLenis();

  const onLoaderDone = useCallback(() => {
    setLoaded(true);
    setTimeout(() => ScrollTrigger.refresh(), 300);
  }, []);

  return (
    <>
      <Cursor />
      <Loader onDone={onLoaderDone} />
      {loaded && (
        <>
          <Nav />
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </>
      )}
    </>
  );
}