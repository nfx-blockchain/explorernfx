import { useEffect } from 'react';

const BASE = 'NFXScan Explorer';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : BASE;
    return () => { document.title = BASE; };
  }, [title]);
}
