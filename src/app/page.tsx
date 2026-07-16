'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, ArrowRight, Star, MapPin, TrendingUp, Shield, Award, Globe, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { destinations as allDestinations } from '@/data/destinations';
import { blogs } from '@/data/collections';
import { IDestination } from '@/types';
import DestinationCard from '@/components/destinations/DestinationCard';
import { useAuth } from '@/providers/AppProvider';

const heroSlides = [
  { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600', title: 'Discover Your Next', highlight: 'Adventure', subtitle: 'Explore breathtaking destinations across the globe — curated for the curious traveler.' },
  { image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600', title: 'Paradise', highlight: 'Awaits You', subtitle: 'From tropical beaches to mountain peaks — find your perfect escape.' },
  { image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1600', title: 'Chase the', highlight: 'Northern Lights', subtitle: 'Experience nature\'s most spectacular light show across Iceland\'s skies.' },
];

const heroParticles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${(i * 7 + 9) % 100}%`,
  top: `${(i * 13 + 5) % 100}%`,
  duration: 3 + ((i % 5) + 1) * 0.4,
  delay: (i % 7) * 0.6,
}));

const stats = [
  { label: 'Destinations', value: 200, suffix: '+' },
  { label: 'Countries', value: 60, suffix: '+' },
  { label: 'Happy Travelers', value: 50, suffix: 'K+' },
  { label: 'Reviews', value: 15, suffix: 'K+' },
];

const chartData = [
  { name: 'Beach', visitors: 4500 }, { name: 'Mountains', visitors: 3200 },
  { name: 'City', visitors: 5100 }, { name: 'Nature', visitors: 2800 },
  { name: 'Adventure', visitors: 3600 }, { name: 'Coastal', visitors: 2400 },
];

const features = [
  { icon: Globe, title: 'Curated Collection', desc: 'Every destination is handpicked by travel experts for exceptional quality and authentic experiences.' },
  { icon: Shield, title: 'Verified Reviews', desc: 'Real reviews from real travelers. No bots, no fake ratings — just honest feedback.' },
  { icon: TrendingUp, title: 'Smart Discovery', desc: 'AI-powered recommendations that understand your travel style and preferences.' },
  { icon: Award, title: 'Premium Quality', desc: 'We partner with top-rated destinations to ensure world-class experiences every time.' },
];

const testimonials = [
  { name: 'Emily Chen', role: 'Travel Photographer', text: 'Wanderlust transformed how I plan trips. The curation is impeccable — every recommendation has been extraordinary.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80' },
  { name: 'Marcus Williams', role: 'Digital Nomad', text: 'The filtering system is a game-changer. I can find destinations matching my budget and vibe in seconds. Pure magic.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80' },
  { name: 'Priya Sharma', role: 'Adventure Blogger', text: 'This platform understands what travelers actually need. Beautiful design, fast search, incredible destination details.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80' },
];

const ScrollReveal = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  );
};

const Counter = ({ target }: { target: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = target;
      const step = () => {
        start += Math.ceil((end - start) / 20);
        if (start >= end) { setCount(end); return; }
        setCount(start);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [isInView, target]);
  return <span ref={ref}>{count}</span>;
};

export default function HomePage() {
  const { toggleWishlist, user } = useAuth();
  const [slide, setSlide] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  const featured = allDestinations.filter(d => d.featured).slice(0, 4);
  const trending = allDestinations.filter(d => d.trending).slice(0, 4);

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div style={{ scaleX, transformOrigin: 'left' }} className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 z-[60] origin-left" />

      {/* HERO */}
      <section ref={heroRef} className="relative h-screen min-h-[650px] max-h-[900px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ scale: 1.15 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0"
            style={{ x: mousePos.x * -0.5, y: mousePos.y * -0.5 }}>
            <img src={heroSlides[slide].image} alt="" className="w-full h-full object-cover scale-105" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/30 to-dark-900/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/50 via-transparent to-dark-900/20" />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {heroParticles.map((particle) => (
            <motion.div key={particle.id}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{ left: particle.left, top: particle.top }}
              animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
              transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                Discover your next destination
              </motion.div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.05] mb-6">
                {heroSlides[slide].title}{' '}
                <span className="gradient-text">{heroSlides[slide].highlight}</span>
              </h1>
              <p className="text-base sm:text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
                {heroSlides[slide].subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/explore" className="gradient-primary text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-glow-lg inline-flex items-center gap-2">
                  Explore Destinations <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/about" className="bg-white/10 backdrop-blur-sm text-white border border-white/20 font-medium px-7 py-3.5 rounded-full hover:bg-white/20 transition-all inline-flex items-center gap-2">
                  Learn More
                </Link>
              </div>
            </motion.div>

            {/* Floating stats */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              className="hidden md:flex gap-6 mt-12">
              {stats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
                  className="glass rounded-2xl px-5 py-3">
                  <div className="text-2xl font-display font-bold text-white"><Counter target={s.value} />{s.suffix}</div>
                  <div className="text-xs text-white/60">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Hero pagination */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === slide ? 'bg-white w-8' : 'bg-white/40 w-1.5'}`} />
          ))}
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-24 bg-[#F8FAFC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-14">
              <div>
                <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Curated Picks</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mt-2">Featured Destinations</h2>
                <p className="text-dark-400 mt-3 max-w-lg">Handpicked by our travel experts for exceptional experiences.</p>
              </div>
              <Link href="/explore" className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((dest, i) => (
              <motion.div key={dest._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}>
                <DestinationCard destination={dest} onWishlist={toggleWishlist} isWishlisted={user?.wishlist?.includes(dest._id)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Find Your Vibe</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mt-2">Explore by Category</h2>
            <p className="text-dark-400 mt-3 max-w-lg mx-auto">Choose your perfect travel style from our curated categories.</p>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: '🏖️', label: 'Beach', count: 24 },
              { icon: '🏔️', label: 'Mountains', count: 18 },
              { icon: '🏙️', label: 'City', count: 31 },
              { icon: '🌿', label: 'Nature', count: 15 },
              { icon: '🧗', label: 'Adventure', count: 22 },
              { icon: '⛵', label: 'Coastal', count: 12 },
            ].map((cat, i) => (
              <motion.div key={cat.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}>
                <Link href={`/explore?category=${cat.label}`}
                  className="group relative block p-5 rounded-3xl bg-dark-50 hover-lift overflow-hidden">
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <h3 className="font-semibold text-dark-900 text-sm">{cat.label}</h3>
                  <p className="text-xs text-dark-400">{cat.count} destinations</p>
                  <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500"
                    initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'left' }} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS WITH CHART */}
      <section className="py-24 bg-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">By the Numbers</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2 mb-6">Wanderlust in Numbers</h2>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }} className="glass-dark rounded-2xl p-5">
                    <div className="text-3xl font-display font-bold text-white"><Counter target={s.value} />{s.suffix}</div>
                    <div className="text-sm text-dark-300">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="glass-dark rounded-3xl p-6">
                <h3 className="text-white font-semibold mb-4">Monthly Visitors by Category</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                      <Bar dataKey="visitors" fill="#0F766E" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Why Wanderlust</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mt-2">Travel Smarter, Not Harder</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-3xl p-6 card-shadow hover-glow">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-display font-bold text-dark-900 mb-2">{f.title}</h3>
                <p className="text-sm text-dark-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-14">
              <div>
                <span className="text-accent-600 text-sm font-semibold uppercase tracking-wider">Trending Now</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mt-2">Popular Right Now</h2>
              </div>
              <Link href="/explore?sortBy=popular" className="hidden sm:flex items-center gap-2 text-accent-600 font-semibold text-sm">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((dest, i) => (
              <motion.div key={dest._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}>
                <DestinationCard destination={dest} onWishlist={toggleWishlist} isWishlisted={user?.wishlist?.includes(dest._id)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 mt-2">What Travelers Say</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-3xl p-6 card-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-dark-900 text-sm">{t.name}</div>
                    <div className="text-xs text-dark-400">{t.role}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />)}
                </div>
                <p className="text-dark-500 text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex items-end justify-between mb-14">
            <div>
              <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Travel Journal</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-dark-900 mt-2">Latest Stories</h2>
            </div>
            <Link href="/blog" className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold text-sm">
              Read More <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((post, i) => (
              <motion.article key={post._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden card-shadow hover-glow">
                <div className="relative h-52 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-dark-800 text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-dark-400 mb-2">
                    <span>{post.authorName}</span>·<span>{post.readTime} min read</span>
                  </div>
                  <h3 className="font-display font-bold text-dark-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">{post.title}</h3>
                  <p className="text-sm text-dark-400 line-clamp-2">{post.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <motion.div className="absolute inset-0 bg-dark-900/30" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">Ready to Explore the World?</h2>
            <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">Join thousands of travelers who use Wanderlust to discover their next unforgettable destination.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/explore" className="bg-white text-primary-800 font-semibold px-8 py-3.5 rounded-full hover:bg-white/90 transition-all shadow-elevated">
                Browse Destinations
              </Link>
              <Link href="/register" className="bg-white/10 backdrop-blur-sm text-white border border-white/30 font-semibold px-8 py-3.5 rounded-full hover:bg-white/20 transition-all">
                Create Free Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-2xl mx-auto text-center">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Stay Inspired</span>
            <h2 className="text-3xl font-display font-bold text-dark-900 mt-2 mb-3">Get Weekly Travel Inspiration</h2>
            <p className="text-dark-400 mb-8">Curated destinations, travel tips, and exclusive deals delivered to your inbox every Friday.</p>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
              <input type="email" placeholder="Enter your email" required
                className="flex-1 px-5 py-3.5 rounded-full bg-white border border-dark-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              <button type="submit" className="gradient-primary text-white font-semibold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-glow">
                Subscribe
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}