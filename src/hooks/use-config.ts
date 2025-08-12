'use client';

import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

type Config = {
  font: string;
  accentColor: string;
};

const configAtom = atomWithStorage<Config>('config', {
  font: 'poppins',
  accentColor: '#f97316', // Default to a nice orange
});

export function useConfig() {
  return useAtom(configAtom);
}
