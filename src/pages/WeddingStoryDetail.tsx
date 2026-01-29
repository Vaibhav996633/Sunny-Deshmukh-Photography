import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { STORIES } from '../data';
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import { ArrowLeft, Share2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const WeddingStoryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const story = STORIES.find(s => s.slug === slug);

  if (!story) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif italic text-4xl text-white mb-8">Story not found.</h2>
          <Link to="/" className="font-sans text-[0.7rem] uppercase tracking-[0.4em] text-amber-600">Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="bg-zinc-950">
      <div className="fixed top-24 left-6 md:left-12 z-40">
         <Link to="/gallery" className="flex items-center gap-3 font-sans text-[0.6rem] uppercase tracking-[0.4em] text-zinc-400 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" strokeWidth={1} />
            <span className="hidden md:inline">Back to Archive</span>
         </Link>
      </div>

      <Hero 
        image={story.heroImage}
        title={story.couple}
        subtitle={`${story.location} • ${story.date}`}
        showScroll={true}
      />

      <section className="py-24 md:py-32 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <SectionHeading 
          centered
          label="The Beginning"
          title="A Legacy Unfolds"
        />
        <p className="font-serif italic text-xl md:text-3xl text-zinc-300 leading-relaxed">
          {story.intro}
        </p>
      </section>

      {/* Editorial Grid - Pure Imagery (No text at bottom) */}
      <section className="pb-40 px-6 md:px-12 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
          {story.gallery.map((item, idx) => {
            // Create an editorial grid pattern
            const isWide = idx === 0 || idx === 3;
            const spanClass = isWide ? 'md:col-span-12' : 'md:col-span-6';
            const aspectClass = isWide ? 'aspect-[16/7] md:aspect-[21/9]' : 'aspect-[4/5]';
            
            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className={`${spanClass} overflow-hidden group rounded-lg`}
              >
                <div className={`${aspectClass} relative overflow-hidden`}>
                  <img 
                    src={item.url} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                </div>
                {/* Text titles removed for pure imagery focus */}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Share & Next */}
      <section className="py-32 border-t border-white/5 text-center">
        <button className="flex items-center gap-4 mx-auto font-sans text-[0.7rem] uppercase tracking-[0.4em] text-zinc-500 hover:text-amber-600 transition-colors mb-24">
          <Share2 size={16} />
          <span>Share this story</span>
        </button>

        <div className="space-y-8">
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.5em] text-zinc-600 block">Next Story</span>
          <Link to={`/story/${STORIES[story.id === 's1' ? 1 : 0].slug}`}>
            <h2 className="font-serif italic text-5xl md:text-8xl lg:text-[10rem] text-white hover:text-amber-600 transition-colors duration-700 leading-none">
              {STORIES[story.id === 's1' ? 1 : 0].couple}
            </h2>
          </Link>
        </div>
      </section>
    </PageTransition>
  );
};

export default WeddingStoryDetail;
