import { useEffect, useState } from "react";

// ─── Replace with your actual chart image ───────────────────────────────────
// import chartImage from "./assets/sjp-chart.png";
const chartImage = "https://placehold.co/400x400/e8e5e0/1a3a2a?text=Chart+Image";
// ────────────────────────────────────────────────────────────────────────────

// Minimal style block — only for things Tailwind can't express:
//   • 100dvh (dynamic viewport height)
//   • clamp() fluid font sizes
//   • @keyframes fade-up animation
const RESIDUAL_STYLES = `
  .h-dvh { min-height: 100dvh; }

  .text-fluid-logo  { font-size: clamp(17px, 2vw, 21px); }
  .text-fluid-h1    { font-size: clamp(32px, 3.5vw, 46px); }
  .text-fluid-h2    { font-size: clamp(28px, 3vw, 40px); }
  .text-fluid-body  { font-size: clamp(14px, 1.4vw, 16px); }
  .text-fluid-tag   { font-size: clamp(13px, 1.4vw, 15px); }
  .text-fluid-small { font-size: clamp(10px, 1.1vw, 12px); }
  .max-w-chart      { max-width: clamp(180px, 75%, 320px); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-0 { animation: fadeUp 0.7s ease 0.0s both; }
  .fade-1 { animation: fadeUp 0.7s ease 0.2s both; }
  .fade-2 { animation: fadeUp 0.7s ease 0.4s both; }
`;

