import { useEffect, useState } from 'react';

export const useColumnView = (w = 1100) => {
  const [isColumnView, setIsColumnView] = useState(window.innerWidth < w);

  const listener = () => {
    const width = window.innerWidth;
    if (width < w) {
      setIsColumnView(true);
    } else {
      setIsColumnView(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  });

  return isColumnView;
};
