'use client';

import { createContext, useContext } from 'react';

type LayoutShellContextValue = {
  renderInLayout: boolean;
};

export const LayoutShellContext = createContext<LayoutShellContextValue>({
  renderInLayout: false,
});

export function useLayoutShell() {
  return useContext(LayoutShellContext);
}
