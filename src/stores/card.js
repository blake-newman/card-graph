import { createPinia, defineStore } from "pinia";
import { useCardGraphStore } from "./card-graph";

export const useCardStore = (card) => {
  switch (card.type) {
    case 'ref':
      return useCardRefStore(card)()
    case 'double':
      return useCardDoubleStore(card)()
    case 'result':
    default:
      return useCardResultStore(card)()
  }
};

const useCardResultStore = (card) => {
  return defineStore({
    id: `card-result-${card.id}`,
    getters: {
      result() {
        return card.result
      },
    },
  });
};

const useCardRefStore = (card) => {
  return defineStore({
    id: `card-ref-${card.id}`,
    getters: {

      result() {
        const { result } = useCardGraphStore().cardIdToCard[card.ref] ?? {};
        return card.result.map((num, index) =>  (num * 2) + (result?.[index] ?? 0));
      },
    },
  });
};

const useCardDoubleStore = (card) => {
  return defineStore({
    id: `card-double-${card.id}`,
    getters: {
      result() {
        return card.result.map((num) => num * 2)
      },
    },
  });
};
