<script setup>
import { computed, onMounted, watch } from "vue";
import Card from "./components/Card.vue";
import { useCardGraphStore } from "./stores/card-graph.js";

const store = useCardGraphStore();
onMounted(store.calculate);
watch(store.input, store.calculate);

const type = computed({
  get: () => store.input.global.type,
  set: (newValue) => (store.input.global.type = newValue),
});

function sumData() {
  store.input.global.forceLoad = true;
}
</script>

<template>
  <div class="app">
    <div class="main">
      <Card
        v-for="card in store.cards"
        :input="card.input"
        :output="card.output"
      />
    </div>
    <div class="sidebar">
      <p>
        type:
        <label>
          <input v-model="type" type="radio" value="breakdown" />
          breakdown
        </label>
        <label>
          <input v-model="type" type="radio" value="results" />
          results
        </label>
      </p>

      <h3>sum of data:</h3>
      <div v-if="store.totalData === -1">
        <p>click button to generate</p>
        <button type="button" @click="sumData">generate</button>
      </div>
      <p v-else>{{ store.totalData }}</p>
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
