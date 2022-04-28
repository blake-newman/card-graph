import { defineStore } from "pinia";

export const useCardGraphStore = defineStore({
  id: "card-graph",
  state: () => ({
    cardIdToCard: {
      abc: { id: 'abc', title: "What is something", result: [1, 2, 3], type: 'result' },
      def: { id: 'def', title: "Where is something", result: [7, 3, 5], type: 'double' },
      ghi: { id: 'ghi', title: "How is something", result: [2, 4, 9], ref: 'abc', type: 'ref' },
      jkl: { id: 'jkl', title: "Why is something", result: [4, 2, 2], type: 'result' },
    },
  }),
});
