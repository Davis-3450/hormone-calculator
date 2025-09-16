import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type Hormone,
  type Unit,
  UnitName,
  HormoneName,
  Gender,
} from "@/lib/logic/units";
import {
  DATA,
  validateWithReferenceRange,
  HormoneRangeStatus,
} from "@/lib/logic/values";

type HormoneMap = Record<HormoneName, Hormone>;
type StatusMap = Record<HormoneName, HormoneRangeStatus>;

const unit = (name: UnitName): Unit => ({ name });

const defaultHormones = (): HormoneMap => ({
  [HormoneName.Testosterone]: {
    id: HormoneName.Testosterone,
    value: { value: 0, unit: unit(UnitName.nmol_L) },
  },
  [HormoneName.Estradiol]: {
    id: HormoneName.Estradiol,
    value: { value: 0, unit: unit(UnitName.pmol_L) },
  },
  [HormoneName.Prolactin]: {
    id: HormoneName.Prolactin,
    value: { value: 0, unit: unit(UnitName.ng_mL) },
  },
  [HormoneName.Progesterone]: {
    id: HormoneName.Progesterone,
    value: { value: 0, unit: unit(UnitName.nmol_L) },
  },
});

function withRanges(hormones: HormoneMap, gender: Gender): HormoneMap {
  const ranges = DATA[gender].hormones;
  return Object.fromEntries(
    (Object.keys(hormones) as HormoneName[]).map((id) => [
      id,
      { ...hormones[id], referenceRange: ranges[id].normalRange },
    ])
  ) as HormoneMap;
}

const INITIAL_GENDER = Gender.Female;

const createInitialState = (
  gender: Gender = INITIAL_GENDER,
  hormones: HormoneMap = defaultHormones()
) => ({
  gender,
  hormones,
  statuses: computeStatuses(hormones, gender),
});

function computeStatuses(hormones: HormoneMap, gender: Gender): StatusMap {
  const withRR = withRanges(hormones, gender);
  const entries = (Object.keys(withRR) as HormoneName[]).map((id) => {
    const status = validateWithReferenceRange(withRR[id]);
    return [id, status] as const;
  });
  return Object.fromEntries(entries) as StatusMap;
}

export interface HormonesStoreState {
  gender: Gender;
  hormones: HormoneMap;
  statuses: StatusMap;

  setGender: (gender: Gender) => void;
  setHormoneValue: (id: HormoneName, value: number) => void;
  setHormoneUnit: (id: HormoneName, unit: UnitName) => void;
  setHormone: (id: HormoneName, value: number, unit: UnitName) => void;
  reset: () => void;

  // helpers/selectors
  getStatus: (id: HormoneName) => HormoneRangeStatus;
  getHormoneWithRange: (id: HormoneName) => Hormone;
}

export const useHormonesStore = create<HormonesStoreState>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      setGender: (gender) =>
        set((state) => ({
          gender,
          statuses: computeStatuses(state.hormones, gender),
        })),

      setHormoneValue: (id, value) =>
        set((state) => {
          const hormones: HormoneMap = {
            ...state.hormones,
            [id]: {
              ...state.hormones[id],
              value: { ...state.hormones[id].value, value },
            },
          };
          return {
            hormones,
            statuses: computeStatuses(hormones, state.gender),
          };
        }),

      setHormoneUnit: (id, unitName) =>
        set((state) => {
          const hormones: HormoneMap = {
            ...state.hormones,
            [id]: {
              ...state.hormones[id],
              value: { ...state.hormones[id].value, unit: unit(unitName) },
            },
          };
          return {
            hormones,
            statuses: computeStatuses(hormones, state.gender),
          };
        }),

      setHormone: (id, value, unitName) =>
        set((state) => {
          const hormones: HormoneMap = {
            ...state.hormones,
            [id]: {
              ...state.hormones[id],
              value: { value, unit: unit(unitName) },
            },
          };
          return {
            hormones,
            statuses: computeStatuses(hormones, state.gender),
          };
        }),

      reset: () => set(() => createInitialState()),

      getStatus: (id) => get().statuses[id],
      getHormoneWithRange: (id) => {
        const { hormones, gender } = get();
        const rr = DATA[gender].hormones[id].normalRange;
        return { ...hormones[id], referenceRange: rr };
      },
    }),
    {
      name: "hormones-store",
      storage:
        typeof window === "undefined"
          ? undefined
          : createJSONStorage(() => localStorage),
      partialize: (state) => ({
        gender: state.gender,
        hormones: state.hormones,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const next = createInitialState(state.gender, state.hormones);
        state.gender = next.gender;
        state.hormones = next.hormones;
        state.statuses = next.statuses;
      },
    }
  )
);

export default useHormonesStore;
