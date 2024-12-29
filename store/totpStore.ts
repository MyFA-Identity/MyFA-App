import { create } from 'zustand';

interface TotpConfig {
  timeStep: number;
  digits: number;
  algorithm: 'sha256';
}

interface TotpState {
  config: TotpConfig;
  setConfig: (config: Partial<TotpConfig>) => void;
}

export const useTotpStore = create<TotpState>((set) => ({
  config: {
    timeStep: 3600,
    digits: 6,
    algorithm: 'sha256',
  },
  setConfig: (newConfig) => set((state) => ({
    config: { ...state.config, ...newConfig }
  })),
}));
