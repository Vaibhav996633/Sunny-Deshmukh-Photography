
import React, { useEffect, useRef } from 'react';

interface InstagramReelProps {
  permalink: string;
  className?: string;
  style?: React.CSSProperties;
}

const InstagramReel: React.FC<InstagramReelProps> = ({ permalink, className, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the script is loaded and process embeds
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    } else {
        // If script isn't loaded yet (maybe navigating directly), ensure it's there?
        // Usually index.html handles it, but we can double check or just wait.
        // Doing nothing usually works if index.html has the script, as it will self-execute on load,
        // but if we mount LATER, we need to manually trigger.
        // Let's assume index.html loads it.
    }
  }, [permalink]); 
  
  // Re-process on mount/update usually requires waiting for global var. 
  useEffect(() => {
     if ((window as any).instgrm) {
         (window as any).instgrm.Embeds.process();
     }
     const interval = setInterval(() => {
         if ((window as any).instgrm) {
             (window as any).instgrm.Embeds.process();
             // Don't clear interval immediately, maybe wait for permalink change?? 
             // Actually, process() is idempotent.
         }
     }, 1000);
     return () => clearInterval(interval);
  }, [permalink]);

  // Clean URL: ensure it ends with /
  const cleanLink = permalink.split('?')[0].replace(/\/$/, '') + '/';

  return (
    <div 
      ref={containerRef} 
      className={`relative flex items-center justify-center overflow-hidden transition-all duration-700 ${className}`} 
      style={{
        ...style,
        background: 'transparent'
      }}
    >
        <blockquote 
            className="instagram-media" 
            data-instgrm-permalink={cleanLink}
            data-instgrm-version="14" 
            style={{ 
                background: '#000', 
                border: 0, 
                borderRadius: '12px', 
                boxShadow: 'none', 
                margin: 'auto', 
                maxWidth: '100%', 
                minWidth: '326px', 
                padding: 0, 
                width: '100%',
                visibility: 'visible'
            }}
        >
        </blockquote>
    </div>
  );
};

export default InstagramReel;
