import { useEffect, useState } from "react";
import {
  Blocks,
  BookOpen,
  Briefcase,
  ChevronDown,
  CircleDollarSign,
  Megaphone,
  Menu,
  Newspaper,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import Logo from "@/assets/images/logo-white.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

/* ─── Types & data ────────────────────────────────────────────────────── */

type DesktopMenuKey = "product" | "solutions" | "resources";

type MenuEntry = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
};

type ResourceGroup = {
  heading: string;
  items: MenuEntry[];
};

const productItems: MenuEntry[] = [
  {
    title: "Features",
    description: "Explore how UI Studio accelerates design-to-code.",
    icon: Sparkles,
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    title: "Changelog",
    description: "See the latest improvements and releases.",
    icon: Newspaper,
    iconBg: "bg-sky-100 text-sky-600",
  },
  {
    title: "Integrations",
    description: "Connect to tools you already use across your stack.",
    icon: Workflow,
    iconBg: "bg-emerald-100 text-emerald-600",
  },
];

const solutionItems: MenuEntry[] = [
  {
    title: "Content Management",
    description: "Manage visual content with modern workflows.",
    icon: Blocks,
    iconBg: "bg-orange-100 text-orange-600",
  },
  {
    title: "E-commerce",
    description: "Build immersive shopping experiences quickly.",
    icon: CircleDollarSign,
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Marketing",
    description: "Launch and iterate campaigns without bottlenecks.",
    icon: Megaphone,
    iconBg: "bg-pink-100 text-pink-600",
  },
  {
    title: "Developers",
    description: "Increase productivity with reusable UI systems.",
    icon: Workflow,
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    title: "Agencies",
    description: "Deliver client projects faster with consistency.",
    icon: Briefcase,
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    title: "Enterprise",
    description: "Scale securely with powerful governance controls.",
    icon: Blocks,
    iconBg: "bg-sky-100 text-sky-600",
  },
];

const resourceGroups: ResourceGroup[] = [
  {
    heading: "Learn",
    items: [
      {
        title: "Customer Stories",
        description: "Discover how teams ship products with UI Studio.",
        icon: Sparkles,
        iconBg: "bg-violet-100 text-violet-600",
      },
      {
        title: "Documentation",
        description: "Read guides and API references.",
        icon: BookOpen,
        iconBg: "bg-sky-100 text-sky-600",
      },
      {
        title: "Blog",
        description: "Read about front-end trends and product updates.",
        icon: Newspaper,
        iconBg: "bg-emerald-100 text-emerald-600",
      },
      {
        title: "GitHub",
        description: "Contribute to open-source examples and tooling.",
        icon: FaGithub,
        iconBg: "bg-slate-100 text-slate-700",
      },
    ],
  },
  {
    heading: "Community",
    items: [
      {
        title: "Showcase",
        description: "See what customers build with UI Studio.",
        icon: Sparkles,
        iconBg: "bg-pink-100 text-pink-600",
      },
      {
        title: "Experts",
        description: "Find specialists to accelerate your project.",
        icon: Briefcase,
        iconBg: "bg-amber-100 text-amber-600",
      },
      {
        title: "Forum",
        description: "Get help and discuss with other builders.",
        icon: Workflow,
        iconBg: "bg-orange-100 text-orange-600",
      },
      {
        title: "Slack Community",
        description: "Chat in real-time with community members.",
        icon: Blocks,
        iconBg: "bg-teal-100 text-teal-600",
      },
    ],
  },
];

/* ─── Shared trigger className ────────────────────────────────────────── */

const triggerCls =
  "h-auto rounded-full px-3.5 py-2 text-[14px] font-medium text-slate-600 bg-transparent hover:bg-slate-100 hover:text-slate-900";

