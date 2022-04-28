import { defineStore } from "pinia";

const needsChange = (newInput, oldInput) => {
  // check stuff like data here too, in real version
  if (newInput.cardId !== oldInput.cardId) {
    return true;
  }

  if (newInput.double !== oldInput.double) {
    return true;
  }

  if (newInput.type !== oldInput.type) {
    return true;
  }

  if (
    (newInput.onScreen || newInput.forceLoad) &&
    !oldInput.onScreen &&
    !oldInput.forceLoad
  ) {
    return true;
  }

  return false;
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
        forceLoad: false, // used for page-level calculations and exporting
      },
      cards: [
        { cardId: "abc", onScreen: false, double: false },
        { cardId: "def", onScreen: false, double: false },
        { cardId: "ghi", onScreen: false, double: false },
        { cardId: "jkl", onScreen: false, double: false },
      ],
    },
    cards: [],
  }),
  getters: {
    totalData() {
      if (this.cards.some(card => card.output.loading)) {
        return -1
      }

      let total = 0;

      for (const card of this.cards) {
        for (const d of card.output.data) {
          total += d;
        }
      }

      return total;
    },
  },
  actions: {
    async calculate() {
      const promises = [];

      this.cards = this.input.cards.map((cardInput, i) => {
        const input = Object.assign({}, cardInput, this.input.global);

        if (this.cards[i] && !needsChange(input, this.cards[i].input)) {
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

        if (input.onScreen || input.forceLoad) {
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

                resolve();
              }, 500);
            })
          );
        }

        return output;
      });

      await Promise.all(promises);
    },
  },
});
