import { useState } from 'react';
import useEventListener from '@use-it/event-listener';
export const useLocationHash = () => {
  const [hash, setHash] = useState<string | null>(null);
  useEventListener('hashchange', (e) => {
    // @ts-ignore
    setHash(e.target.location.hash);
  });
  return hash || window.location.hash;
};
