import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import SectionHeading from '../components/SectionHeading';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('is_popular', { ascending: false });
      
      if (!error) setPackages(data || []);
      setLoading(false);
    };
    fetchPackages();
  }, []);

  return (
    <PageTransition className="pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <SectionHeading 
          label="The Collections"
          title="Crafted for Your Story"
          description="Curated collections designed to capture the magic of your special day."
        />

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4 text-zinc-600">
            <Loader2 className="animate-spin" size={20} />
            <span className="font-sans uppercase tracking-widest text-[0.6rem]">Loading Collections...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {packages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`relative p-8 flex flex-col border transition-all duration-500 hover:shadow-xl group rounded-2xl ${pkg.is_popular ? 'bg-zinc-900/60 border-amber-600/30' : 'bg-zinc-950 border-white/5'}`}
              >
                {pkg.is_popular && (
                  <div className="absolute top-0 right-8 -translate-y-1/2 bg-amber-600 text-white font-sans text-[0.55rem] uppercase tracking-[0.3em] px-3 py-1 rounded-full">Recommended</div>
                )}

                <div className="mb-8">
                  <h3 className="font-serif italic text-3xl mb-1 text-white">{pkg.name}</h3>
                  <span className="font-sans text-[0.55rem] uppercase tracking-[0.3em] text-zinc-500 block mb-4">{pkg.duration}</span>
                  <div className="w-8 h-[1px] bg-amber-600/50 group-hover:w-full transition-all duration-700" />
                </div>

                <div className="flex-grow space-y-8 mb-10">
                  <div>
                    <h4 className="font-sans text-[0.5rem] uppercase tracking-[0.3em] text-zinc-300 mb-4 font-semibold">Includes</h4>
                    <ul className="space-y-3">
                      {pkg.deliverables.map((item: string, i: number) => (
                        <li key={i} className="flex gap-3 items-start text-[0.8rem] text-zinc-500">
                          <Check size={12} className="mt-0.5 text-amber-600 shrink-0" strokeWidth={3} />
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-sans text-[0.5rem] uppercase tracking-[0.3em] text-zinc-300 mb-4 font-semibold">Highlights</h4>
                    <ul className="space-y-3">
                      {pkg.highlights.map((item: string, i: number) => (
                        <li key={i} className="flex gap-3 items-start text-[0.8rem] text-zinc-400 italic opacity-80">
                          <span className="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0" />
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link to="/contact" className={`flex items-center justify-between p-4 rounded-xl border font-sans text-[0.6rem] uppercase tracking-[0.3em] font-bold transition-all duration-500 ${pkg.is_popular ? 'bg-amber-600 border-amber-600 text-white hover:bg-white hover:text-zinc-900' : 'border-white/10 hover:border-amber-600/50 text-white'}`}>
                  <span>Request Quote</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-20 text-center border-t border-white/5 pt-12">
          <Link to="/contact" className="font-sans text-[0.6rem] uppercase tracking-[0.3em] text-zinc-500 hover:text-amber-600 transition-colors">Contact for Custom Legacy Packages</Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default Packages;
