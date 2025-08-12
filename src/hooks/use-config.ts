'use client';

import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

type Config = {
  theme: string;
  font: string;
};

const configAtom = atomWithStorage<Config>('config', {
  theme: 'orange',
  font: 'poppins',
});

export function useConfig() {
  return useAtom(configAtom);
}
