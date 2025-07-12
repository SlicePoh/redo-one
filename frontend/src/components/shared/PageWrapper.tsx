import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );}
  }, { dependencies: [location.pathname] });

  return <div ref={containerRef} className="p-4">{children}</div>;
};