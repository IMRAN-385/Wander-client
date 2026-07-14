'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/providers/AppProvider';
import { Menu, X, ChevronDown, Heart, Settings, LogOut, Plus } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const userLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Settings },
  { href: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/dashboard/add-destination', label: 'Add Destination', icon: Plus },
];

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 20);
      if (current > 100) {
        setHidden(current > lastScrollY && current > 200);
      } else {
        setHidden(false);
      }
      setLastScrollY(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (loading) return null;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className={`transition-all duration-500 ${
        scrolled ? 'glass shadow-glass mx-2 sm:mx-4 mt-2 rounded-3xl' : 'bg-transparent mx-0 mt-0 rounded-none'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.span
                className="text-2xl"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🌍
              </motion.span>
              <span className={`text-lg sm:text-xl font-display font-bold tracking-tight transition-colors ${
                scrolled ? 'text-dark-900' : 'text-white'
              }`}>
                Wanderlust
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                    pathname === link.href
                      ? scrolled ? 'text-primary-600' : 'text-white'
                      : scrolled ? 'text-dark-500 hover:text-dark-900' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div layoutId="nav-active" className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${
                      scrolled ? 'bg-primary-500' : 'bg-white'
                    }`} />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {userLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm font-medium px-3 py-2 rounded-full transition-colors ${
                        scrolled ? 'text-dark-500 hover:text-dark-900' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <link.icon className="w-4 h-4" />
                        <span className="hidden xl:inline">{link.label}</span>
                      </span>
                    </Link>
                  ))}
                  <div className="w-px h-6 bg-dark-200/30 mx-1" />
                  <span className={`text-sm font-medium ${scrolled ? 'text-dark-600' : 'text-white/80'}`}>
                    {user?.name}
                  </span>
                  <button
                    onClick={logout}
                    className={`p-2 rounded-full transition-colors ${
                      scrolled ? 'hover:bg-red-50 text-dark-400 hover:text-red-500' : 'hover:bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={`text-sm font-medium transition-colors ${
                    scrolled ? 'text-dark-600 hover:text-dark-900' : 'text-white/80 hover:text-white'
                  }`}>
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="gradient-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-glow"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 rounded-full transition-colors ${
                scrolled ? 'text-dark-600 hover:bg-dark-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass shadow-elevated mx-2 mt-2 rounded-3xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.href ? 'bg-primary-50 text-primary-600' : 'text-dark-600 hover:bg-dark-50'
                  }`}>
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-dark-100 my-2" />
              {isAuthenticated ? (
                <>
                  {userLinks.map(link => (
                    <Link key={link.href} href={link.href}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-dark-600 hover:bg-dark-50">
                      <link.icon className="w-4 h-4" /> {link.label}
                    </Link>
                  ))}
                  <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" className="flex-1 text-center py-3 rounded-xl text-sm font-medium border border-dark-200 text-dark-700">Sign In</Link>
                  <Link href="/register" className="flex-1 text-center py-3 rounded-xl text-sm font-semibold bg-primary-600 text-white">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}