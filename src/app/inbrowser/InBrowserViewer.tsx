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
        // HACK: Trick the engine into thinking this is an extremely low-end device
        // This forces the 'mobile' rendering tier (pixelRatio 1, no shadows, no HDRI)
        // which instantly fixes the "laggy and unresponsive" frame drops on heavy models.
        if (typeof navigator !== 'undefined') {
          Object.defineProperty(navigator, 'deviceMemory', { get: () => 2, configurable: true });
          Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 2, configurable: true });
        }

        studioRef.current = createArStudio(containerRef.current!, {
          // @ts-ignore
          assets: [{ src: '/model.glb', title: 'Product' }],
          // @ts-ignore
          generate: { enabled: false }, // All extra UI disabled
          // @ts-ignore
          rooms: { enabled: false },    
          // @ts-ignore
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

  return (
    <div className="w-screen h-[100dvh] relative bg-black m-0 p-0 overflow-hidden">
      
      {/* 
        We rely on 3D-AR-Studio for its flawless iOS USDZ conversion and Android AR.
        Because Safari strictly blocks AR triggered by custom JS click handlers, 
        we must physically use the library's native buttons.
        We ruthlessly override its CSS to hide all the "useless" UI, and we pull 
        its native AR buttons out of the hidden top bar, styling them to be the 
        massive "View in AR" buttons you requested. 
        This guarantees 100% native Safari click-trust while keeping the UI minimal.
      */}
      <style>{`
        /* Hide everything we don't want */
        .ars-dock, .ars-empty, .ars-selbar, .ars-tray, .ars-title, .ars-back, .ars-count, .ars-room-label, .ars-spacer {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }

        /* Hide the camera button and room button specifically */
        .ars-top [aria-label="Turn the camera on to see your models in the room"],
        .ars-top [aria-label="Open a shared room so other people can build in this scene with you"] {
          display: none !important;
        }

        /* Strip backgrounds from the top bar so it's invisible */
        .ars-top {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          height: 100% !important;
          width: 100% !important;
          pointer-events: none !important;
        }

        /* 
         * TRANSFORM THE NATIVE AR BUTTONS INTO THE HUGE BOTTOM BUTTON
         * This applies to both the mobile AR button and the desktop QR button
         */
        .ars-top [aria-label="View this in augmented reality"],
        .ars-top [aria-label="Show a QR code that opens this scene on your phone"] {
          position: fixed !important;
          bottom: 100px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          display: flex !important;
          background-color: white !important;
          color: black !important;
          padding: 20px 40px !important;
          border-radius: 9999px !important;
          font-weight: 900 !important;
          z-index: 999999 !important;
          box-shadow: 0 0 50px rgba(255,255,255,0.8) !important;
          width: max-content !important;
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 12px !important;
        }

        /* Change the text of the button cleanly using CSS */
        .ars-ar-label {
          font-size: 0 !important; /* Hide the old 'AR' text */
        }
        .ars-ar-label::after {
          content: "View in AR" !important;
          font-size: 24px !important;
        }

        /* Style the icon */
        .ars-icon-btn > span[aria-hidden="true"] {
          font-size: 28px !important;
        }

        /* Ensure modals (like the AR handoff sheet or QR code) are visible and clickable */
        .ars-modal, .ars-dialog {
          pointer-events: auto !important;
          background: rgba(0,0,0,0.8) !important;
        }
      `}</style>

      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
