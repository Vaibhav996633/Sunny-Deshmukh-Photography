import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { GalleryFilter } from '../types';
import SectionHeading from '../components/SectionHeading';
import { Maximize2, Loader2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState<GalleryFilter>(GalleryFilter.ALL);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('type', 'image');
      
      if (!error) setAllImages(data || []);
      setLoading(false);
    };
    fetchImages();
  }, []);

  const filteredItems = filter === GalleryFilter.ALL 
    ? allImages 
    : allImages.filter(item => item.category === filter);

  const filters = Object.values(GalleryFilter);
  const activeItem = allImages.find(i => i.id === selectedId);

  return (
    <PageTransition className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <SectionHeading 
          label="The Stills Archive"
          title="Eternal Frames"
          description="A selection of our most poignant photographic captures. High-resolution moments that stop time."
        />

        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-12 border-b border-white/5 pb-6 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-sans text-[0.65rem] uppercase tracking-[0.3em] whitespace-nowrap transition-all duration-300 relative pb-3 ${filter === f ? 'text-amber-600' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {f}
              {filter === f && (
                <motion.div layoutId="filter-underline" className="absolute bottom-0 left-0 w-full h-[1px] bg-amber-600" />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4 text-zinc-600">
            <Loader2 className="animate-spin" size={20} />
            <span className="font-sans uppercase tracking-widest text-[0.6rem]">Developing Archive...</span>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6 relative group cursor-pointer"
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="overflow-hidden relative rounded-lg bg-zinc-900 border border-white/5 shadow-md">
                    <img 
                      src={item.url} 
                      alt={item.title || 'Wedding moment'} 
                      className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105 grayscale-[5%] group-hover:grayscale-0" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="text-white w-5 h-5" strokeWidth={1} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedId && activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-zinc-950/98 flex items-center justify-center p-6 md:p-12 backdrop-blur-xl"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center pointer-events-none"
            >
              <img src={activeItem.url} className="max-w-full max-h-full object-contain shadow-2xl rounded-sm" alt="Fullscreen preview" />
              <button className="absolute top-0 right-0 p-4 text-zinc-500 pointer-events-auto hover:text-white transition-colors">
                <span className="font-sans text-[0.6rem] uppercase tracking-[0.3em]">Close</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Gallery;
