import { useState } from "react";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

import LogoDark from "@/assets/images/logo.png";
import LogoLight from "@/assets/images/logo-white.png";

/* ─── Left panel content ──────────────────────────────────────────────── */

const features = [
  "Visual drag-and-drop UI builder",
  "Deploy to your domain in one click",
  "500+ production-ready components",
  "Free *.orvix.app subdomain included",
];

const stats = [
  { value: "12K+", label: "Projects built" },
  { value: "30s", label: "Avg. deploy" },
  { value: "99.9%", label: "Uptime" },
];

/* ─── Login ───────────────────────────────────────────────────────────── */

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="flex min-h-screen h-[100vh]">
      {/* ── Left: Brand panel ───────────────────────────────────────── */}
      <div className="h-screen relative hidden overflow-hidden bg-[#07070f] lg:flex lg:w-1/2 lg:flex-col">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] translate-x-1/2 translate-y-1/2 rounded-full bg-blue-600/10 blur-[80px]" />
        </div>

        <div className="relative flex flex-1 flex-col justify-between p-12">
          {/* Logo */}
          <Link to="/">
            <img src={LogoDark} alt="Orvix Studio" className="w-[140px]" />
          </Link>

          {/* Headline + features */}
          <div>
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-violet-400">
              Welcome back
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
              Build UIs that stand out.{" "}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Deploy them instantly.
              </span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
              Thousands of teams use Orvix Studio to design, build, and ship production
              UIs — no code required.
            </p>

            <ul className="mt-8 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[14px] text-slate-300">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                    <Check className="size-3 text-violet-400" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="mt-10 flex gap-8 border-t border-white/[0.08] pt-8">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-[12px] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5">
            <p className="text-[14px] italic leading-relaxed text-slate-300">
              "Orvix Studio cut our frontend delivery time in half. We deploy entire
              landing pages before the morning standup."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="size-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500" />
              <div>
                <p className="text-[13px] font-semibold text-slate-200">Sarah Chen</p>
                <p className="text-[12px] text-slate-500">Head of Design · Flowly</p>
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
              Sign in to your account
            </h1>
            <p className="mt-1.5 text-[14px] text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-violet-600 hover:text-violet-700"
              >
                Sign up free
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
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-slate-700"
              >
                Email address
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
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[13px] font-medium text-slate-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-[13px] font-medium text-violet-600 hover:text-violet-700"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={remember}
                onClick={() => setRemember((v) => !v)}
                className={`flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  remember
                    ? "border-violet-600 bg-violet-600"
                    : "border-slate-300 bg-white hover:border-slate-400"
                }`}
              >
                {remember && <Check className="size-3 text-white" />}
              </button>
              <span className="text-[13px] text-slate-600">Remember me for 30 days</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-[15px] font-semibold text-white shadow-md shadow-violet-500/20 transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Sign in <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[12px] text-slate-400">
            By signing in you agree to our{" "}
            <a href="#" className="underline underline-offset-2 hover:text-slate-600">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-2 hover:text-slate-600">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
