import { useEffect, useState } from "react";
import axios from "axios";
import { Instagram, Linkedin, ArrowUpRight, MapPin, Mail } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NAV_LINKS = [
  { label: "Brand", href: "#brand" },
  { label: "Collections", href: "#collections" },
  { label: "Contact", href: "#contact" },
];

const MARQUEE_ITEMS = [
  "Crafted in India",
];

const PRODUCTS = [
  { name: "Structured handbags", index: "01" },
  { name: "Limited collections", index: "02" },
  { name: "Plant-based leather craftsmanship", index: "03" },
];

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // ping the API root so the backend is awoken (and to verify connectivity)
    axios.get(`${API}/`).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/waitlist`, { email });
      toast.success(res.data.message || "Welcome to VELVENYA.");
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Something went quiet. Please try again.";
      toast.error(typeof msg === "string" ? msg : "Could not subscribe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F9F7F3] text-[#1C1E1C] selection:bg-[#3E4C3B] selection:text-[#F9F7F3]" data-testid="coming-soon-page">
      {/* ===== Navigation ===== */}
      <nav
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-[#F9F7F3]/70 border-b border-[#E5E0D8]/60"
        data-testid="main-nav"
      >
        <div className="flex items-center justify-between px-6 md:px-12 py-5">
          <a href="#top" className="text-[11px] uppercase tracking-[0.3em] text-[#1C1E1C]/70" data-testid="nav-logo">
            India · 2026
          </a>
          <ul className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.25em] text-[#1C1E1C]/80">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-underline" data-testid={`nav-link-${l.label.toLowerCase()}`}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#waitlist"
            className="hidden md:inline-block text-[11px] uppercase tracking-[0.25em] border-b border-[#1C1E1C] pb-0.5 hover:text-[#3E4C3B] hover:border-[#3E4C3B] transition-colors"
            data-testid="nav-waitlist-cta"
          >
            Notify Me
          </a>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <section
        id="top"
        className="relative flex flex-col justify-start md:justify-end md:min-h-screen pb-10 md:pb-28 px-6 md:px-12 pt-10 md:pt-32"
        data-testid="hero-section"
      >
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12 md:col-span-3 mb-10 md:mb-0 fade-up fade-up-delay-1">
          </div>

          <div className="col-span-12 md:col-span-9">
            <h1
              className="font-serif-display text-[16vw] md:text-[11vw] leading-[0.85] tracking-[-0.04em] text-[#1C1E1C] fade-up"
              data-testid="hero-title"
            >
              VELVENYA
            </h1>
          </div>

          <div className="col-span-12 md:col-start-4 md:col-span-6 mt-12 md:mt-16 fade-up fade-up-delay-2">
            <p className="font-serif-display italic text-2xl md:text-4xl text-[#3E4C3B] leading-tight">
              “Silence is the oldest luxury.”
            </p>
            <p className="mt-8 text-base md:text-lg text-[#595C58] leading-relaxed max-w-xl">
              Eco-luxury handbags crafted in India.
            </p>
            <p className="mt-2 text-base md:text-lg text-[#595C58] leading-relaxed max-w-xl">
              Built with a quieter approach to design, craftsmanship, and modern luxury.
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-[#3E4C3B]">
              Coming soon.
            </p>
          </div>

          <div className="col-span-12 md:col-start-10 md:col-span-3 mt-12 md:mt-16 flex md:justify-end fade-up fade-up-delay-3">
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] border-b border-[#1C1E1C] pb-1 hover:text-[#3E4C3B] hover:border-[#3E4C3B] transition-colors"
              data-testid="hero-cta-join"
            >
              Notify me <ArrowUpRight size={14} strokeWidth={1.2} />
            </a>
          </div>
        </div>
      </section>

      {/* ===== Marquee ===== */}
      <section
        className="py-7 md:py-9 border-y border-[#E5E0D8] overflow-hidden bg-[#F9F7F3]"
        data-testid="values-marquee"
      >
        <div className="marquee-track">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="font-serif-display italic text-2xl md:text-4xl tracking-wide text-[#3E4C3B] whitespace-nowrap"
            >
              Crafted in India <span className="text-[#1C1E1C]/30 mx-3">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ===== Brand / Founder ===== */}
      <section
        id="brand"
        className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 px-6 md:px-12 py-20 md:py-32"
        data-testid="brand-section"
      >
        <div className="md:col-span-1">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#595C58]">01 — Brand</p>
        </div>
        <div className="md:col-span-6">
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-6xl leading-[1.05] text-[#1C1E1C]">
            A modern Indian house, <em className="text-[#3E4C3B]">built on stillness.</em>
          </h2>
          <p className="mt-8 text-base md:text-lg text-[#595C58] leading-relaxed max-w-xl">
            VELVENYA creates eco-luxury handbags and accessories that blend minimal aesthetics with
            sustainable materials and refined craftsmanship. We believe restraint is a kind of opulence,
            and that the truest objects do not announce themselves.
          </p>
        </div>

        <div className="md:col-start-9 md:col-span-4 md:border-l md:border-[#E5E0D8] md:pl-8 border-t border-[#E5E0D8] pt-8 md:border-t-0 md:pt-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#595C58]">Founder</p>
          <h3 className="font-serif-display text-2xl md:text-3xl mt-4 text-[#1C1E1C]">Pintu Padhy</h3>
          <p className="mt-6 text-sm md:text-base text-[#595C58] leading-relaxed">
            Founded by Pintu Padhy, VELVENYA is an independent Indian eco-luxury brand built with a vision
            to create quieter, more conscious luxury.
          </p>
          <p className="mt-4 text-sm md:text-base text-[#595C58] leading-relaxed">
            Started at the age of 20, the brand reflects a belief in timeless design, refined craftsmanship,
            and modern sustainability.
          </p>
          <p className="mt-8 font-serif-display italic text-xl text-[#3E4C3B]">Andhra Pradesh, India</p>
        </div>
      </section>

      {/* ===== Collections ===== */}
      <section
        id="collections"
        className="px-6 md:px-12 py-20 md:py-32"
        data-testid="collections-section"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-16">
          <div className="md:col-span-1">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#595C58]">02 — Coming</p>
          </div>
          <div className="md:col-span-7">
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-6xl leading-[1.05]">
              The first <em className="text-[#3E4C3B]">chapter.</em>
            </h2>
          </div>
          <div className="md:col-start-10 md:col-span-3 self-end">
            <p className="text-sm text-[#595C58]">
              A considered debut of three offerings, released as limited editions.
            </p>
          </div>
        </div>

        <div className="border-t border-b border-[#E5E0D8] py-8 md:py-14" data-testid="products-list">
          <p className="font-serif-display text-xl sm:text-2xl md:text-4xl text-[#1C1E1C] leading-snug break-words">
            Structured handbags
            <span className="text-[#1C1E1C]/25 mx-2 md:mx-5">·</span>
            Limited collections
            <span className="text-[#1C1E1C]/25 mx-2 md:mx-5">·</span>
            <em className="text-[#3E4C3B]">Plant-based leather craftsmanship</em>
          </p>
        </div>
      </section>

      {/* ===== Waitlist ===== */}
      <section
        id="waitlist"
        className="px-6 md:px-12 py-20 md:py-32 bg-[#1C1E1C] text-[#F9F7F3]"
        data-testid="waitlist-section"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-1">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#F9F7F3]/50">03 — Waitlist</p>
          </div>
          <div className="md:col-span-5">
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-6xl leading-[1.05] text-[#F9F7F3]">
              Be the first <em className="text-[#C9C2B0]">to know.</em>
            </h2>
            <p className="mt-8 text-base md:text-lg text-[#F9F7F3]/60 leading-relaxed max-w-md">
              Private updates from Velvenya.
            </p>
          </div>

          <div className="md:col-start-8 md:col-span-5 flex items-end">
            {submitted ? (
              <div className="w-full py-10 border-t border-[#F9F7F3]/20" data-testid="waitlist-success">
                <p className="font-serif-display italic text-2xl md:text-3xl text-[#C9C2B0]">
                  Welcome to VELVENYA.
                </p>
                <p className="mt-3 text-sm text-[#F9F7F3]/60">
                  You will be the first to know when we arrive.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="w-full"
                data-testid="waitlist-form"
                noValidate
              >
                <label
                  htmlFor="email"
                  className="text-[11px] uppercase tracking-[0.3em] text-[#F9F7F3]/50"
                >
                  Your email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.world"
                  className="w-full bg-transparent border-b border-[#F9F7F3]/40 focus:border-[#C9C2B0] outline-none px-0 py-4 mt-3 text-lg md:text-2xl text-[#F9F7F3] placeholder-[#F9F7F3]/30 transition-colors"
                  data-testid="waitlist-email-input"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-[#F9F7F3] text-[#1C1E1C] uppercase tracking-[0.25em] text-xs hover:bg-[#C9C2B0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="waitlist-submit-button"
                >
                  {loading ? "Sending…" : "Notify Me"}
                  <ArrowUpRight size={14} strokeWidth={1.2} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ===== Contact / Footer ===== */}
      <footer
        id="contact"
        className="px-6 md:px-12 py-20 md:py-32 bg-[#0F110F] text-[#F9F7F3]"
        data-testid="footer-section"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#F9F7F3]/50">Contact</p>
            <h3 className="font-serif-display text-2xl sm:text-3xl md:text-5xl mt-6 leading-[1.05]">
              For press, partnerships, and patient curiosity.
            </h3>
          </div>

          <div className="md:col-start-7 md:col-span-3 space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#F9F7F3]/40">Email</p>
              <a
                href="mailto:velvenyapvtltd@gmail.com"
                className="mt-2 inline-flex items-center gap-2 text-base md:text-lg link-underline"
                data-testid="contact-email-link"
              >
                <Mail size={14} strokeWidth={1.2} /> velvenyapvtltd@gmail.com
              </a>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#F9F7F3]/40">Studio</p>
              <p className="mt-2 inline-flex items-center gap-2 text-base md:text-lg">
                <MapPin size={14} strokeWidth={1.2} /> Andhra Pradesh, India
              </p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#F9F7F3]/40">Elsewhere</p>
            <div className="space-y-3">
              <a
                href="https://instagram.com/velvenya_official"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 link-underline"
                data-testid="social-instagram"
              >
                <Instagram size={16} strokeWidth={1.2} /> Instagram — @velvenya_official
              </a>
              <a
                href="https://www.linkedin.com/company/velvenya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 link-underline"
                data-testid="social-linkedin"
              >
                <Linkedin size={16} strokeWidth={1.2} /> LinkedIn — Velvenya
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-28 pt-8 border-t border-[#F9F7F3]/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="font-serif-display text-2xl tracking-[0.4em]">VELVENYA</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#F9F7F3]/40">
            © 2026 VELVENYA
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#F9F7F3]/40 italic">
            Silence is the oldest luxury.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default ComingSoon;
