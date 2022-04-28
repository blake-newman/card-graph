<script setup>
import Card from "./components/Card.vue";
import { useCardGraphStore } from "./stores/card-graph.js";
import { useCardStore } from "./stores/card";

const store = useCardGraphStore();

const onExport = (e) => {
  const result = Object.values(store.cardIdToCard).map(
    (card) => [...useCardStore(card).result]
  );

  console.log(result);
};
</script>

<template>
  <div class="app">
    <button @click="onExport">Export</button>
    <div class="main">
      <Card v-for="card in store.cardIdToCard" :key="card.id" :id="card.id" />
    </div>
  </div>
</template>

<style>
@import "./assets/base.css";

.app {
  display: flex;
  gap: 20px;
}

.main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar {
  width: 300px;
  border: 1px lightgrey solid;
  padding: 20px;
}

.sidebar > :first-child {
  margin-top: 0;
}

.sidebar > :last-child {
  margin-bottom: 0;
}
</style>
