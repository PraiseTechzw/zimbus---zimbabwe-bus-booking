import React, { useEffect } from 'react';

interface ScrollToTopProps {
  view: string;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ view }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [view]);

  return null;
};
