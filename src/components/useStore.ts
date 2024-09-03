import { create } from 'zustand';

interface StoreState {
  series: { x: number; y: number[] }[];
  setSeries: (newSeries: { x: number; y: number[] }[] | ((prevSeries: { x: number; y: number[] }[]) => { x: number; y: number[] }[])) => void;
}

export const useStore = create<StoreState>((set) => ({
  series: [
    {
        x: new Date().getTime(),
        y: [6629.81, 6650.5, 6623.04, 6633.33]
      },
      {
        x: new Date().getTime() + 10000,
        y: [6632.01, 6643.59, 6620, 6630.11]
      },
      {
        x: new Date().getTime() + 20000,
        y: [6630.71, 6648.95, 6623.34, 6635.65]
      },
      {
        x: new Date().getTime() + 30000,
        y: [6635.65, 6651, 6629.67, 6638.24]
      },
      {
        x: new Date().getTime() + 40000,
        y: [6638.24, 6640, 6620, 6624.47]
      }
  ],
  setSeries: (newSeries) => set((state) => ({
    series: typeof newSeries === 'function' ? newSeries(state.series) : newSeries
  }))
}));
