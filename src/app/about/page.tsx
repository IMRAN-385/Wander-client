'use client';

import Link from 'next/link';
import { FaInstagram, FaTwitter, FaYoutube, FaFacebook } from 'react-icons/fa';

const socials = [
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
  { icon: FaFacebook, href: '#', label: 'Facebook' },
];

const footerLinks = {
  Explore: [
    { href: '/explore?category=Beach', label: 'Beach Getaways' },
    { href: '/explore?category=Mountains', label: 'Mountain Retreats' },
    { href: '/explore?category=City', label: 'City Breaks' },
    { href: '/explore?category=Adventure', label: 'Adventure Travel' },
    { href: '/explore?category=Nature', label: 'Nature Escapes' },
  ],
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/blog', label: 'Travel Blog' },
    { href: '/contact', label: 'Contact' },
    { href: '/dashboard/add-destination', label: 'Add Destination' },
  ],
  Support: [
    { href: '/contact', label: 'Help Center' },
    { href: '/contact', label: 'Privacy Policy' },
    { href: '/contact', label: 'Terms of Service' },
    { href: '/contact', label: 'FAQs' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌍</span>
              <span className="text-xl font-display font-bold text-white">Wanderlust</span>
            </Link>
            <p className="text-dark-300 text-sm leading-relaxed max-w-sm mb-6">
              Discover extraordinary destinations around the world. Your journey to unforgettable experiences begins with Wanderlust.
            </p>
            <div className="flex gap-3">
              {socials.map(social => (
                <a key={social.label} href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-dark-300 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/5">
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-dark-300 hover:text-white text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-400 text-sm">&copy; {new Date().getFullYear()} Wanderlust. Crafted with passion for explorers worldwide.</p>
          <div className="flex gap-6 text-sm text-dark-400">
            <Link href="/contact" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}