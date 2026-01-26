
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import InstagramReel from '../components/InstagramReel';
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import { GALLERY_ITEMS } from '../data';
import { Play, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const shortFilms = GALLERY_ITEMS.filter(item => item.type === 'video').slice(0, 4);

  const folioCategories = [
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

  const [hoveredFilm, setHoveredFilm] = React.useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Hero 
        image="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069"
        title="The Echo of Forever"
        subtitle="Narrating the Heart’s Silence"
      />

      {/* The Perspective Section - Professional Compact Bio */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/30 p-1 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center bg-zinc-950/20 rounded-xl overflow-hidden">
            <div className="md:col-span-7 p-6 md:p-10 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-600/30">
                    <img 
                      src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=2048" 
                      alt="Sunny Deshmukh" 
                      className="w-full h-full object-cover grayscale brightness-90"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-[0.5rem] uppercase tracking-[0.4em] text-amber-600">The Perspective</span>
                    <span className="font-serif italic text-[0.65rem] text-zinc-500">Sunny Deshmukh</span>
                  </div>
                </div>
                
                <h2 className="font-serif italic text-2xl md:text-3xl text-white mb-4 leading-snug">
                  Beyond the frame, into the feeling.
                </h2>
                <p className="text-zinc-400 text-xs md:text-sm font-light leading-relaxed mb-6 max-w-sm">
                  We don't just record events; we preserve the visceral energy of your existence. Archiving the unspoken.
                </p>
                
                <Link to="/about" className="group flex items-center gap-3 w-fit">
                  <span className="font-sans text-[0.55rem] uppercase tracking-[0.4em] text-zinc-200 border-b border-white/10 group-hover:border-amber-600 group-hover:text-amber-600 transition-all pb-1">Our Ethos</span>
                  <ArrowRight size={10} className="text-zinc-500 group-hover:text-amber-600 transform group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] select-none pointer-events-none -z-10">
                <span className="font-serif italic text-[8rem] md:text-[12rem]">Poetry</span>
              </div>
            </div>

            <div className="md:col-span-5 aspect-[4/3] md:aspect-auto self-stretch relative bg-black overflow-hidden border-l border-white/5">
              <video 
                autoPlay muted loop playsInline 
                className="w-full h-full object-cover grayscale brightness-50"
                src="https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-bride-and-groom-34437-large.mp4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Folio - Tight Grid */}
      <section className="py-12 px-4 md:px-6 max-w-[1400px] mx-auto">
        <SectionHeading label="The Stills" title="Apertures of Grace" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {folioCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="group"
            >
              <Link to="/gallery" className="block relative">
                <div className="overflow-hidden rounded-lg aspect-[16/9] mb-4 bg-zinc-900 border border-white/5 shadow-md">
                  <img 
                    src={cat.image} 
                    alt={cat.title}
                    className="w-full h-full object-cover grayscale-[20%] transition-transform duration-[1200ms] group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-3 group-hover:border-amber-600/40 transition-colors">
                  <div>
                    <span className="font-sans text-[0.45rem] uppercase tracking-[0.4em] text-amber-600 mb-1 block">{cat.subtitle}</span>
                    <h3 className="font-serif italic text-xl md:text-2xl text-zinc-200 group-hover:text-white">{cat.title}</h3>
                  </div>
                  <ArrowRight size={14} className="text-zinc-600 group-hover:text-amber-600 mb-1 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Moving Moments - Refined Horizontal Scrolling */}
      <section className="py-16 bg-zinc-900/10 border-y border-white/5 overflow-hidden">
        <div className="px-6 md:px-12 max-w-[1400px] mx-auto mb-10 flex justify-between items-end">
          <SectionHeading label="Motion Poems" title="Flickering Heartbeats" />
          <Link to="/cinema" className="font-sans text-[0.55rem] uppercase tracking-[0.4em] text-zinc-500 hover:text-white pb-10 transition-all">Explore Films</Link>
        </div>

        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 px-6 md:px-12 no-scrollbar scroll-smooth snap-x snap-mandatory">
          {shortFilms.map((film: any, idx) => (
            <motion.div 
              key={film.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 w-[80vw] sm:w-64 md:w-72 lg:w-80 group relative aspect-[9/16] overflow-hidden rounded-xl bg-zinc-950 border border-white/5 snap-center md:snap-start shadow-xl cursor-pointer"
              onMouseEnter={() => setHoveredFilm(film.id)}
              onMouseLeave={() => setHoveredFilm(null)}
            >
               {getInstagramEmbed(film.url) ? (
                 <>
                    {/* Instagram Logic */}
                    {(hoveredFilm === film.id) ? (
                        <div className="absolute inset-0 z-20 bg-black flex items-center justify-center">
                             {/* Use component for correct native behavior */}
                             <InstagramReel permalink={film.url} className="w-full flex items-center justify-center pointer-events-none scale-[0.65] origin-center" />
                        </div>
                    ) : (
                       <>
                         {film.thumbnail_url ? (
                            <img 
                                src={film.thumbnail_url} 
                                alt={film.title}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                            />
                         ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                <span className="text-zinc-700 text-xs uppercase tracking-widest">No Preview</span>
                            </div>
                         )}
                       </>
                    )}
                 </>
               ) : (
                  <video 
                    src={film.url}
                    muted loop playsInline 
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity duration-700"
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                  />
               )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-5 right-5 pointer-events-none">
                <Play size={14} className="text-amber-600 mb-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
                <h4 className="font-serif italic text-lg text-white">{film.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA - Tightened */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
          <h2 className="font-serif italic text-4xl md:text-5xl text-white mb-6 relative z-10 tracking-tight">Let’s archive your soul.</h2>
          <Link to="/contact" className="inline-block bg-white text-zinc-950 px-8 py-3.5 rounded-full font-sans text-[0.6rem] uppercase tracking-[0.4em] font-bold hover:bg-amber-600 hover:text-white transition-all duration-500 relative z-10">
            Secure Your Date
          </Link>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01] pointer-events-none select-none">
             <span className="font-serif italic text-[10rem] md:text-[15rem] uppercase">Sincerity</span>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Home;
