import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  centered?: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ label, title, description, centered = false }) => {
  return (
    <div className={`mb-6 md:mb-8 ${centered ? 'text-center max-w-xl mx-auto' : ''}`}>
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-sans text-[0.5rem] uppercase tracking-[0.5em] text-amber-600 mb-2 block"
      >
        {label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-serif italic text-2xl md:text-4xl text-zinc-100 leading-tight mb-3"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-zinc-500 text-[0.75rem] md:text-sm leading-relaxed max-w-md font-light opacity-80"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;