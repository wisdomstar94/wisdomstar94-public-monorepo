'use client';

import { createStore, Provider } from 'jotai';
import { FC, ReactNode } from 'react';

const store = createStore();

export const RootLayoutClient: FC<{ children: ReactNode }> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
