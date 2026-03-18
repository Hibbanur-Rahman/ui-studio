import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Code2,
  Globe,
  Layers,
  Lock,
  RefreshCw,
  Rocket,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

/* ─── Animation variants ──────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};

/* ─── Mockup helpers ──────────────────────────────────────────────────── */

const LayerItem = ({
  label,
  depth,
  active,
}: {
  label: string;
  depth: number;
  active?: boolean;
}) => (
  <div
    className={`flex items-center gap-1 rounded py-0.5 text-[11px] ${active ? "bg-violet-500/20 text-violet-400" : "text-slate-600"}`}
    style={{ paddingLeft: `${depth * 10 + 4}px` }}
  >
    <span className="shrink-0 text-[9px]">{depth < 2 ? "▾" : "·"}</span>
    <span className="truncate">{label}</span>
  </div>
);

const PropRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-[11px]">
    <span className="text-slate-600">{label}</span>
    <span className="rounded bg-white/5 px-1.5 py-0.5 text-slate-400">{value}</span>
  </div>
);

const AppMockup = () => (
  <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#12121a] shadow-[0_0_80px_-20px_rgba(139,92,246,0.5)]">
    {/* Browser chrome */}
    <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#0d0d14] px-4 py-2.5">
      <div className="flex gap-1.5">
        <div className="size-2.5 rounded-full bg-[#ff5f57]/80" />
        <div className="size-2.5 rounded-full bg-[#febc2e]/80" />
        <div className="size-2.5 rounded-full bg-[#28c840]/80" />
      </div>
      <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white/[0.06] px-3 py-1">
        <Lock className="size-2.5 text-emerald-400" />
        <span className="text-[11px] text-slate-500">app.orvix.studio</span>
      </div>
      <div className="size-4" />
    </div>

    {/* Builder toolbar */}
    <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0f0f18] px-3 py-1.5">
      <div className="flex items-center gap-0.5">
        {["↖", "⬚", "T", "◻", "⌗"].map((t, i) => (
          <button
            key={t}
            className={`rounded px-2 py-1 text-[11px] transition ${i === 0 ? "bg-violet-500/20 text-violet-400" : "text-slate-600 hover:bg-white/5"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-violet-600 px-2.5 py-1 text-[11px] font-medium text-white">
          ▶ Preview
        </span>
        <span className="rounded-md border border-emerald-500/40 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
          ↑ Deploy
        </span>
      </div>
    </div>

    {/* 3-panel layout */}
    <div className="flex" style={{ height: "320px" }}>
      {/* Layers panel */}
      <div className="w-[138px] shrink-0 overflow-hidden border-r border-white/[0.06] bg-[#11111b]">
        <div className="border-b border-white/[0.06] px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">Layers</p>
        </div>
        <div className="space-y-0.5 p-2">
          <LayerItem label="Page" depth={0} />
          <LayerItem label="Navbar" depth={1} />
          <LayerItem label="Hero Section" depth={1} active />
          <LayerItem label="Heading" depth={2} />
          <LayerItem label="Subtext" depth={2} />
          <LayerItem label="CTA Button" depth={2} />
          <LayerItem label="Features" depth={1} />
          <LayerItem label="Footer" depth={1} />
        </div>
      </div>

      {/* Canvas */}
      <div className="flex flex-1 items-start justify-center overflow-hidden bg-[#0e0e16] pt-6">
        <div className="w-[260px] overflow-hidden rounded-lg border border-white/10 bg-white shadow-xl">
          {/* Fake navbar */}
          <div className="flex h-7 items-center justify-between border-b border-slate-100 px-3">
            <div className="h-2 w-12 rounded-full bg-slate-200" />
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-1.5 w-6 rounded-full bg-slate-100" />
              ))}
              <div className="h-4 w-10 rounded-full bg-slate-900" />
            </div>
          </div>

          {/* Selected hero — with selection handles */}
          <div className="relative border-2 border-violet-500 bg-gradient-to-br from-violet-50 to-blue-50/60 px-4 py-5">
            <div className="absolute -top-5 left-0 flex items-center gap-1 rounded-t bg-violet-600 px-2 py-0.5">
              <span className="text-[9px] font-medium text-white">Hero Section</span>
            </div>
            {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map(
              (pos) => (
                <div
                  key={pos}
                  className={`absolute ${pos} size-2 rounded-sm border border-violet-500 bg-white`}
                />
              ),
            )}
            <div className="mb-2 h-3 w-40 rounded-sm bg-violet-200" />
            <div className="mb-0.5 h-1.5 w-44 rounded-sm bg-slate-200" />
            <div className="mb-3 h-1.5 w-36 rounded-sm bg-slate-200" />
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded-full bg-violet-600" />
              <div className="h-6 w-16 rounded-full border border-slate-200" />
            </div>
          </div>

          {/* Feature grid below */}
          <div className="grid grid-cols-3 gap-1.5 px-3 py-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded border border-slate-100 bg-slate-50 p-2">
                <div className="mb-1.5 size-4 rounded bg-violet-100" />
                <div className="mb-1 h-1.5 w-full rounded-sm bg-slate-200" />
                <div className="h-1 w-2/3 rounded-sm bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Properties panel */}
      <div className="w-[148px] shrink-0 overflow-hidden border-l border-white/[0.06] bg-[#11111b]">
        <div className="border-b border-white/[0.06] px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Properties
          </p>
        </div>
        <div className="space-y-3.5 p-3">
          <div>
            <p className="mb-1 text-[10px] font-medium text-slate-600">Layout</p>
            <div className="space-y-1">
              <PropRow label="Width" value="100%" />
              <PropRow label="Height" value="auto" />
              <PropRow label="Padding" value="64px" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-medium text-slate-600">Background</p>
            <div className="flex items-center gap-2">
              <div className="size-5 shrink-0 rounded-sm border border-white/10 bg-gradient-to-br from-violet-100 to-blue-100" />
              <span className="text-[11px] text-slate-500">Gradient</span>
            </div>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-medium text-slate-600">Typography</p>
            <div className="space-y-1">
              <PropRow label="Font" value="Poppins" />
              <PropRow label="Size" value="48" />
              <PropRow label="Weight" value="700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Section: Hero ───────────────────────────────────────────────────── */

const Hero = () => (
  <section className="relative overflow-hidden bg-[#07070f] pb-20 pt-20 lg:pb-32 lg:pt-28">
    {/* Background glow */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="absolute -left-40 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-blue-600/8 blur-[100px]" />
    </div>

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5"
        >
          <Sparkles className="size-3.5 text-violet-400" />
          <span className="text-[13px] font-medium text-violet-300">Now in Public Beta</span>
          <span className="flex items-center gap-1 text-[13px] text-violet-400/70">
            — What's new <ArrowRight className="size-3" />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Build stunning UIs.{" "}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Deploy anywhere,
          </span>{" "}
          instantly.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-6 max-w-2xl text-[17px] leading-relaxed text-slate-400"
        >
          Orvix Studio is the visual UI builder for modern teams. Drag, drop, and design
          production-ready interfaces — then publish to your own domain or get a free{" "}
          <span className="font-medium text-slate-300">*.orvix.app</span> URL in one click.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-[15px] font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-150 hover:shadow-violet-500/40 hover:brightness-110 active:scale-[0.98]"
          >
            Start building — it's free
            <ArrowRight className="size-4" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-[15px] font-semibold text-slate-300 backdrop-blur transition-all duration-150 hover:bg-white/10 hover:text-white"
          >
            <FaGithub className="size-4" />
            Star on GitHub
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="mt-4 text-[13px] text-slate-600"
        >
          No credit card required · Free forever on Hobby plan
        </motion.p>

        {/* App mockup */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={5}
          className="mt-14 w-full max-w-5xl"
        >
          <AppMockup />
        </motion.div>
      </div>
    </div>
  </section>
);

/* ─── Section: Stats ──────────────────────────────────────────────────── */

const stats = [
  { value: "12,000+", label: "Projects built" },
  { value: "< 30s", label: "Average deploy time" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "500+", label: "UI components" },
];

const Stats = () => (
  <section className="border-y border-slate-100 bg-white py-10">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Section: Features ───────────────────────────────────────────────── */

const features = [
  {
    icon: Layers,
    color: "bg-violet-100 text-violet-600",
    title: "Visual Drag-and-Drop Editor",
    description:
      "Design pixel-perfect UIs using a rich library of 500+ components. No code required — but you can always drop in custom HTML or React.",
    bullets: ["500+ ready-made components", "Responsive by default", "Custom CSS & code blocks"],
  },
  {
    icon: Rocket,
    color: "bg-blue-100 text-blue-600",
    title: "One-Click Deployment",
    description:
      "Hit Deploy and your project is live in seconds. Orvix handles hosting, CDN, and SSL automatically — zero DevOps needed.",
    bullets: ["Global CDN with edge caching", "Automatic HTTPS/SSL", "Instant rollbacks"],
  },
  {
    icon: Globe,
    color: "bg-emerald-100 text-emerald-600",
    title: "Your Domain or Ours",
    description:
      "Every project gets a free *.orvix.app subdomain the moment you deploy. Connect your own domain anytime with a single DNS record.",
    bullets: ["Free *.orvix.app subdomain", "Connect any custom domain", "Wildcard SSL certificates"],
  },
];

const Features = () => (
  <section className="bg-white py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-violet-600">
          Why Orvix Studio
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
          Everything you need to build and ship
        </h2>
        <p className="mt-4 text-[17px] text-slate-500">
          From the first drag-and-drop to a live, production URL — all in one place.
        </p>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {features.map(({ icon: Icon, color, title, description, bullets }) => (
          <div
            key={title}
            className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <div className={`mb-5 inline-flex size-12 items-center justify-center rounded-xl ${color}`}>
              <Icon className="size-6" />
            </div>
            <h3 className="mb-3 text-[18px] font-semibold text-slate-900">{title}</h3>
            <p className="mb-5 text-[14px] leading-relaxed text-slate-500">{description}</p>
            <ul className="space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-[14px] text-slate-600">
                  <Check className="mt-0.5 size-4 shrink-0 text-violet-500" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Section: How it works ───────────────────────────────────────────── */

const steps = [
  {
    n: "01",
    icon: Layers,
    title: "Design visually",
    description:
      "Open the editor, drag in your components, and arrange them on the canvas. Customise colours, fonts, spacing, and layout — all visually.",
  },
  {
    n: "02",
    icon: Code2,
    title: "Customise & preview",
    description:
      "Use the properties panel to fine-tune every detail. Preview your UI at mobile, tablet, and desktop breakpoints in real time.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Deploy in one click",
    description:
      "Hit Deploy. Your site is instantly live on a free *.orvix.app URL. Connect your own domain whenever you're ready.",
  },
];

const HowItWorks = () => (
  <section className="bg-slate-50 py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-violet-600">
          How it works
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
          From idea to live site in minutes
        </h2>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {steps.map(({ n, icon: Icon, title, description }, i) => (
          <div key={n} className="relative">
            {/* connector line */}
            {i < steps.length - 1 && (
              <div className="absolute right-0 top-6 hidden h-px w-full translate-x-1/2 bg-slate-200 lg:block" />
            )}
            <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-violet-600 shadow-md shadow-violet-500/25">
                  <Icon className="size-5 text-white" />
                </div>
                <span className="text-4xl font-black text-slate-100">{n}</span>
              </div>
              <h3 className="mb-2 text-[18px] font-semibold text-slate-900">{title}</h3>
              <p className="text-[14px] leading-relaxed text-slate-500">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Section: Deploy Showcase ────────────────────────────────────────── */

const DeployShowcase = () => (
  <section className="relative overflow-hidden bg-[#07070f] py-24">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-x-1/4 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />
    </div>

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-widest text-violet-400">
            Instant deployment
          </p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-white lg:text-5xl">
            Your project, live{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              in seconds
            </span>
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-slate-400">
            Every project you deploy gets its own URL automatically — no setup, no config files, no
            waiting. Use our free subdomain or point your own domain with a single DNS record.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "Free *.orvix.app subdomain on every deploy",
              "Connect your own domain in under 60 seconds",
              "Automatic HTTPS with wildcard SSL certificates",
              "Global edge network for blazing-fast load times",
              "Instant rollbacks to any previous deployment",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[14px] text-slate-300">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>

          <Link
            to="/login"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-[15px] font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:brightness-110"
          >
            Deploy your first project <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Deploy UI card */}
        <div className="space-y-4">
          {/* Live URL card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur">
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
              Your project is live at
            </p>
            <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]" />
                <span className="font-mono text-[14px] text-slate-200">
                  my-project<span className="text-violet-400">.orvix.app</span>
                </span>
              </div>
              <button className="rounded-lg bg-white/5 px-3 py-1.5 text-[12px] font-medium text-slate-400 transition hover:bg-white/10 hover:text-slate-200">
                Copy
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/[0.05] bg-emerald-500/5 px-4 py-3">
              <Zap className="size-4 text-emerald-400" />
              <span className="text-[13px] text-slate-400">
                Deployed in{" "}
                <span className="font-semibold text-emerald-400">18 seconds</span> · 3 minutes ago
              </span>
            </div>
          </div>

          {/* Custom domain card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur">
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
              Or connect your own domain
            </p>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3">
                <Globe className="size-4 shrink-0 text-slate-600" />
                <span className="font-mono text-[14px] text-slate-500">yourdomain.com</span>
              </div>
              <button className="shrink-0 rounded-xl bg-violet-600 px-4 py-3 text-[13px] font-semibold text-white transition hover:bg-violet-500">
                Connect
              </button>
            </div>
            <p className="mt-3 text-[12px] text-slate-600">
              Add one CNAME record to your DNS · Usually propagates in &lt; 5 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Section: More Features ──────────────────────────────────────────── */

const moreFeatures = [
  {
    icon: RefreshCw,
    color: "text-violet-500",
    bg: "bg-violet-50",
    title: "Version History",
    description: "Every deploy is saved. Roll back to any point in time with a single click.",
  },
  {
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50",
    title: "Team Collaboration",
    description: "Invite your team, assign roles, and build together in real time.",
  },
  {
    icon: Code2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    title: "Clean Code Export",
    description: "Export production-ready React or HTML at any time — no vendor lock-in.",
  },
  {
    icon: Shield,
    color: "text-amber-500",
    bg: "bg-amber-50",
    title: "Enterprise-grade Security",
    description: "SSO, audit logs, and granular permissions for large teams.",
  },
  {
    icon: Zap,
    color: "text-pink-500",
    bg: "bg-pink-50",
    title: "Edge Performance",
    description: "Your sites are served from 120+ edge locations globally for < 50ms loads.",
  },
  {
    icon: Sparkles,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    title: "AI Component Suggestions",
    description: "Get smart suggestions as you build. AI fills in content, layouts, and styles.",
  },
];

const MoreFeatures = () => (
  <section className="bg-white py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-violet-600">
          Built for scale
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
          Everything a modern team needs
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {moreFeatures.map(({ icon: Icon, color, bg, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-100 p-6 transition-shadow hover:shadow-md"
          >
            <div className={`mb-4 inline-flex size-10 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`size-5 ${color}`} />
            </div>
            <h3 className="mb-2 text-[16px] font-semibold text-slate-900">{title}</h3>
            <p className="text-[14px] leading-relaxed text-slate-500">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Section: Pricing ────────────────────────────────────────────────── */

const plans = [
  {
    name: "Hobby",
    price: "Free",
    period: "forever",
    description: "Perfect for personal projects and trying out Orvix Studio.",
    features: [
      "3 projects",
      "Free *.orvix.app subdomain",
      "500MB bandwidth / mo",
      "Community support",
      "500+ UI components",
    ],
    cta: "Get started free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    description: "For professionals who need unlimited power and a custom domain.",
    features: [
      "Unlimited projects",
      "Custom domain",
      "100GB bandwidth / mo",
      "Priority support",
      "Export clean React code",
      "Version history (30 days)",
      "Password-protected pages",
    ],
    cta: "Start Pro trial",
    featured: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/ month",
    description: "Built for teams that need collaboration, analytics, and controls.",
    features: [
      "Everything in Pro",
      "5 team members",
      "Real-time collaboration",
      "Advanced analytics",
      "Unlimited version history",
      "SSO / SAML",
      "SLA & dedicated support",
    ],
    cta: "Talk to sales",
    featured: false,
  },
];

const Pricing = () => (
  <section className="bg-slate-50 py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-violet-600">
          Pricing
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-[17px] text-slate-500">
          Start free. Scale when you're ready. No hidden fees.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map(({ name, price, period, description, features, cta, featured }) => (
          <div
            key={name}
            className={`relative flex flex-col rounded-2xl p-8 ${
              featured
                ? "border-2 border-violet-500 bg-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]"
                : "border border-slate-200 bg-white shadow-sm"
            }`}
          >
            {featured && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-1 text-[12px] font-semibold text-white shadow-md">
                  Most popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <p className="mb-1 text-[14px] font-semibold text-slate-500">{name}</p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black tracking-tight text-slate-900">{price}</span>
                <span className="mb-1 text-[14px] text-slate-400">{period}</span>
              </div>
              <p className="mt-2 text-[14px] text-slate-500">{description}</p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-slate-600">
                  <Check
                    className={`mt-0.5 size-4 shrink-0 ${featured ? "text-violet-500" : "text-slate-400"}`}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              to="/login"
              className={`block rounded-xl py-3 text-center text-[14px] font-semibold transition-all duration-150 active:scale-[0.98] ${
                featured
                  ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md shadow-violet-500/25 hover:brightness-110"
                  : "border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Section: CTA ────────────────────────────────────────────────────── */

const CTA = () => (
  <section className="relative overflow-hidden bg-[#07070f] py-24">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/12 blur-[120px]" />
    </div>
    <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <Sparkles className="mx-auto mb-6 size-10 text-violet-400" />
      <h2 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
        Ready to ship your next UI?
      </h2>
      <p className="mt-5 text-[17px] leading-relaxed text-slate-400">
        Join thousands of designers and developers who use Orvix Studio to build and deploy
        beautiful UIs in a fraction of the time.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3.5 text-[16px] font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Start building for free
          <ArrowRight className="size-5" />
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-[16px] font-semibold text-slate-300 backdrop-blur transition-all hover:bg-white/10 hover:text-white"
        >
          View live demo
        </Link>
      </div>
      <p className="mt-5 text-[13px] text-slate-600">
        No credit card · Free *.orvix.app subdomain · Upgrade anytime
      </p>
    </div>
  </section>
);

/* ─── Home ────────────────────────────────────────────────────────────── */

const Home = () => (
  <>
    <Hero />
    <Stats />
    <Features />
    <HowItWorks />
    <DeployShowcase />
    <MoreFeatures />
    <Pricing />
    <CTA />
  </>
);

export default Home;
