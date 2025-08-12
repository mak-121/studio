'use client';

import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

type Config = {
  theme: string;
  font: string;
};

const configAtom = atomWithStorage<Config>('config', {
  theme: 'blue',
  font: 'inter',
});

export function useConfig() {
  return useAtom(configAtom);
}
