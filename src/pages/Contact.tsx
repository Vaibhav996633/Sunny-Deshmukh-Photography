import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import SectionHeading from '../components/SectionHeading';
import { Send, Instagram, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', date: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('inquiries').insert([{
      name: formState.name,
      email: formState.email,
      event_date: formState.date,
      message: formState.message
    }]);

    setLoading(false);
    if (!error) {
      setSubmitted(true);
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <PageTransition className="pt-32 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          {/* Info Side */}
          <div className="flex flex-col justify-center">
            <SectionHeading 
              label="Inquiry"
              title="Start Your Story"
              description="We take on a limited number of weddings each year to ensure intentional focus."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 mt-10">
              {[
                { icon: Mail, label: "Email", value: "hello@sunnydeshmukh.com" },
                { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                { icon: Instagram, label: "Instagram", value: "@sunnydeshmukh.films" },
                { icon: MapPin, label: "Studio", value: "Bandra West, Mumbai" },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 items-center group">
                  <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-amber-600 transition-colors">
                    <item.icon size={16} strokeWidth={1} className="text-zinc-600 group-hover:text-amber-600 transition-colors" />
                  </div>
                  <div>
                    <span className="block font-sans text-[0.5rem] uppercase tracking-[0.3em] text-zinc-600 mb-0.5">{item.label}</span>
                    <span className="font-sans text-[0.8rem] text-zinc-300 tracking-wider">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side - Compact */}
          <div className="bg-zinc-900/30 p-8 md:p-12 rounded-3xl border border-white/5 relative shadow-xl overflow-hidden">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <Send className="text-amber-600 mx-auto mb-6" size={24} />
                <h3 className="font-serif italic text-3xl text-white mb-3">Message Sent</h3>
                <p className="font-sans text-zinc-500 text-[0.6rem] tracking-[0.3em] uppercase">We will reach out shortly.</p>
                <button onClick={() => setSubmitted(false)} className="mt-8 font-sans text-[0.55rem] uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-all">Back</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input required type="text" placeholder="Name" className="w-full bg-transparent border-b border-white/10 py-3 font-sans text-xs tracking-[0.2em] text-white focus:outline-none focus:border-amber-600 transition-colors placeholder:text-zinc-700" onChange={(e) => setFormState({ ...formState, name: e.target.value })} />
                <input required type="email" placeholder="Email" className="w-full bg-transparent border-b border-white/10 py-3 font-sans text-xs tracking-[0.2em] text-white focus:outline-none focus:border-amber-600 transition-colors placeholder:text-zinc-700" onChange={(e) => setFormState({ ...formState, email: e.target.value })} />
                <input required type="text" placeholder="Event Date" className="w-full bg-transparent border-b border-white/10 py-3 font-sans text-xs tracking-[0.2em] text-white focus:outline-none focus:border-amber-600 transition-colors placeholder:text-zinc-700" onChange={(e) => setFormState({ ...formState, date: e.target.value })} />
                <textarea required rows={3} placeholder="Your Story..." className="w-full bg-transparent border-b border-white/10 py-3 font-sans text-xs tracking-[0.2em] text-white focus:outline-none focus:border-amber-600 transition-colors resize-none placeholder:text-zinc-700" onChange={(e) => setFormState({ ...formState, message: e.target.value })} />
                <button disabled={loading} type="submit" className="w-full group flex items-center justify-center gap-4 bg-white py-4 rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50">
                  <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] font-bold text-zinc-950 group-hover:text-white transition-all">{loading ? 'Processing...' : 'Submit'}</span>
                  {!loading && <ArrowRight size={14} className="text-zinc-950 group-hover:text-white transition-all transform group-hover:translate-x-1" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;