'use client';

import { useEffect, useRef } from 'react';
import { createArStudio } from '3d-ar-studio';

export default function InBrowserViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (studioRef.current) return;

    const init = async () => {
      try {
        studioRef.current = createArStudio(containerRef.current, {
          assets: [{ src: '/model.glb', title: 'Product' }],
          generate: { enabled: false }, // All extra UI disabled
          rooms: { enabled: false },    
          branding: { title: '', accent: '#ffffff' },
          persist: false,
        });

        await studioRef.current.addModel({ 
          src: '/model.glb', 
          title: 'Product' 
        });
      } catch (error) {
        console.error("Failed to load studio:", error);
      }
    };

    init();

    return () => {
      if (studioRef.current && typeof studioRef.current.clear === 'function') {
        studioRef.current.clear();
      }
    };
  }, []);

  const handleARClick = () => {
    if (!containerRef.current) return;
    
    const xrBtn = containerRef.current.querySelector('.ars-top .ars-icon-btn[aria-label="View this in augmented reality"]') as HTMLButtonElement;
    const cameraBtn = containerRef.current.querySelector('.ars-top .ars-icon-btn[aria-label="Turn the camera on to see your models in the room"]') as HTMLButtonElement;
    const arGoBtn = containerRef.current.querySelector('.ars-ar-go') as HTMLButtonElement;
    
    if (xrBtn && !xrBtn.hidden) {
      xrBtn.click();
    } else if (arGoBtn && !arGoBtn.hidden) {
      arGoBtn.click();
    } else if (cameraBtn) {
      cameraBtn.click();
    }
  };

  return (
    <div className="w-screen h-[100dvh] relative bg-black m-0 p-0 overflow-hidden">
      
      {/* Hide all useless UI from the in-browser viewer */}
      <style>{`
        .ars-top, .ars-dock, .ars-empty, .ars-selbar, .ars-status, .ars-chip, .ars-tray {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
        .ars-hud {
          pointer-events: none !important; 
        }
        .ars-modal, .ars-dialog {
          pointer-events: auto !important;
          background: rgba(0,0,0,0.8) !important;
        }
      `}</style>

      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* UNCONDITIONAL "View in AR" BUTTON - NEVER HIDES */}
      <button 
        onClick={handleARClick}
        style={{ 
          position: 'fixed', 
          bottom: '100px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 999999, 
          display: 'flex' 
        }}
        className="bg-white text-black font-black py-5 px-12 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.8)] items-center justify-center gap-3 text-2xl whitespace-nowrap cursor-pointer pointer-events-auto active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h6v6H3z"/>
          <path d="M15 3h6v6h-6z"/>
          <path d="M15 15h6v6h-6z"/>
          <path d="M3 15h6v6H3z"/>
        </svg>
        View in AR
      </button>
    </div>
  );
}
