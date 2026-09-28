'use client';

import { useEffect, useState, useRef } from 'react';

export default function ArViewer() {
  const [isMounted, setIsMounted] = useState(false);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (!customElements.get('model-viewer')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      script.type = 'module';
      document.head.appendChild(script);
    }
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-screen bg-black" />;

  const handleViewInAR = () => {
    if (viewerRef.current && typeof viewerRef.current.activateAR === 'function') {
      try {
        viewerRef.current.activateAR();
      } catch (err) {
        alert("Unable to open AR camera on this device or connection.");
      }
    }
  };

  return (
    <div className="w-screen h-[100dvh] relative bg-black m-0 p-0 overflow-hidden">
      {/* @ts-ignore */}
      <model-viewer
        ref={viewerRef}
        src="/model.glb"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        tone-mapping="neutral"
        shadow-intensity="1"
        style={{ width: '100%', height: '100%', outline: 'none' }}
        auto-rotate
      >
        <div slot="ar-button" style={{ display: 'none' }}></div>
      {/* @ts-ignore */}
      </model-viewer>

      <button 
        onClick={handleViewInAR}
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
