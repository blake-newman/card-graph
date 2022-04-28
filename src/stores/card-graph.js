import { defineStore } from "pinia";

const shallowEquals = (a, b) => {
  if (Object.keys(a).length !== Object.keys(b).length) return false;
  return Object.keys(a).every((key) => a[key] === b[key]);
};

export const useCardGraphStore = defineStore({
  id: "card-graph",
  state: () => ({
    input: {
      global: {
        cardIdToCard: {
          abc: { title: "What is something", data: [1, 2, 3] },
          def: { title: "Where is something", data: [7, 3, 5] },
          ghi: { title: "How is something", data: [2, 4, 9] },
          jkl: { title: "Why is something", data: [4, 2, 2] },
        },
        type: "breakdown",
      },
      cards: [
        { cardId: "abc", double: false },
        { cardId: "def", double: false },
        { cardId: "ghi", double: true },
        { cardId: "jkl", double: false },
      ],
    },
    cards: [],
  }),
  getters: {},
  actions: {
    async calculate() {
      const promises = [];

      this.cards = this.input.cards.map((cardInput, i) => {
        const input = Object.assign({}, cardInput, this.input.global);

        if (this.cards[i] && shallowEquals(input, this.cards[i].input)) {
          return this.cards[i];
        }

        const card = input.cardIdToCard[input.cardId];

        const output = {
          input,
          output: {
            title: card.title,
            loading: true,
            data: [],
          },
        };

        promises.push(
          new Promise((resolve) => {
            setTimeout(() => {
              const cardOut = this.cards.find(
                ({ input: { cardId } }) => cardId === input.cardId
              );
              cardOut.output.loading = false;

              if (input.type === "breakdown") {
                cardOut.output.data = card.data.map(
                  (d) => d * (input.double ? 2 : 1)
                );
              } else {
                cardOut.output.data = card.data;
              }
              resolve()
            }, 500);
          })
        );

        return output;
      });

      await Promise.all(promises);
    },
  },
});