/* ─── Navbar ──────────────────────────────────────────────────────────── */

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] =
    useState<DesktopMenuKey | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMobileSection = (key: DesktopMenuKey) => {
    setOpenMobileSection((prev) => (prev === key ? null : key));
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-all duration-300",
        scrolled
          ? "border-slate-200 shadow-[0_2px_20px_-4px_rgba(15,23,42,0.12)]"
          : "border-transparent",
      )}
    >
      <nav className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center">
          <img src={Logo} alt="UI Studio Logo" className="w-[130px]" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Product */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={triggerCls}>
                  Product
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-[360px] space-y-0.5 p-1">
                    {productItems.map((item) => (
                      <MenuListItem key={item.title} item={item} />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Solutions */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={triggerCls}>
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[460px] grid-cols-2 gap-0.5 p-1">
                    {solutionItems.map((item) => (
                      <MenuListItem key={item.title} item={item} />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Marketplace */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={cn(navigationMenuTriggerStyle(), triggerCls)}
                >
                  Marketplace
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Resources */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={triggerCls}>
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[680px] grid-cols-2 gap-6 p-3">
                    {resourceGroups.map((group) => (
                      <div key={group.heading}>
                        <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                          {group.heading}
                        </p>
                        <ul className="space-y-0.5">
                          {group.items.map((item) => (
                            <MenuListItem key={item.title} item={item} />
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Pricing */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={cn(navigationMenuTriggerStyle(), triggerCls)}
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="rounded-full p-2 text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900"
          >
            <FaGithub className="size-[18px]" />
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-full px-4 py-2 text-[14px] font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900"
          >
            Sign In
          </button>
          <button
            type="button"
             onClick={() => navigate('/register')}
            className="rounded-full bg-slate-950 px-5 py-2 text-[14px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-slate-800 hover:shadow-md active:scale-[0.98]"
          >
            Get Started
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 transition-colors duration-150 hover:bg-slate-50 lg:hidden"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </nav>

      {/* Mobile drawer */}
      {isMobileOpen ? (
        <div className="animate-in fade-in slide-in-from-top-2 border-t border-slate-100 bg-white px-4 pb-6 pt-3 duration-200 lg:hidden">
          <div className="mx-auto max-w-7xl space-y-2">
            <MobileSection
              label="Product"
              open={openMobileSection === "product"}
              onToggle={() => handleMobileSection("product")}
              items={productItems}
            />
            <MobileSection
              label="Solutions"
              open={openMobileSection === "solutions"}
              onToggle={() => handleMobileSection("solutions")}
              items={solutionItems}
            />
            <MobileResourceSection
              label="Resources"
              open={openMobileSection === "resources"}
              onToggle={() => handleMobileSection("resources")}
              groups={resourceGroups}
            />
            <MobileLink label="Marketplace" />
            <MobileLink label="Pricing" />

            <div className="grid grid-cols-2 gap-2.5 pt-3">
              <button
                type="button"
                 onClick={() => navigate('/login')}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Sign In
              </button>
              <button
                type="button"
                 onClick={() => navigate('/register')}
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

/* ─── Desktop: single menu list item ─────────────────────────────────── */

const MenuListItem = ({ item }: { item: MenuEntry }) => (
  <li>
    <NavigationMenuLink
      href="#"
      className="group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50"
    >
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
          item.iconBg,
        )}
      >
        <item.icon className="size-4" />
      </span>
      <span>
        <span className="block text-[13px] font-semibold text-slate-900">
          {item.title}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-slate-500">
          {item.description}
        </span>
      </span>
    </NavigationMenuLink>
  </li>
);

/* ─── Mobile: expandable section ─────────────────────────────────────── */

type MobileSectionProps = {
  label: string;
  open: boolean;
  onToggle: () => void;
  items: MenuEntry[];
};

const MobileSection = ({
  label,
  open,
  onToggle,
  items,
}: MobileSectionProps) => (
  <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-800"
    >
      {label}
      <ChevronDown
        className={cn(
          "size-4 text-slate-400 transition-transform duration-200",
          open && "rotate-180",
        )}
      />
    </button>
    {open ? (
      <div className="animate-in fade-in slide-in-from-top-1 border-t border-slate-100 px-2 py-2 duration-150">
        <MobileMenuList items={items} />
      </div>
    ) : null}
  </div>
);

/* ─── Mobile: resource section with groups ────────────────────────────── */

type MobileResourceSectionProps = {
  label: string;
  open: boolean;
  onToggle: () => void;
  groups: ResourceGroup[];
};

const MobileResourceSection = ({
  label,
  open,
  onToggle,
  groups,
}: MobileResourceSectionProps) => (
  <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-800"
    >
      {label}
      <ChevronDown
        className={cn(
          "size-4 text-slate-400 transition-transform duration-200",
          open && "rotate-180",
        )}
      />
    </button>
    {open ? (
      <div className="animate-in fade-in slide-in-from-top-1 space-y-3 border-t border-slate-100 px-2 py-3 duration-150">
        {groups.map((group) => (
          <div key={group.heading}>
            <p className="mb-0.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {group.heading}
            </p>
            <MobileMenuList items={group.items} />
          </div>
        ))}
      </div>
    ) : null}
  </div>
);

/* ─── Mobile: menu item list (plain <a> tags, no Radix) ───────────────── */

const MobileMenuList = ({ items }: { items: MenuEntry[] }) => (
  <ul className="space-y-0.5">
    {items.map((item) => (
      <li key={item.title}>
        <a
          href="#"
          className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white"
        >
          <span
            className={cn(
              "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
              item.iconBg,
            )}
          >
            <item.icon className="size-4" />
          </span>
          <span>
            <span className="block text-[13px] font-semibold text-slate-900">
              {item.title}
            </span>
            <span className="mt-0.5 block text-xs leading-snug text-slate-500">
              {item.description}
            </span>
          </span>
        </a>
      </li>
    ))}
  </ul>
);

/* ─── Mobile: plain link ──────────────────────────────────────────────── */

const MobileLink = ({ label }: { label: string }) => (
  <a
    href="#"
    className="block rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100"
  >
    {label}
  </a>
);

export default Navbar;
