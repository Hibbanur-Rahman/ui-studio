import { useState } from "react";
import { ArrowRight, Check, Eye, EyeOff, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

import LogoDark from "@/assets/images/logo.png";
import LogoLight from "@/assets/images/logo-white.png";

/* ─── Password strength ───────────────────────────────────────────────── */

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

function getStrength(password: string): StrengthLevel {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score as StrengthLevel;
}

const strengthMeta: Record<StrengthLevel, { label: string; color: string; bars: number }> = {
  0: { label: "", color: "bg-slate-200", bars: 0 },
  1: { label: "Weak", color: "bg-red-500", bars: 1 },
  2: { label: "Fair", color: "bg-amber-500", bars: 2 },
  3: { label: "Good", color: "bg-emerald-400", bars: 3 },
  4: { label: "Strong", color: "bg-emerald-500", bars: 4 },
};

const PasswordStrength = ({ password }: { password: string }) => {
  const level = getStrength(password);
  const meta = strengthMeta[level];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= meta.bars ? meta.color : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className={`mt-1 text-[12px] font-medium ${
        level === 1 ? "text-red-500" :
        level === 2 ? "text-amber-500" :
        level >= 3 ? "text-emerald-600" : ""
      }`}>
        {meta.label}
      </p>
    </div>
  );
};

/* ─── Left panel content ──────────────────────────────────────────────── */

const perks = [
  { title: "Free forever on Hobby", desc: "3 projects with a *.orvix.app subdomain — no card needed." },
  { title: "Deploy in under 30 seconds", desc: "Hit publish and your UI is live on a global CDN instantly." },
  { title: "500+ UI components included", desc: "A full component library ready to drag, drop, and customise." },
  { title: "Export clean React code", desc: "No lock-in — export production-ready code at any time." },
];

/* ─── Register ────────────────────────────────────────────────────────── */

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="flex min-h-screen h-[100vh]">
      {/* ── Left: Brand panel ───────────────────────────────────────── */}
      <div className="relative hidden overflow-hidden bg-[#07070f] lg:flex lg:w-1/2 lg:flex-col">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-1/3 top-1/3 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/2 rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="absolute bottom-1/3 left-1/4 h-[300px] w-[300px] -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-600/10 blur-[80px]" />
        </div>

        <div className="relative flex flex-1 flex-col justify-between p-12">
          {/* Logo */}
          <Link to="/">
            <img src={LogoDark} alt="Orvix Studio" className="w-[140px]" />
          </Link>

          {/* Headline */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3.5 py-1.5">
              <Sparkles className="size-3.5 text-violet-400" />
              <span className="text-[12px] font-medium text-violet-300">
                Free to get started · No credit card
              </span>
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
              Join{" "}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                12,000+ builders
              </span>{" "}
              shipping faster.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
              Orvix Studio gives your team a visual editor and a one-click deploy pipeline
              — from your first component to a live production URL.
            </p>

            {/* Perk list */}
            <ul className="mt-8 space-y-5">
              {perks.map(({ title, desc }) => (
                <li key={title} className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                    <Check className="size-3 text-violet-400" />
                  </span>
                  <span>
                    <span className="block text-[14px] font-semibold text-slate-200">{title}</span>
                    <span className="block text-[13px] leading-snug text-slate-500">{desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom quote */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5">
            <p className="text-[14px] italic leading-relaxed text-slate-300">
              "We went from mockup to a live marketing site in one afternoon.
              Orvix Studio is the tool we didn't know we needed."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500" />
              <div>
                <p className="text-[13px] font-semibold text-slate-200">Marcus Webb</p>
                <p className="text-[12px] text-slate-500">CTO · Launchpad HQ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Form ─────────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <Link to="/" className="mb-8 block lg:hidden">
            <img src={LogoLight} alt="Orvix Studio" className="w-[130px]" />
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create your free account
            </h1>
            <p className="mt-1.5 text-[14px] text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-violet-600 hover:text-violet-700"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
            >
              <FcGoogle className="size-4" />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
            >
              <FaGithub className="size-4" />
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[12px] text-slate-400">or continue with email</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-[13px] font-medium text-slate-700"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-3 focus:ring-violet-500/15"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-slate-700"
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-3 focus:ring-violet-500/15"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-11 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-3 focus:ring-violet-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={agreed}
                onClick={() => setAgreed((v) => !v)}
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  agreed
                    ? "border-violet-600 bg-violet-600"
                    : "border-slate-300 bg-white hover:border-slate-400"
                }`}
              >
                {agreed && <Check className="size-3 text-white" />}
              </button>
              <span className="text-[13px] leading-snug text-slate-600">
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-violet-600 underline-offset-2 hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-violet-600 underline-offset-2 hover:underline"
                >
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-[15px] font-semibold text-white shadow-md shadow-violet-500/20 transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Create free account <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-[12px] text-slate-400">
            No credit card required · Free *.orvix.app subdomain on every project
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
