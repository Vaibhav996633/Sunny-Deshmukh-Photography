
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
    <div ref={containerRef} className={className} style={style}>
        <blockquote 
            className="instagram-media" 
            data-instgrm-permalink={cleanLink}
            data-instgrm-version="14" 
            style={{ 
                background: '#FFF', 
                border: 0, 
                borderRadius: '3px', 
                boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', 
                margin: '1px', 
                maxWidth: '540px', 
                minWidth: '326px', 
                padding: 0, 
                width: '99.375%', 
                ...style 
            }}
        >
        </blockquote>
    </div>
  );
};

export default InstagramReel;
