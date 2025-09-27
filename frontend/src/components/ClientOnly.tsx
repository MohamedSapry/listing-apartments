'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  suppressHydrationWarning?: boolean;
}

export default function ClientOnly({ 
  children, 
  fallback = null, 
  suppressHydrationWarning = false 
}: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    
    // Clean up any browser extension attributes that cause hydration issues
    const cleanupExtensionAttributes = () => {
      const body = document.body;
      const html = document.documentElement;
      
      // Remove common extension attributes that cause hydration warnings
      const attributesToClean = [
        'data-lt-installed',
        'data-grammarly-desktop-integration',
        'data-gr-c-s-loaded',
        'spellcheck',
        'suppresshydrationwarning'
      ];
      
      attributesToClean.forEach(attr => {
        // Clean from both HTML and body elements
        if (html.hasAttribute(attr)) {
          html.removeAttribute(attr);
        }
        if (body.hasAttribute(attr)) {
          body.removeAttribute(attr);
        }
      });
    };

    // Run cleanup after component mounts
    cleanupExtensionAttributes();
    
    // Also run cleanup on DOM mutations (when extensions modify the DOM)
    const observer = new MutationObserver(cleanupExtensionAttributes);
    
    // Observe both HTML and body elements for attribute changes
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['data-lt-installed', 'data-grammarly-desktop-integration', 'suppresshydrationwarning'] 
    });
    
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['data-lt-installed', 'data-grammarly-desktop-integration'] 
    });

    return () => observer.disconnect();
  }, []);

  if (!hasMounted) {
    return <div suppressHydrationWarning={suppressHydrationWarning}>{fallback}</div>;
  }

  return <div suppressHydrationWarning={suppressHydrationWarning}>{children}</div>;
}
