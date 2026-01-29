import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import SectionHeading from '../components/SectionHeading';
import { Play, X, Volume2, VolumeX, Loader2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Cinema: React.FC = () => {
  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState<string | null>(null);
  const [hoveredFilm, setHoveredFilm] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'uploaded' | 'reels'>('uploaded');

  useEffect(() => {
    const fetchFilms = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('gallery')
        .select('*')
        .eq('type', 'video');

      setFilms(data || []);
      setLoading(false);
    };

    fetchFilms();
  }, []);

  const activeFilm = films.find(f => f.id === selectedFilm);

  const getCleanReelEmbed = (url: string) => {
    if (!url) return null;
    const match = url.match(/instagram\.com\/(?:reel|p)\/([^/?#&]+)/);
    if (!match) return null;
    return `https://www.instagram.com/reel/${match[1]}/embed/?autoplay=1&muted=1&controls=0&captioned=0`;
  };

  const uploadedFilms = films.filter(f => !f.url.includes('instagram.com'));
  const reels = films.filter(f => f.url.includes('instagram.com'));

  return (
    <PageTransition className="pt-40 pb-32 min-h-screen bg-zinc-950">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <SectionHeading
          label="The Motion Archive"
          title="Cinematic Narrative"
          description="High-end wedding films captured with intentional movement and emotional resonance."
        />

        {/* 🎛️ TAB TOGGLE */}
        <div className="flex justify-center mb-20">
          <div className="bg-zinc-900/50 p-1.5 rounded-full border border-white/5 backdrop-blur-md flex gap-2">
            {[
              { id: 'uploaded', label: 'Uploaded Videos', count: uploadedFilms.length },
              { id: 'reels', label: 'Social Reels', count: reels.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveType(tab.id as any)}
                className={`flex items-center gap-3 px-8 py-3 rounded-full font-sans text-[0.6rem] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${activeType === tab.id ? 'bg-amber-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <span>{tab.label}</span>
                <span className={`text-[0.5rem] opacity-40 ${activeType === tab.id ? 'text-white' : ''}`}>({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4 text-zinc-600">
            <Loader2 className="animate-spin" size={20} />
            <span className="uppercase tracking-widest text-[0.6rem]">Opening Reels...</span>
          </div>
        ) : (
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeType === 'uploaded' ? (
                <motion.div
                  key="uploaded-grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-10"
                >
                  {uploadedFilms.length > 0 ? uploadedFilms.map((film, idx) => (
                    <motion.div
                      key={film.id}
                      className="group relative aspect-video rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer shadow-2xl"
                      onClick={() => setSelectedFilm(film.id)}
                    >
                       <img
                         src={film.thumbnail_url || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070'}
                         className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s]"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                       
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-xl bg-white/5 text-white">
                             <Play size={40} fill="white" className="ml-1" />
                          </div>
                       </div>

                       <div className="absolute bottom-12 left-12 right-12">
                          <div className="flex items-center gap-3 mb-3">
                             <div className="w-8 h-[1px] bg-amber-600" />
                             <span className="uppercase text-[0.55rem] tracking-[0.4em] text-amber-600 font-bold">{film.category}</span>
                          </div>
                          <h3 className="text-4xl italic text-white group-hover:translate-x-3 transition-transform duration-700">{film.title}</h3>
                       </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-full py-32 text-center text-zinc-600 font-sans text-xs uppercase tracking-widest">No uploaded films found</div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="reels-grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                  {reels.length > 0 ? reels.map((film, idx) => {
                    const reelEmbed = getCleanReelEmbed(film.url);

                    return (
                      <motion.div
                        key={film.id}
                        className="group cursor-pointer"
                        onClick={() => setSelectedFilm(film.id)}
                        onMouseEnter={() => setHoveredFilm(film.id)}
                        onMouseLeave={() => setHoveredFilm(null)}
                      >
                        <div className="relative aspect-[9/16] rounded-[2rem] overflow-hidden bg-black border border-white/5 shadow-xl">
                          {hoveredFilm === film.id && reelEmbed ? (
                            <iframe
                              src={reelEmbed}
                              className="absolute inset-0 w-full h-full scale-[1.05]"
                              frameBorder="0"
                              allow="autoplay; encrypted-media"
                            />
                          ) : (
                            <img
                              src={film.thumbnail_url}
                              alt={film.title}
                              className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                            />
                          )}

                          <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition" />
                          
                          <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${hoveredFilm === film.id ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur bg-white/5">
                              <Play size={22} fill="white" className="ml-1" />
                            </div>
                          </div>

                          <div className="absolute bottom-8 left-8 right-8">
                            <span className="uppercase text-[0.5rem] tracking-[0.4em] text-amber-500 font-bold">{film.category}</span>
                            <h3 className="text-xl italic text-white mt-2">{film.title}</h3>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }) : (
                    <div className="col-span-full py-32 text-center text-zinc-600 font-sans text-xs uppercase tracking-widest">No social reels found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 🎬 MODAL */}
      <AnimatePresence>
        {activeFilm && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setSelectedFilm(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all z-[110]"
            >
              <X />
            </button>

            <div className={`relative ${activeFilm.url.includes('instagram.com') ? 'aspect-[9/16] max-w-[420px]' : 'aspect-video max-w-5xl'} w-full rounded-3xl overflow-hidden bg-black shadow-[0_0_100px_rgba(255,191,0,0.1)]`}>
              {getCleanReelEmbed(activeFilm.url) ? (
                <iframe
                  src={getCleanReelEmbed(activeFilm.url)!}
                  className="absolute inset-0 w-full h-full scale-[1.02]"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                />
              ) : (
                <div className="w-full h-full relative group/player">
                    <video
                      src={activeFilm.url}
                      autoPlay
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Cinema;
