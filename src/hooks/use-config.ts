
'use client';

import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

type Config = {
  font: string;
  accentColor: string;
  borderWidth: number;
};

const configAtom = atomWithStorage<Config>('config', {
  font: 'poppins',
  accentColor: '#f97316', // Default to a nice orange
  borderWidth: 1,
});

export function useConfig() {
  return useAtom(configAtom);
}
