import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ================= ANIMATION VARIANTS ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function Intro() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleGetStarted = () => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn) {
      navigate("/home");
    } else {
      navigate("/sign");
    }
  };

  return (
    <div className="w-full bg-[#05050A] text-white overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* ================= NAVBAR ================= */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 px-8 lg:px-16 py-5 flex justify-between items-center bg-[#05050A]/70 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <span className="font-bold text-lg tracking-tighter">IC</span>
          </div>
          <span className="font-semibold text-xl tracking-wide hidden sm:block">Info Creator</span>
        </div>

        <div className="hidden md:flex gap-10 text-sm font-medium text-gray-400">
          <a href="#explore" className="hover:text-white transition-colors">Features</a>
          <a href="#partners" className="hover:text-white transition-colors">Integrations</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div className="flex gap-4">
          <Link to="/sign" className="px-5 py-2.5 text-sm font-medium hover:text-purple-400 transition-colors">
            Sign In
          </Link>
          <button
            onClick={() => navigate("/sign?mode=signup")}
            className="px-6 py-2.5 text-sm font-semibold rounded-full bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Start Free
          </button>
        </div>
      </motion.nav>

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,50,255,0.15),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/20 blur-[120px] rounded-[100%] pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 font-medium backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Introducing Info Creator 2.0
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8">
            Content creation, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400">
              supercharged by AI.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop staring at a blank page. Generate high-performing LinkedIn posts, elegant emails, and viral tweets in seconds with our state-of-the-art AI engine.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 rounded-full bg-white text-black font-semibold text-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Start Generating <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
            <a
              href="#explore"
              className="px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all font-semibold text-lg flex items-center gap-2"
            >
              See how it works
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Image / App Preview */}
        <motion.div 
          style={{ y: heroY }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative mt-24 w-full max-w-6xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-b from-purple-500/30 to-transparent rounded-t-[40px] blur-2xl opacity-50" />
          <div className="relative rounded-t-[32px] border border-white/10 bg-black/50 backdrop-blur-xl overflow-hidden shadow-2xl p-2">
            <div className="rounded-[24px] overflow-hidden border border-white/5">
               <img src="/create_account.png" alt="App Interface" className="w-full h-auto object-cover opacity-90" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-transparent" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= PARTNERS MARQUEE ================= */}
      <section id="partners" className="py-20 border-y border-white/5 bg-white/[0.02]">
        <p className="text-center text-sm font-medium text-gray-500 mb-10 tracking-widest uppercase">Trusted by forward-thinking creators at</p>
        <div className="relative w-full overflow-hidden flex">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#05050A] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#05050A] to-transparent z-10" />
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            className="flex gap-24 items-center whitespace-nowrap px-12"
          >
            {/* Duplicated for infinite scroll */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-24 items-center opacity-50 hover:opacity-100 transition-opacity duration-300">
                <img src="/facebook.png" className="h-8 grayscale hover:grayscale-0 transition-all" alt="Facebook" />
                <img src="/google-logo.png" className="h-8 grayscale hover:grayscale-0 transition-all" alt="Google" />
                <img src="/insta-logo.png" className="h-8 grayscale hover:grayscale-0 transition-all" alt="Instagram" />
                <img src="/linkedin-logo.png" className="h-8 grayscale hover:grayscale-0 transition-all" alt="LinkedIn" />
                <img src="/tweet-logo.png" className="h-8 grayscale hover:grayscale-0 transition-all" alt="Twitter" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= EXPLORE (BENTO GRID) ================= */}
      <section id="explore" className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Everything you need to <span className="text-purple-400">grow faster</span>.</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">A complete toolkit for digital creators, marketers, and founders. Designed to remove writers block forever.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[360px]">
            {/* Card 1: Blog */}
            <BentoCard 
              title="SEO-Optimized Blogs" 
              desc="Generate long-form articles with perfect structure and SEO tags instantly."
              image="/blog.png"
              className="md:col-span-2 bg-gradient-to-br from-purple-900/20 to-black"
            />
            
            {/* Card 2: Tweet */}
            <BentoCard 
              title="Viral Tweets" 
              desc="Short, punchy hooks designed for maximum Twitter engagement."
              image="/tweet.png"
              className="bg-gradient-to-bl from-blue-900/20 to-black"
            />

            {/* Card 3: Ad Copy */}
            <BentoCard 
              title="Ad Copy" 
              desc="High-converting Facebook and Google ad variations."
              image="/advertisment.png"
              className="bg-gradient-to-tr from-pink-900/20 to-black"
            />

            {/* Card 4: Emails */}
            <BentoCard 
              title="Email Campaigns" 
              desc="Cold emails and newsletters that actually get replies."
              image="/email.png"
              className="md:col-span-2 bg-gradient-to-tl from-indigo-900/20 to-black"
            />
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section id="contact" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center bg-white/5 border border-white/10 backdrop-blur-xl p-16 rounded-[40px] shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to scale your content?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">Join thousands of creators who are already using Info Creator to save hours of writing every day.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="px-10 py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-lg transition-all shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_50px_rgba(147,51,234,0.6)] hover:scale-105"
            >
              Get Started for Free
            </button>
            <Link
              to="/profile"
              className="px-10 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-all font-semibold text-lg"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-600 text-sm border-t border-white/5">
        <p>© 2026 Info Creator. Built for the modern creator.</p>
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function BentoCard({ title, desc, image, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
      className={`group relative overflow-hidden rounded-[32px] border border-white/10 flex flex-col ${className}`}
    >
      <div className="p-8 relative z-20">
        <h3 className="text-2xl font-bold mb-2 tracking-wide text-white group-hover:text-purple-300 transition-colors">{title}</h3>
        <p className="text-gray-400 text-sm max-w-xs">{desc}</p>
      </div>

      <div className="absolute bottom-0 right-0 w-[85%] h-[70%] transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-2 group-hover:-translate-x-2">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/80 z-10" />
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover object-left-top rounded-tl-2xl shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity"
        />
      </div>
    </motion.div>
  );
}