// ─── Left Panel (desktop / tablet) ──────────────────────────────────────────
function LeftPanel() {
  return (
    <div className="hidden md:flex flex-col w-[42%] h-dvh bg-[#0d1f2d] px-11 py-10 overflow-hidden shrink-0">

      {/* Logo */}
      <div className="fade-0 shrink-0">
        <div className="text-white font-bold leading-tight tracking-tight font-serif text-fluid-logo"
          style={{ letterSpacing: "-0.01em" }}>
          St<br />James's<br />Place
        </div>
        <div className="w-[26px] h-[2px] bg-[#2DD4BF] rounded mt-2" />
      </div>

      {/* Chart image — centred & responsive */}
      <div className="fade-1 flex-1 flex items-center justify-center">
        <img
          src={chartImage}
          alt="Portfolio chart"
          className="w-full max-w-chart h-auto block object-contain"
        />
      </div>

      {/* Bottom tagline + app badges */}
      <div className="fade-2 shrink-0">
        <div className="h-px bg-[rgba(45,212,191,0.18)] mb-[18px]" />

        <p className="text-[rgba(255,255,255,0.65)] font-bold leading-snug mb-1.5 font-serif text-fluid-tag"
          style={{ letterSpacing: "-0.01em" }}>
          Your portfolio.{" "}
          <em className="text-[#2DD4BF] font-normal">In your pocket.</em>
        </p>

        <p className="text-[rgba(255,255,255,0.32)] leading-relaxed mb-[18px] font-serif text-fluid-small">
          Download the SJP app to view your funds<br />and documents anywhere.
        </p>

        {/* App store badges */}
        <div className="flex gap-2.5 flex-wrap">
          {[
            { store: "Download on the", name: "App Store",   path: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" },
            { store: "Get it on",      name: "Google Play", path: "M3.18 23.76c.3.17.65.19.98.07l11.67-6.72-2.6-2.6-10.05 9.25zm-1.82-20.2v20.88c0 .5.27.94.68 1.18l.12.07 11.7-11.7-11.7-11.7-.12.07c-.41.23-.68.68-.68 1.2zM20.49 9.95l-2.36-1.36-2.92 2.92 2.92 2.92 2.38-1.37c.68-.39.68-1.73-.02-2.11zm-16.59 12.54l9.77-9.77-2.6-2.6-9.77 9.77 2.6 2.6z" },
          ].map((b, i) => (
            <button
              key={i}
              className="flex items-center gap-2 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] rounded-[10px] px-3.5 py-2 cursor-pointer transition-colors duration-200 hover:bg-[rgba(45,212,191,0.1)] hover:border-[rgba(45,212,191,0.35)]"
            >
              <svg viewBox="0 0 24 24" fill="white" width={17} height={17}>
                <path d={b.path} />
              </svg>
              <div className="text-left">
                <div className="text-[rgba(255,255,255,0.35)] text-[8px] tracking-widest uppercase">{b.store}</div>
                <div className="text-white text-xs font-semibold leading-tight">{b.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel — desktop / tablet ─────────────────────────────────────────
function RightPanelDesktop() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-[#eae8e3] h-dvh px-13 py-12">
      <div className="max-w-[420px] w-full">

        <h1 className="text-fluid-h1 font-extrabold text-[#0d1f2d] leading-[1.1] tracking-tight mb-2 font-serif"
          style={{ letterSpacing: "-0.02em" }}>
          Manage your portfolio.
        </h1>
        <h2 className="text-fluid-h2 italic font-normal text-[#2DD4BF] mb-5 font-serif"
          style={{ letterSpacing: "-0.01em" }}>
          Anywhere.
        </h2>
        <p className="text-[#6b7280] leading-relaxed mb-10 font-serif text-fluid-body">
          Got an SJP account? Register now to access and manage your funds wherever you are.
        </p>

        <button className="w-full py-4 px-6 bg-[#0d1f2d] text-white border-none rounded-full text-[15px] font-semibold cursor-pointer mb-3.5 tracking-wide font-serif transition-opacity duration-200 hover:opacity-[0.88]">
          Register for online services
        </button>

        <div className="flex items-center gap-3 mb-3.5">
          <div className="flex-1 h-px bg-[#d1d5db]" />
          <span className="text-[#9ca3af] text-[13px] font-serif">OR</span>
          <div className="flex-1 h-px bg-[#d1d5db]" />
        </div>

        <button className="w-full py-[15px] px-6 bg-transparent text-[#0d1f2d] border-2 border-[#0d1f2d] rounded-full text-[15px] font-semibold cursor-pointer font-serif transition-colors duration-200 hover:bg-[rgba(13,31,45,0.05)]">
          Sign in
        </button>

        <div className="text-center mt-6">
          <a href="#" className="text-[#9ca3af] text-[13px] underline font-serif">
            Cookie Preferences
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile screen (single column, no left panel) ───────────────────────────
function MobileScreen() {
  return (
    <div className="w-full flex flex-col items-stretch bg-[#eae8e3] h-dvh">
      <div className="flex flex-col items-center min-h-screen px-6 pb-10">

        {/* Chart image — top half */}
        <div className="w-full flex justify-center items-center pt-8 pb-4 flex-1">
          <img
            src={chartImage}
            alt="Portfolio chart"
            className="w-[72vw] max-w-[300px] h-auto block object-contain"
          />
        </div>

        {/* Content — bottom half */}
        <div className="w-full">
          <h1 className="text-[32px] sm:text-[28px] font-extrabold text-[#0d1f2d] leading-[1.1] tracking-tight mb-3.5 font-serif"
            style={{ letterSpacing: "-0.02em" }}>
            Your portfolio.<br />Simplified.
          </h1>
          <p className="text-[15px] text-[#6b7280] leading-relaxed mb-8 font-serif">
            Got an SJP account? Register now to view your funds and documents in one place.
          </p>

          <button className="w-full py-[17px] px-6 bg-[#0d1f2d] text-white border-none rounded-full text-[15px] font-semibold cursor-pointer mb-3 tracking-wide font-serif [tap-highlight-color:transparent] touch-manipulation">
            Register for online services
          </button>
          <button className="w-full py-4 px-6 bg-transparent text-[#0d1f2d] border-2 border-[#0d1f2d] rounded-full text-[15px] font-semibold cursor-pointer font-serif [tap-highlight-color:transparent] touch-manipulation">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Root component ──────────────────────────────────────────────────────────
export default function SJPWelcomeScreen() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style>{RESIDUAL_STYLES}</style>
      <div className="flex min-h-screen h-dvh">
        {/* Left panel — Tailwind hides it on mobile via hidden md:flex */}
        <LeftPanel />

        {/* Right side: different layout per breakpoint */}
        {isMobile ? <MobileScreen /> : <RightPanelDesktop />}
      </div>
    </>
  );
}
