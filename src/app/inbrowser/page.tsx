'use client';

import { useEffect, useRef } from 'react';
import { createArStudio } from '3d-ar-studio';

export default function InBrowserPage() {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    // We mount directly to document.body. This bypasses React's virtual DOM
    // entirely, running at maximum native performance like you remember.
    const studio = createArStudio(document.body, {
      // @ts-ignore
      assets: [{ src: '/model.glb', title: 'Product' }],
      // @ts-ignore
      generate: { enabled: false },
      // @ts-ignore
      rooms: { enabled: false },
      // @ts-ignore
      branding: { title: '', accent: '#ffffff' },
      persist: false,
    });

    studio.addModel({ src: '/model.glb', title: 'Product' });

    return () => {
      studio.clear();
      const root = document.querySelector('.ars-root');
      if (root) root.remove();
    };
  }, []);

  return (
    <>
      <style>{`
        /* Strip the UI you hate */
        .ars-dock, .ars-empty, .ars-selbar, .ars-tray, .ars-title, .ars-back, .ars-count, .ars-room-label, .ars-spacer {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }

        .ars-top {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          pointer-events: none !important;
        }

        /* Hide all other buttons in the top bar */
        .ars-top [aria-label="View this in augmented reality"],
        .ars-top [aria-label="Show a QR code that opens this scene on your phone"],
        .ars-top [aria-label="Open a shared room so other people can build in this scene with you"] {
          display: none !important;
        }

        /* 
         * The secret sauce: you LOVED the "Turn on the camera" button feature because 
         * it runs incredibly smooth and true in-browser without kicking to WebXR or iOS Quick Look.
         * We isolate this specific native button, rip it out, and make it huge. 
         */
        .ars-top [aria-label="Turn the camera on to see your models in the room"] {
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

        /* Disguise the camera button as the AR button */
        .ars-top [aria-label="Turn the camera on to see your models in the room"] > span:not([aria-hidden="true"]) {
          font-size: 0 !important; 
        }
        .ars-top [aria-label="Turn the camera on to see your models in the room"]::after {
          content: "View in AR" !important;
          font-size: 24px !important;
        }
        
        .ars-icon-btn > span[aria-hidden="true"] {
          font-size: 28px !important;
        }
      `}</style>
    </>
  );
}
