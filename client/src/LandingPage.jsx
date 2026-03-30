import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Animated Counter ──────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = target / (2000 / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ─── Scroll Reveal Hook ────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

// ─── Floating Particles ───────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 4,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(134, 239, 172, 0.4)",
            animation: `ct-floatUp ${p.duration}s ${p.delay}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────
function Navbar({ onSignUp }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "14px 0",
        background: scrolled ? "rgba(5, 32, 18, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(34, 197, 94, 0.2)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40,
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            borderRadius: 12, display: "grid", placeItems: "center",
            boxShadow: "0 4px 15px rgba(34, 197, 94, 0.4)",
          }}>
            <span style={{ fontSize: 20 }}>🌿</span>
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: "white", letterSpacing: "-0.5px" }}>
            Connectrust
          </span>
        </div>

        {/* Desktop Links */}
        <div className="ct-nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {[
            { id: "how-it-works", label: "How It Works" },
            { id: "impact", label: "Impact" },
            { id: "join", label: "Join" },
            { id: "contact", label: "Contact" },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.target.style.color = "#4ade80"}
              onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.8)"}
            >
              {sec.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            id="ct-navbar-signup"
            onClick={onSignUp}
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white", border: "none", padding: "10px 24px",
              borderRadius: 999, fontFamily: "'Outfit', sans-serif",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              boxShadow: "0 4px 15px rgba(34, 197, 94, 0.4)", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(34, 197, 94, 0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(34, 197, 94, 0.4)"; }}
          >
            Sign Up Free →
          </button>
          <button className="ct-menu-btn" onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", color: "white", fontSize: 24, cursor: "pointer", display: "none" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ background: "rgba(5, 32, 18, 0.98)", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {[{ id: "how-it-works", label: "How It Works" }, { id: "impact", label: "Impact" }, { id: "join", label: "Join" }, { id: "contact", label: "Contact" }].map((sec) => (
            <button key={sec.id} onClick={() => scrollTo(sec.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 16, cursor: "pointer", textAlign: "left", padding: "8px 0" }}>
              {sec.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────
function HeroSection({ onSignUp }) {
  const words = ["Communities.", "Change Makers.", "Volunteers.", "Hope."];
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => { setWordIndex((i) => (i + 1) % words.length); setFade(true); }, 400);
    }, 2600);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center",
      background: "linear-gradient(160deg, #052012 0%, #0a4a2a 40%, #0d6b35 70%, #1a8a4a 100%)",
    }}>
      <Particles />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/hero.png')", backgroundSize: "cover", backgroundPosition: "center right", opacity: 0.18 }} />
      <div style={{ position: "absolute", right: "-10%", top: "10%", width: 600, height: 600, borderRadius: "50%", border: "1px solid rgba(34,197,94,0.15)", animation: "ct-spin-slow 30s linear infinite" }} />
      <div style={{ position: "absolute", right: "-5%", top: "15%", width: 450, height: 450, borderRadius: "50%", border: "1px solid rgba(34,197,94,0.1)", animation: "ct-spin-slow 20s linear infinite reverse" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: 999, padding: "8px 20px", marginBottom: 32, animation: "ct-fadeInDown 0.8s ease-out" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", animation: "ct-pulse 1.5s infinite", display: "inline-block" }} />
            <span style={{ color: "#4ade80", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.5px" }}>Platform for Sustainable Action</span>
          </div>

          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, lineHeight: 1.1, fontSize: "clamp(42px, 6vw, 78px)", color: "white", margin: "0 0 16px", animation: "ct-fadeInUp 0.9s 0.1s ease-out both" }}>
            Where Sustainable{" "}
            <span style={{ background: "linear-gradient(135deg, #4ade80, #86efac)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block", opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(-10px)", transition: "all 0.4s ease" }}>
              {words[wordIndex]}
            </span>
            <br />Meet Real Impact.
          </h1>

          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 48, maxWidth: 600, fontWeight: 400, animation: "ct-fadeInUp 1s 0.2s ease-out both" }}>
            Connectrust bridges organisations, NGOs, and communities with passionate volunteers to drive events — online or offline — that educate, inspire, and accelerate sustainable development goals worldwide.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", animation: "ct-fadeInUp 1s 0.35s ease-out both" }}>
            <button
              id="ct-hero-signup"
              onClick={onSignUp}
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", border: "none", padding: "18px 40px", borderRadius: 999, fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 17, cursor: "pointer", boxShadow: "0 8px 30px rgba(34, 197, 94, 0.5)", transition: "all 0.3s", display: "flex", alignItems: "center", gap: 10 }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 15px 40px rgba(34, 197, 94, 0.6)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(34, 197, 94, 0.5)"; }}
            >
              🌱 Join the Movement
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "2px solid rgba(255,255,255,0.25)", padding: "18px 40px", borderRadius: 999, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, cursor: "pointer", backdropFilter: "blur(10px)", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            >
              See How It Works ↓
            </button>
          </div>

          {/* Our Goals */}
          <div style={{ display: "flex", gap: 16, marginTop: 56, flexWrap: "wrap", animation: "ct-fadeInUp 1s 0.5s ease-out both" }}>
            {[
              { icon: "🎯", goal: "Connect 1,000+ SDG-focused organisations to volunteers globally" },
              { icon: "🌱", goal: "Power 500+ impactful events — online and offline — every year" },
              { icon: "🤝", goal: "Build the world's largest sustainable volunteer network" },
            ].map((g, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 14, padding: "14px 18px", maxWidth: 280 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{g.icon}</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{g.goal}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: -2, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 80 }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0fdf4" />
        </svg>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────
const HOW_STEPS = [
  { icon: "🏢", bg: "linear-gradient(135deg, #22c55e, #16a34a)", step: "01", title: "Organisations Register", desc: "NGOs, companies, and community groups create their profile. They post their mission, goals, and upcoming event drives — tree-plantation, online awareness sessions, local clean-ups, and more.", tags: ["NGOs", "Companies", "Community Groups"] },
  { icon: "📅", bg: "linear-gradient(135deg, #16a34a, #15803d)", step: "02", title: "Create & List Events", desc: "Organisations publish events — online webinars, offline rallies, skill workshops, or volunteer drives. Set goals, needed skills, and participant numbers. AI helps match the right audience.", tags: ["Online & Offline", "AI Matching", "SDG Aligned"] },
  { icon: "🙋", bg: "linear-gradient(135deg, #4ade80, #22c55e)", step: "03", title: "Volunteers Discover & Join", desc: "Passionate individuals browse events by cause, location, or skill. They sign up, receive details, and show up to create real change — coordinated through one centralised platform.", tags: ["Easy Discovery", "Skill Matching", "Real Impact"] },
  { icon: "📈", bg: "linear-gradient(135deg, #86efac, #4ade80)", step: "04", title: "Track Impact Together", desc: "Every event, participant, and action is tracked. Organisations get analytics, volunteers earn impact badges, and the community sees collective progress toward sustainable development goals.", tags: ["Analytics", "Impact Badges", "SDG Progress"] },
];

function HowItWorksSection() {
  const [ref, visible] = useScrollReveal();
  return (
    <section id="how-it-works" style={{ background: "#f0fdf4", padding: "100px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }} ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 999, padding: "6px 18px", marginBottom: 16 }}>
            <span style={{ color: "#16a34a", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "1px", textTransform: "uppercase" }}>Simple. Powerful. Purposeful.</span>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "clamp(32px, 4vw, 52px)", color: "#052012", margin: "0 0 16px" }}>How Connectrust Works</h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, color: "#16a34a", maxWidth: 540, margin: "0 auto", fontWeight: 500 }}>From a simple idea to a global movement — four steps to drive sustainable change.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 28 }}>
          {HOW_STEPS.map((step, i) => (
            <div key={i}
              style={{ background: "white", borderRadius: 24, padding: 32, border: "1px solid rgba(34,197,94,0.15)", boxShadow: "0 4px 20px rgba(34,197,94,0.08)", transition: "all 0.3s", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transitionDelay: `${i * 0.12}s`, position: "relative", overflow: "hidden" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(34,197,94,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(34,197,94,0.08)"; }}
            >
              <div style={{ position: "absolute", top: 20, right: 20, fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 48, color: "rgba(34,197,94,0.08)", lineHeight: 1 }}>{step.step}</div>
              <div style={{ width: 64, height: 64, background: step.bg, borderRadius: 18, display: "grid", placeItems: "center", fontSize: 28, marginBottom: 24, boxShadow: "0 8px 20px rgba(34,197,94,0.3)" }}>{step.icon}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#052012", marginBottom: 12 }}>{step.title}</h3>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#4b7a5a", lineHeight: 1.7, marginBottom: 20, fontWeight: 500 }}>{step.desc}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {step.tags.map((tag) => (
                  <span key={tag} style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a", borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Impact Section ───────────────────────────────────────────
const GOALS = [
  { icon: "🌍", title: "Global Volunteer Network", desc: "Build the world's most connected network of sustainable-action volunteers across every continent.", color: "#22c55e" },
  { icon: "🏢", title: "1,000+ Partner Organisations", desc: "Onboard NGOs, community groups, and sustainability orgs so every cause finds the right volunteers.", color: "#4ade80" },
  { icon: "📅", title: "500+ Events Per Year", desc: "Power hundreds of online and offline events annually — from webinars to tree-plantation drives.", color: "#86efac" },
  { icon: "🎯", title: "Address All 17 UN SDGs", desc: "Ensure every Sustainable Development Goal has active campaigns and engaged communities behind it.", color: "#22c55e" },
  { icon: "📊", title: "Transparent Impact Tracking", desc: "Give every volunteer and organisation real-time visibility into the change they're creating together.", color: "#4ade80" },
  { icon: "🤝", title: "Zero-Barrier Participation", desc: "Make joining a sustainable cause effortless for any individual, anywhere — free, simple, and inclusive.", color: "#86efac" },
];

const TESTIMONIALS = [
  { quote: "Connectrust helped us scale our reforestation drive from 50 to 1,200 volunteers in just 3 weeks. The platform is a game changer.", name: "Priya Rajan", role: "Director, GreenRoots India", avatar: "🌿" },
  { quote: "We hosted an online sustainable fashion awareness webinar and reached 400 participants through Connectrust's volunteer matching. Incredible!", name: "James Okonkwo", role: "Co-founder, EcoWear Africa", avatar: "♻️" },
  { quote: "As a student volunteer, finding meaningful sustainability events in my city was impossible until Connectrust. Now I'm part of 6 active drives!", name: "Chen Li", role: "Student Volunteer, Singapore", avatar: "🌱" },
];

function ImpactSection() {
  const [ref, visible] = useScrollReveal();
  const [activeT, setActiveT] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveT((i) => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="impact" style={{ background: "linear-gradient(160deg, #052012 0%, #0a4a2a 60%, #0d6b35 100%)", padding: "100px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/impact.png')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08 }} />
      <Particles />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }} ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 999, padding: "6px 18px", marginBottom: 16 }}>
            <span style={{ color: "#4ade80", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "1px", textTransform: "uppercase" }}>Our Vision &amp; Goals</span>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "clamp(32px, 4vw, 52px)", color: "white", margin: "0 0 16px" }}>What We're Building Towards</h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, color: "rgba(255,255,255,0.7)", maxWidth: 560, margin: "0 auto", fontWeight: 400 }}>Connectrust is a platform in motion. Here's what we're striving to achieve for communities and the planet.</p>
        </div>

        <div className="ct-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 80 }}>
          {GOALS.map((goal, i) => (
            <div key={i}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 20, padding: "36px 28px", backdropFilter: "blur(10px)", transition: "all 0.3s", opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.9)", transitionDelay: `${i * 0.08}s` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(-6px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{goal.icon}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 18, color: goal.color, marginBottom: 12, lineHeight: 1.3 }}>{goal.title}</h3>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontWeight: 400 }}>{goal.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ position: "relative", minHeight: 180 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ position: i === 0 ? "relative" : "absolute", top: 0, left: 0, right: 0, opacity: activeT === i ? 1 : 0, transform: activeT === i ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease", pointerEvents: activeT === i ? "auto" : "none", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 20, padding: "36px 40px", backdropFilter: "blur(10px)", visibility: activeT === i ? "visible" : "hidden" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{t.avatar}</div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.9)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{t.quote}"</p>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#4ade80", fontSize: 15 }}>{t.name}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Outfit', sans-serif", fontSize: 13, marginTop: 4 }}>{t.role}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveT(i)} style={{ width: i === activeT ? 24 : 8, height: 8, borderRadius: 999, background: i === activeT ? "#4ade80" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: -2, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: 80 }}>
          <path d="M0,0 C480,80 960,0 1440,60 L1440,80 L0,80 Z" fill="#f0fdf4" />
        </svg>
      </div>
    </section>
  );
}

// ─── Join / SDG Section ───────────────────────────────────────
const SDG_ITEMS = [
  { icon: "🍎", label: "No Hunger" }, { icon: "💧", label: "Clean Water" },
  { icon: "⚡", label: "Clean Energy" }, { icon: "🌡️", label: "Climate Action" },
  { icon: "🦁", label: "Life on Land" }, { icon: "🐟", label: "Life Below Water" },
  { icon: "🤝", label: "Partnerships" }, { icon: "🏙️", label: "Sustainable Cities" },
  { icon: "📚", label: "Quality Education" }, { icon: "⚖️", label: "Reduced Inequalities" },
  { icon: "♻️", label: "Responsible Consumption" }, { icon: "❤️", label: "Good Health" },
];

function JoinSection({ onSignUp }) {
  const [ref, visible] = useScrollReveal();
  return (
    <section id="join" style={{ background: "#f0fdf4", padding: "100px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }} ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 999, padding: "6px 18px", marginBottom: 16 }}>
            <span style={{ color: "#16a34a", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "1px", textTransform: "uppercase" }}>UN Sustainable Development Goals</span>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "clamp(32px, 4vw, 52px)", color: "#052012", margin: "0 0 16px" }}>We Work Across All 17 SDGs</h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, color: "#4b7a5a", maxWidth: 540, margin: "0 auto" }}>From clean energy campaigns to ocean cleanup drives — every cause finds a home on Connectrust.</p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 80 }}>
          {SDG_ITEMS.map((item, i) => (
            <div key={i}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: "1.5px solid rgba(34,197,94,0.2)", borderRadius: 999, padding: "10px 20px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#16a34a", boxShadow: "0 2px 10px rgba(34,197,94,0.08)", transition: "all 0.25s", opacity: visible ? 1 : 0, transitionDelay: `${i * 0.06}s` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.color = "white"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#16a34a"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>

        <div className="ct-feature-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 72 }}>
          {[
            { icon: "🌐", title: "Online Events & Webinars", desc: "Host virtual education sessions, digital awareness campaigns, and online volunteer training programs that reach participants across the globe — no travel required.", color: "#dcfce7" },
            { icon: "📍", title: "Offline Community Drives", desc: "Coordinate on-ground tree planting, clean-up drives, distribution camps, and local workshops. Connectrust handles logistics, volunteer sign-ups, and impact tracking.", color: "#f0fdf4" },
            { icon: "🤖", title: "AI-Powered Event Matching", desc: "Our intelligent system analyses volunteer skills, interests, and location to suggest the most impactful events, ensuring the right people join the right causes.", color: "#f0fdf4" },
            { icon: "📊", title: "Real-Time Impact Dashboard", desc: "Organisations get live analytics — participants, reach, SDG alignment scores, and volunteer feedback — all in one unified dashboard built for transparency.", color: "#dcfce7" },
          ].map((feat, i) => (
            <div key={i}
              style={{ background: feat.color, borderRadius: 20, padding: 32, border: "1px solid rgba(34,197,94,0.2)", transition: "all 0.3s", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transitionDelay: `${i * 0.1}s` }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(34,197,94,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{feat.icon}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#052012", marginBottom: 10 }}>{feat.title}</h3>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#4b7a5a", lineHeight: 1.7 }}>{feat.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "linear-gradient(135deg, #052012, #0a4a2a, #16a34a)", borderRadius: 28, padding: "56px 64px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 25px 60px rgba(22,163,74,0.3)" }}>
          <Particles />
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "clamp(28px, 3.5vw, 44px)", color: "white", margin: "0 0 16px" }}>Ready to Drive Real Change? 🌍</h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, color: "rgba(255,255,255,0.78)", marginBottom: 36 }}>Join thousands of organisations and volunteers already making a difference. It's free to start.</p>
            <button
              id="ct-cta-signup"
              onClick={onSignUp}
              style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)", color: "#052012", border: "none", padding: "18px 48px", borderRadius: 999, fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 18, cursor: "pointer", boxShadow: "0 10px 30px rgba(74,222,128,0.4)", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px) scale(1.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
            >
              Get Started — It's Free 🌱
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", org: "", message: "" });
  const [sent, setSent] = useState(false);
  const [ref, visible] = useScrollReveal();

  return (
    <section id="contact" style={{ background: "#052012", padding: "100px 0", position: "relative", overflow: "hidden" }}>
      <Particles />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }} ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 999, padding: "6px 18px", marginBottom: 16 }}>
            <span style={{ color: "#4ade80", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "1px", textTransform: "uppercase" }}>Let's Connect</span>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "clamp(32px, 4vw, 52px)", color: "white", margin: "0 0 16px" }}>Get In Touch</h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto" }}>Whether you're an organisation, a volunteer, or just curious — we'd love to hear from you.</p>
        </div>

        <div className="ct-contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-30px)", transition: "all 0.7s ease" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {[
                { icon: "📧", label: "Email Us", value: "hello@connectrust.org" },
                { icon: "🌍", label: "Platform Reach", value: "54+ Countries Globally" },
                { icon: "📅", label: "Response Time", value: "Within 24 Hours" },
                { icon: "💬", label: "Partnerships", value: "Open to all SDG-aligned orgs" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 14, display: "grid", placeItems: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, color: "#4ade80", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(30px)", transition: "all 0.7s 0.2s ease" }}>
            {sent ? (
              <div style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.4)", borderRadius: 20, padding: "48px 32px", textAlign: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: "white", marginBottom: 10 }}>Message Sent!</h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(255,255,255,0.7)", fontSize: 15 }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  { key: "name", label: "Your Name", type: "text", placeholder: "Jane Doe" },
                  { key: "email", label: "Email Address", type: "email", placeholder: "jane@example.com" },
                  { key: "org", label: "Organisation (optional)", type: "text", placeholder: "GreenFuture NGO" },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 8 }}>{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} value={form[field.key]} onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                      style={{ width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(74,222,128,0.2)", borderRadius: 12, color: "white", fontFamily: "'Outfit', sans-serif", fontSize: 15, outline: "none", transition: "all 0.2s", boxSizing: "border-box" }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(74,222,128,0.6)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(74,222,128,0.2)"; }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 8 }}>Message</label>
                  <textarea rows={4} placeholder="Tell us about your cause or question..." value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    style={{ width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(74,222,128,0.2)", borderRadius: 12, color: "white", fontFamily: "'Outfit', sans-serif", fontSize: 15, outline: "none", resize: "vertical", boxSizing: "border-box" }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(74,222,128,0.6)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(74,222,128,0.2)"; }}
                  />
                </div>
                <button type="submit" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", border: "none", padding: "16px 32px", borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 16, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────
function Footer({ onSignUp }) {
  return (
    <footer style={{ background: "#021208", padding: "40px 0 24px", borderTop: "1px solid rgba(34,197,94,0.15)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #22c55e, #16a34a)", borderRadius: 10, display: "grid", placeItems: "center" }}><span style={{ fontSize: 18 }}>🌿</span></div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "white" }}>Connectrust</span>
          </div>
          <div style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Connecting communities for a sustainable tomorrow 🌎</div>
          <button onClick={onSignUp} style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", border: "none", padding: "10px 24px", borderRadius: 999, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Sign Up Free</button>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20, textAlign: "center", fontFamily: "'Outfit', sans-serif", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
          © 2026 Connectrust. Making sustainable development actionable. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── Global CSS ───────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  @keyframes ct-floatUp { 0%,100%{transform:translateY(0) scale(1);opacity:0.4} 50%{transform:translateY(-30px) scale(1.2);opacity:0.8} }
  @keyframes ct-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.6} }
  @keyframes ct-fadeInDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ct-fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ct-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  .ct-stats-grid { grid-template-columns: repeat(3,1fr) !important; }
  .ct-feature-grid { grid-template-columns: 1fr 1fr !important; }
  .ct-contact-grid { grid-template-columns: 1fr 1fr !important; }
  .ct-nav-links { display: flex !important; }
  .ct-menu-btn { display: none !important; }

  @media (max-width: 768px) {
    .ct-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
    .ct-feature-grid { grid-template-columns: 1fr !important; }
    .ct-contact-grid { grid-template-columns: 1fr !important; }
    .ct-nav-links { display: none !important; }
    .ct-menu-btn { display: block !important; }
  }
`;

// ─── Main Export ──────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  // Direct to /auth — the existing choice page (Individual vs Org)
  const handleSignUp = () => navigate("/auth");

  return (
    <>
      <style>{CSS}</style>
      <Navbar onSignUp={handleSignUp} />
      <HeroSection onSignUp={handleSignUp} />
      <HowItWorksSection />
      <ImpactSection />
      <JoinSection onSignUp={handleSignUp} />
      <ContactSection />
      <Footer onSignUp={handleSignUp} />
    </>
  );
}
