
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram, MessageCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Cinema', path: '/cinema' },
    { name: 'About', path: '/about' },
    { name: 'Packages', path: '/packages' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? 'py-4 backdrop-blur-2xl bg-zinc-950/80 border-b border-white/5' : 'py-8'}`}>
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="group" onClick={() => setIsOpen(false)}>
          <div className="flex flex-col items-start leading-none">
            <span className="font-serif italic text-2xl md:text-3xl tracking-tight text-white group-hover:text-amber-600 transition-colors duration-500">Sunny Deshmukh</span>
            <span className="font-sans text-[0.6rem] uppercase tracking-[0.4em] text-zinc-400 mt-1">Photography</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-12">
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-sans text-[0.7rem] uppercase tracking-[0.3em] transition-all duration-300 hover:text-white ${location.pathname === link.path ? 'text-amber-600' : 'text-zinc-400'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <a 
            href="https://wa.me/yourphone" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10 transition-all duration-500 group"
          >
            <MessageCircle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform duration-500" />
            <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em] font-medium">Inquiry</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X strokeWidth={1} /> : <Menu strokeWidth={1} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 w-full bg-zinc-950 h-screen p-12 flex flex-col items-center justify-center text-center space-y-8"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`font-serif italic text-4xl hover:text-amber-600 transition-colors ${location.pathname === link.path ? 'text-amber-600' : 'text-zinc-100'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-12 flex gap-8">
              <Instagram className="w-6 h-6 text-zinc-400" />
              <MessageCircle className="w-6 h-6 text-zinc-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
