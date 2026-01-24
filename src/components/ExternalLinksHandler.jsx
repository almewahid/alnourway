import { useEffect } from 'react';

/**
 * External Links Handler Component
 * Handles external links for WebView compatibility
 * Opens external links in the default browser instead of WebView
 * Required for Apple App Store and Google Play compliance
 */

const isExternalLink = (url) => {
  if (!url) return false;
  
  try {
    // Handle relative URLs
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
      return false;
    }
    
    // Handle mailto, tel, etc.
    if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('sms:')) {
      return false;
    }
    
    const currentHost = window.location.host;
    const linkUrl = new URL(url, window.location.origin);
    
    return linkUrl.host !== currentHost;
  } catch (e) {
    // If URL parsing fails, treat as internal
    return false;
  }
};

const handleExternalLink = (url, event = null) => {
  if (event) {
    event.preventDefault();
  }
  
  if (isExternalLink(url)) {
    // Open in default browser (Safari/Chrome) instead of WebView
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    // Internal link - let it work normally
    window.location.href = url;
  }
};

export default function ExternalLinksHandler() {
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      if (!href) return;
      
      if (isExternalLink(href)) {
        e.preventDefault();
        handleExternalLink(href);
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  
  return null;
}