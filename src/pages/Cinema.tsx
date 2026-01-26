
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import SectionHeading from '../components/SectionHeading';
import { Play, X, Volume2, VolumeX, Loader2 } from 'lucide-react';
import InstagramReel from '../components/InstagramReel';

const Cinema: React.FC = () => {
  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState<string | null>(null);
  const [hoveredFilm, setHoveredFilm] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const fetchFilms = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('type', 'video');
      
      if (!error) setFilms(data || []);
      setLoading(false);
    };
    fetchFilms();
  }, []);

  const activeFilm = films.find(f => f.id === selectedFilm);

  const getInstagramEmbed = (url: string) => {
    if (!url.includes('instagram.com')) return null;
    const match = url.match(/instagram\.com\/(?:reel|p)\/([^/?#&]+)/);
    if (match && match[1]) {
        return `https://www.instagram.com/p/${match[1]}/embed`;
    }
    return null; 
  };

  return (
    <div className="pt-40 pb-32 min-h-screen bg-zinc-950">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <SectionHeading 
          label="The Motion Archive"
          title="Cinematic Narrative"
          description="High-end wedding films captured with intentional movement and emotional resonance. These are not just videos; they are curated narratives graded to cinema standards."
        />

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4 text-zinc-600">
            <Loader2 className="animate-spin" size={20} />
            <span className="font-sans uppercase tracking-widest text-[0.6rem]">Opening Reels...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {films.map((film, idx) => (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.8 }}
                className="group relative cursor-pointer"
                onClick={() => setSelectedFilm(film.id)}
                onMouseEnter={() => setHoveredFilm(film.id)}
                onMouseLeave={() => setHoveredFilm(null)}
              >
                <div className="aspect-[9/16] overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5 relative">
                  {film.thumbnail_url ? (
                    <>
                       {/* If it's hovered and Instagram link, show the embed after a delay? Actually embed is heavy.
                           User wants: "when mouse hour go on video it will start". 
                           For Instagram, we can't autoplay a muted embed reliably on hover without lag.
                           But let's try to swap it if hovered. */}
                       {(hoveredFilm === film.id && getInstagramEmbed(film.url)) ? (
                          <div className="absolute inset-0 z-20 bg-black">
                              <iframe 
                                src={getInstagramEmbed(film.url)!} 
                                className="w-full h-full object-cover scale-[1.5] pointer-events-none" 
                                frameBorder="0" 
                                scrolling="no"
                              />
                              {/* Overlay to prevent clicks while hovering in grid (we want click to open modal) */}
                              <div className="absolute inset-0 bg-transparent" />
                          </div>
                       ) : (
                         <img 
                            src={film.thumbnail_url} 
                            alt={film.title}
                            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                         />
                       )}
                       
                       <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />
                    </>
                  ) : (
                      <video 
                        src={film.url} 
                        muted 
                        loop 
                        playsInline 
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                        onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                        onMouseOut={(e) => {
                          const video = e.target as HTMLVideoElement;
                          video.pause();
                          video.currentTime = 0;
                        }}
                      />
                  )}
                  
                  {/* Play Button Overlay (Hidden on hover if playing) */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-300 ${hoveredFilm === film.id ? 'opacity-0' : 'opacity-80'}`}>
                    <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:scale-110 group-hover:border-amber-600 transition-all duration-700">
                      <Play size={24} className="text-white group-hover:text-amber-600 ml-1.5" fill="currentColor" />
                    </div>
                  </div>

                  <div className={`absolute bottom-12 left-12 right-12 pointer-events-none transition-opacity duration-300 ${hoveredFilm === film.id ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="font-sans text-[0.6rem] uppercase tracking-[0.5em] text-amber-600 mb-3 block">{film.category}</span>
                    <h3 className="font-serif italic text-4xl text-white leading-tight">{film.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedFilm && activeFilm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full p-8 md:p-12 flex justify-between items-start z-[110]">
               <div className="flex flex-col gap-2">
                  <span className="font-sans text-[0.65rem] uppercase tracking-[0.5em] text-amber-600">{activeFilm.category}</span>
                  <span className="font-serif italic text-3xl md:text-5xl text-white">{activeFilm.title}</span>
               </div>
               <div className="flex items-center gap-10">
                  {!getInstagramEmbed(activeFilm.url) && (
                    <button onClick={() => setIsMuted(!isMuted)} className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group">
                      <span className="font-sans text-[0.6rem] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all">{isMuted ? 'Unmute' : 'Mute'}</span>
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  )}
                  <button onClick={() => setSelectedFilm(null)} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all group">
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                  </button>
               </div>
            </div>

            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[85vh] w-auto aspect-[9/16] shadow-[0_0_100px_rgba(217,119,6,0.1)] rounded-3xl overflow-hidden bg-black"
            >
import InstagramReel from '../components/InstagramReel';

// ... inside the component
              {getInstagramEmbed(activeFilm.url) ? (
                 <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-black">
                     {/* Pass the original URL; the component cleans it */}
                     <InstagramReel permalink={activeFilm.url} className="w-full h-full flex items-center justify-center pointer-events-auto" />
                 </div>
              ) : (
                  <video 
                    src={activeFilm.url} 
                    autoPlay 
                    muted={isMuted}
                    loop 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cinema;
