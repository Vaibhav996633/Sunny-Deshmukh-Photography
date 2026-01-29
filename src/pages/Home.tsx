
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import InstagramReel from '../components/InstagramReel';
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import { GALLERY_ITEMS } from '../data';
import { Play, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import vaibhav from '../assets/vaibhav.jpeg';

import PageTransition from '../components/PageTransition';

const Home: React.FC = () => {
  const [shortFilms, setShortFilms] = React.useState<any[]>([]);
  const [loadingFilms, setLoadingFilms] = React.useState(true);
  const [hoveredFilm, setHoveredFilm] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchShortFilms = async () => {
      setLoadingFilms(true);
      // Fetch videos and manually filter out Instagram links to ensure only uploaded content shows
      const { data } = await supabase
        .from('gallery')
        .select('*')
        .eq('type', 'video')
        .limit(10); // Fetch a few more to filter
      
      const filtered = (data || []).filter(f => !f.url.includes('instagram.com')).slice(0, 6);
      setShortFilms(filtered);
      setLoadingFilms(false);
    };
    fetchShortFilms();
  }, []);

  const folioCategories = [
    // ... (rest of folioCategories remains same)
    {
      id: 'weddings',
      title: 'Weddings',
      subtitle: 'The Grand Union',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070',
    },
    {
      id: 'pre-wedding',
      title: 'Pre-Wedding',
      subtitle: 'The Prelude',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2070',
    },
    {
      id: 'rituals',
      title: 'Rituals',
      subtitle: 'The Sacred',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070',
    },
    {
      id: 'portraits',
      title: 'Portraits',
      subtitle: 'The Soul',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2076',
    }
  ];


  const getInstagramEmbed = (url: string) => {
    if (!url || !url.includes('instagram.com')) return null;
    const match = url.match(/instagram\.com\/(?:reel|p)\/([^/?#&]+)/);
    if (match && match[1]) {
        return `https://www.instagram.com/p/${match[1]}/embed`;
    }
    return null; 
  };

  return (
    <PageTransition>
      {/* Hero Section */}
      <div className="relative">
        <Hero 
          image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2070&q=80"
          title="The Echo of Forever"
          subtitle="Narrating the Heart’s Silence"
        />
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 flex gap-4 z-20 w-full justify-center" style={{ top: 'calc(50% + 3.5rem)' }}>
          <Link
            to="/gallery"
            className="backdrop-blur-md bg-zinc-900/40 border border-white/10 shadow-lg rounded-full px-5 py-2 font-sans text-xs uppercase tracking-[0.3em] text-zinc-200 hover:bg-amber-600 hover:text-white transition-all duration-300"
          >
            Gallery
          </Link>
          <Link
            to="/contact"
            className="backdrop-blur-md bg-zinc-900/40 border border-white/10 shadow-lg rounded-full px-5 py-2 font-sans text-xs uppercase tracking-[0.3em] text-zinc-200 hover:bg-amber-600 hover:text-white transition-all duration-300"
          >
            Contact
          </Link>
        </div>
      </div>

      {/* The Perspective Section */}
      <section className="py-16 md:py-28 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900/20 backdrop-blur-md shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] group"
          >
            <div className="flex flex-row items-stretch min-h-[350px] md:min-h-[500px]">
              {/* Left Content Side */}
              <div className="w-[60%] md:w-[58%] p-6 md:p-16 relative z-10 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="flex flex-col mb-6 md:mb-10">
                    <span className="font-sans text-[0.45rem] md:text-[0.6rem] uppercase tracking-[0.5em] text-amber-600 font-bold mb-1">
                      The Perspective
                    </span>
                    <span className="font-serif italic text-[0.6rem] md:text-[0.8rem] text-zinc-500 tracking-wider">
                      Sunny Deshmukh
                    </span>
                  </div>
                  
                  <h2 className="font-serif italic text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white mb-6 md:mb-10 leading-[1.1] tracking-tight">
                    Beyond the frame, <br className="hidden md:block" /> 
                    into the <span className="text-zinc-400">feeling.</span>
                  </h2>
                  
                  <p className="text-zinc-400 text-[0.65rem] md:text-base font-light leading-relaxed mb-8 md:mb-12 max-w-sm md:max-w-md">
                    We don't just record events; we preserve the visceral energy of your existence. Archiving the unspoken, the unseen, and the unforgettable.
                  </p>
                  
                  <Link to="/about" className="group/link flex items-center gap-4 w-fit">
                    <div className="relative overflow-hidden">
                      <span className="font-sans text-[0.5rem] md:text-[0.65rem] uppercase tracking-[0.4em] text-zinc-200 block transition-transform duration-500 group-hover/link:-translate-y-full">
                        Our Ethos
                      </span>
                      <span className="font-sans text-[0.5rem] md:text-[0.65rem] uppercase tracking-[0.4em] text-amber-600 absolute top-0 left-0 transition-transform duration-500 translate-y-full group-hover/link:translate-y-0">
                        Our Ethos
                      </span>
                    </div>
                    <div className="w-8 h-[1px] bg-white/20 group-hover/link:w-12 group-hover/link:bg-amber-600 transition-all duration-500" />
                  </Link>
                </motion.div>
                
                {/* Artistic Background Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none -z-10 w-full text-center">
                  <span className="font-serif italic text-[6rem] md:text-[15rem] leading-none whitespace-nowrap">
                    Poetry
                  </span>
                </div>
              </div>

              {/* Right Image Side */}
              <div className="w-[40%] md:w-[42%] relative overflow-hidden bg-zinc-950 border-l border-white/5">
                <motion.div 
                  className="w-full h-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
                >
                  <img
                    src={vaibhav}
                    alt="Sunny Deshmukh"
                    className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[1.5s]"
                  />
                </motion.div>
                
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-zinc-950/10 mix-blend-overlay pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cinematic Folio (Stills) */}
      <section className="py-24 px-4 md:px-12 max-w-[1700px] mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <SectionHeading label="The Stills" title="Apertures of Grace" />
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
            <div className="hidden md:block max-w-xs text-zinc-500 font-light text-[0.7rem] leading-relaxed italic border-l border-amber-600/30 pl-6">
              "Photography is a way of feeling, of touching, of loving. What you have caught on film is captured forever."
            </div>
            <Link to="/gallery" className="flex items-center gap-3 bg-white/5 border border-white/10 px-7 py-3.5 rounded-full font-sans text-[0.55rem] uppercase tracking-[0.4em] text-zinc-300 hover:bg-amber-600 hover:text-white transition-all shadow-xl group whitespace-nowrap">
               <span>Explore Stills</span>
               <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {folioCategories.map((cat, idx) => {
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-zinc-900 border border-white/5 shadow-xl cursor-pointer aspect-[3/4]"
              >
                <Link to="/gallery" className="block w-full h-full relative">
                  <img 
                    src={cat.image} 
                    alt={cat.title}
                    className="w-full h-full object-cover grayscale transition-all duration-[1s] ease-out group-hover:scale-110 group-hover:grayscale-0 brightness-75 group-hover:brightness-110"
                  />
                  
                  {/* Card Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Floating Content */}
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col items-start translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-2.5">
                      <span className="font-sans text-[0.4rem] md:text-[0.45rem] uppercase tracking-[0.4em] text-amber-500 font-bold whitespace-nowrap">
                        {cat.subtitle}
                      </span>
                    </div>
                    
                    <h3 className="font-serif italic text-xl md:text-2xl lg:text-3xl text-white leading-tight">
                      {cat.title}
                    </h3>
                  </div>
                  
                  {/* Unique Hover Interaction: Sliding Border */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute top-4 left-4 right-4 bottom-4 border border-white/10 rounded-[1rem] scale-95 group-hover:scale-100 transition-transform duration-700" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Moving Moments - Uploaded Videos Only */}
      <section className="py-24 bg-zinc-950 border-y border-white/5 overflow-hidden">
        <div className="px-6 md:px-12 max-w-[1400px] mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <SectionHeading 
            label="Motion Poems" 
            title="Flickering Heartbeats" 
            description="Cinematic fragments of shared history, captured with intention."
          />
          <Link to="/cinema" className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full font-sans text-[0.55rem] uppercase tracking-[0.4em] text-zinc-300 hover:bg-amber-600 hover:text-white transition-all shadow-xl group">
             <span>Explore Films</span>
             <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loadingFilms ? (
          <div className="py-20 flex flex-col items-center gap-4 text-zinc-600">
            <Loader2 className="animate-spin" size={20} />
            <span className="uppercase tracking-widest text-[0.6rem]">Opening Cinema...</span>
          </div>
        ) : (
          <div className="flex gap-6 md:gap-10 overflow-x-auto pb-12 px-6 md:px-12 no-scrollbar scroll-smooth snap-x snap-mandatory">
            {shortFilms.map((film: any, idx) => (
              <motion.div 
                key={film.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex-shrink-0 w-[85vw] sm:w-[500px] md:w-[600px] aspect-video group relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5 snap-center md:snap-start shadow-2xl cursor-pointer transition-all duration-700 hover:border-amber-600/30"
                onMouseEnter={() => setHoveredFilm(film.id)}
                onMouseLeave={() => setHoveredFilm(null)}
              >
                <div className="w-full h-full relative">
                    <video 
                        src={film.url}
                        autoPlay
                        muted loop playsInline 
                        className="w-full h-full object-cover opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                        onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                        onLoadedMetadata={(e) => {
                            const video = e.target as HTMLVideoElement;
                            const observer = new IntersectionObserver(
                                ([entry]) => {
                                    if (entry.isIntersecting) {
                                        video.play().catch(() => {});
                                    } else {
                                        video.pause();
                                    }
                                },
                                { threshold: 0.1 }
                            );
                            observer.observe(video);
                        }}
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-10 left-8 right-8 pointer-events-none">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="w-6 h-[1px] bg-amber-600" />
                     <span className="font-sans text-[0.45rem] uppercase tracking-[0.4em] text-amber-600">{film.category}</span>
                  </div>
                  <h4 className="font-serif italic text-xl md:text-2xl text-white group-hover:translate-x-2 transition-transform duration-500">{film.title}</h4>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                     <Play size={10} className="text-amber-600" fill="currentColor" />
                     <span className="font-sans text-[0.5rem] uppercase tracking-[0.2em] text-zinc-400">View Story</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Final CTA - Tightened */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
          <h2 className="font-serif italic text-4xl md:text-5xl text-white mb-6 relative z-10 tracking-tight">Let’s archive your soul.</h2>
          <Link to="/contact" className="inline-block bg-white text-zinc-950 px-8 py-3.5 rounded-full font-sans text-[0.6rem] uppercase tracking-[0.4em] font-bold hover:bg-amber-600 hover:text-white transition-all duration-500 relative z-10 shadow-2xl">
            Secure Your Date
          </Link>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01] pointer-events-none select-none">
             <span className="font-serif italic text-[10rem] md:text-[15rem] uppercase">Sincerity</span>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
};

export default Home;
