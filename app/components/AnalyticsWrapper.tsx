'use client';

import React, { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function AnalyticsWrapper() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check initial consent from localStorage
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'accepted') {
      setHasConsent(true);
    }

    // Listen for real-time updates when user clicks "Aceitar"
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ consent: 'accepted' | 'rejected' }>;
      if (customEvent.detail?.consent === 'accepted') {
        setHasConsent(true);
      } else {
        setHasConsent(false);
      }
    };

    window.addEventListener('cookie_consent_updated', handleConsentChange);
    return () => {
      window.removeEventListener('cookie_consent_updated', handleConsentChange);
    };
  }, []);

  if (!hasConsent) return null;

  return <GoogleAnalytics gaId="G-DX7TY7X0QX" />;
}
