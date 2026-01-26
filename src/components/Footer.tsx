import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-zinc-950 pt-20 pb-10 border-t border-white/5">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-6 group">
              <span className="font-serif italic text-3xl tracking-tight text-white group-hover:text-amber-600 transition-colors">Sunny Deshmukh</span>
            </Link>
            <p className="font-sans text-zinc-400 text-[0.85rem] max-w-sm tracking-wide leading-relaxed opacity-70">
              Crafting legacies through cinematic storytelling. Capturing the quiet, emotional moments that define a lifetime.
            </p>
          </div>
          
          <div>
            <h4 className="font-sans text-[0.6rem] uppercase tracking-[0.4em] text-white mb-8">Studio</h4>
            <ul className="space-y-4">
              <li><Link to="/gallery" className="text-zinc-500 hover:text-white transition-colors text-[0.75rem] uppercase tracking-wider">Galleries</Link></li>
              <li><Link to="/about" className="text-zinc-500 hover:text-white transition-colors text-[0.75rem] uppercase tracking-wider">Our Story</Link></li>
              <li><Link to="/packages" className="text-zinc-500 hover:text-white transition-colors text-[0.75rem] uppercase tracking-wider">Collections</Link></li>
              <li><Link to="/contact" className="text-zinc-500 hover:text-white transition-colors text-[0.75rem] uppercase tracking-wider">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[0.6rem] uppercase tracking-[0.4em] text-white mb-8">Follow Us</h4>
            <div className="flex gap-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-amber-600 transition-colors">
                <Instagram size={18} strokeWidth={1} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-amber-600 transition-colors">
                <Youtube size={18} strokeWidth={1} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-amber-600 transition-colors">
                <Facebook size={18} strokeWidth={1} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-10">
          <span className="font-sans text-[0.55rem] uppercase tracking-[0.3em] text-zinc-600">
            © {new Date().getFullYear()} Sunny Deshmukh Photography. All rights reserved.
          </span>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-3 font-sans text-[0.55rem] uppercase tracking-[0.4em] text-zinc-400 hover:text-white transition-colors group"
          >
            <span>Back to top</span>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-amber-600 transition-colors">
              <ArrowUp size={10} strokeWidth={1.5} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;