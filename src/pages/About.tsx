import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import { Settings } from 'lucide-react';
import vaibhav from '../assets/vaibhav.jpeg';
import PageTransition from '../components/PageTransition';

const About: React.FC = () => {
  return (
    <PageTransition className="pt-32 pb-24">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="lg:col-span-5 relative aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <img 
              src={vaibhav}
              alt="Sunny Deshmukh"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2000ms]"
            />
          </motion.div>

          <div className="lg:col-span-7 space-y-8">
            <SectionHeading 
              label="The Artist"
              title="Sunny Deshmukh"
              description="Over a decade of documenting love stories with a cinematic eye."
            />
            <div className="space-y-6 font-sans text-zinc-400 text-base md:text-lg leading-relaxed font-light opacity-90">
              <p>
                My journey began with a simple film camera. Today, that fascination has evolved into a global studio dedicated to high-end wedding documentation.
              </p>
              <p>
                I believe that your wedding day is a tapestry of unrepeatable moments. My goal is to capture the 'quiet' between the 'loud' – the subtle exchange of looks that define a relationship.
              </p>
            </div>

            <div className="flex flex-wrap gap-16 pt-10 border-t border-white/5">
              <div>
                <span className="block font-serif italic text-3xl text-amber-600 mb-1">10+</span>
                <span className="font-sans text-[0.55rem] uppercase tracking-[0.3em] text-zinc-500">Years of Craft</span>
              </div>
              <div>
                <span className="block font-serif italic text-3xl text-amber-600 mb-1">250+</span>
                <span className="font-sans text-[0.55rem] uppercase tracking-[0.3em] text-zinc-500">Stories Told</span>
              </div>
              <div className="ml-auto flex items-end pb-2">
                <Link to="/admin" className="flex items-center gap-2 font-sans text-[0.5rem] uppercase tracking-[0.4em] text-zinc-700 hover:text-amber-600 transition-colors group">
                   <Settings size={12} className="group-hover:rotate-90 transition-transform duration-500" />
                   <span>Admin Access</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <section className="py-16 md:py-20 bg-zinc-900/40 rounded-3xl border border-white/5 px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {[
              { title: "Observational", text: "We blend into the background to capture genuine, unforced emotions." },
              { title: "Cinematic", text: "Every frame is composed like a scene from a high-end film." },
              { title: "Editorial", text: "We treat your portraits with the care of a high-fashion magazine." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <h4 className="font-serif italic text-xl text-white mb-3">{item.title}</h4>
                <p className="font-sans text-zinc-500 text-xs md:text-sm leading-relaxed tracking-wide">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default About;