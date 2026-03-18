import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Home, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(160deg,#f6f8fc_0%,#fef6ea_45%,#e8f5f7_100%)] px-6 py-16 text-slate-900">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-4 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

      <motion.section
        className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.45)] backdrop-blur md:p-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
          <Compass className="size-3.5" aria-hidden="true" />
          Route Not Found
        </motion.div>

        <motion.p variants={itemVariants} className="mt-8 text-7xl font-black leading-none tracking-tight text-slate-900 sm:text-8xl md:text-9xl">
          404
        </motion.p>

        <motion.h1 variants={itemVariants} className="mt-4 text-3xl font-semibold tracking-tight text-slate-800 sm:text-4xl">
          This page wandered off the map.
        </motion.h1>

        <motion.p variants={itemVariants} className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          The link may be old, the address might be mistyped, or the page may have moved. You can head back to where you came from or jump to the dashboard/home and continue from there.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 sm:w-auto"
          >
            <Link to="/">
              <Home className="size-4" aria-hidden="true" />
              Go Home
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleGoBack}
            className="w-full rounded-xl border-slate-300 bg-white/70 text-slate-800 hover:bg-slate-100 sm:w-auto"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Go Back
          </Button>
        </motion.div>
      </motion.section>
    </main>
  );
};

export default NotFoundPage;