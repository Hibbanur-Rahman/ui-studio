import { FaDiscord, FaGithub, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

import Logo from "@/assets/images/logo.png";

/* ─── Link data ───────────────────────────────────────────────────────── */

const footerLinks = [
  {
    heading: "Product",
    items: [
      { label: "Features", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Integrations", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    heading: "Solutions",
    items: [
      { label: "Content Management", href: "#" },
      { label: "E-commerce", href: "#" },
      { label: "Marketing", href: "#" },
      { label: "Agencies", href: "#" },
      { label: "Enterprise", href: "#" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { label: "Documentation", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Customer Stories", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Showcase", href: "#" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Partners", href: "#" },
    ],
  },
];

const socials = [
  { icon: FaXTwitter, label: "X / Twitter", href: "#" },
  { icon: FaGithub, label: "GitHub", href: "https://github.com" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
  { icon: FaDiscord, label: "Discord", href: "#" },
  { icon: FaYoutube, label: "YouTube", href: "#" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Settings", href: "#" },
  { label: "Status", href: "#" },
];

/* ─── Footer ──────────────────────────────────────────────────────────── */

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400">
      {/* ── Main grid ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand column */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="inline-block w-fit">
              <img src={Logo} alt="UI Studio" className="w-[140px] opacity-90" />
            </Link>

            <p className="max-w-[260px] text-[14px] leading-relaxed text-slate-400">
              The fastest way to turn designs into production-ready UI. Built for teams who ship.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border border-slate-800 text-slate-500 transition-colors duration-150 hover:border-slate-700 hover:bg-slate-800 hover:text-slate-200"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>

            {/* Badge */}
            <div className="flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_2px_rgba(16,185,129,0.5)]" />
              <span className="text-[12px] font-medium text-slate-400">All systems operational</span>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map(({ heading, items }) => (
            <div key={heading}>
              <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-widest text-slate-300">
                {heading}
              </h3>
              <ul className="space-y-3">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[14px] text-slate-400 transition-colors duration-150 hover:text-slate-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Newsletter ────────────────────────────────────────────────── */}
        <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-900 px-6 py-7 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div className="mb-4 sm:mb-0">
            <p className="text-[15px] font-semibold text-slate-200">Stay in the loop</p>
            <p className="mt-0.5 text-[13px] text-slate-500">
              Product updates, tutorials, and design system news — no spam.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-sm items-center gap-2"
          >
            <input
              type="email"
              placeholder="you@company.com"
              className="h-9 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 text-[14px] text-slate-200 placeholder:text-slate-600 outline-none transition-colors focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
            />
            <button
              type="submit"
              className="h-9 rounded-lg bg-white px-4 text-[13px] font-semibold text-slate-950 transition-colors duration-150 hover:bg-slate-200 active:scale-[0.98]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────── */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-[13px] text-slate-600">
            © {new Date().getFullYear()} UI Studio, Inc. All rights reserved.
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {legalLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-[13px] text-slate-600 transition-colors duration-150 hover:text-slate-400"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
