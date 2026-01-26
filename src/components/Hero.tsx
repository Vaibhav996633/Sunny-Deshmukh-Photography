import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  image: string;
  title: string;
  subtitle: string;
  showScroll?: boolean;
}

const Hero: React.FC<HeroProps> = ({ image, title, subtitle, showScroll = true }) => {
  return (
    <section className="relative h-[85vh] md:h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img 
          src={image} 
          alt="Hero background" 
          className="w-full h-full object-cover ken-burns brightness-50 grayscale-[10%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-zinc-950" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans text-[0.6rem] md:text-[0.75rem] uppercase tracking-[0.6em] text-amber-600 mb-6 block font-medium"
        >
          {subtitle}
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif italic text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-white tracking-tight"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="mt-8"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-amber-600/60 to-transparent mx-auto hidden md:block" />
        </motion.div>
      </div>

      {showScroll && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        >
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <span className="font-sans text-[0.5rem] uppercase tracking-[0.4em] text-zinc-500 group-hover:text-white transition-colors">Discover</span>
            <ChevronDown className="w-3 h-3 text-zinc-600 group-hover:text-amber-600 transition-colors" strokeWidth={1.5} />
          </button>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;