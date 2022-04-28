<script setup>
import { computed, ref, watch } from "vue";
import { useCardGraphStore } from "../stores/card-graph.js";
import { useCardStore } from "../stores/card.js";
import { createPinia } from 'pinia'

const props = defineProps({
  id: String,
});

const card = useCardGraphStore().cardIdToCard[props.id]
const resultCard = computed(() => useCardStore(card))
const state = ref({ loading: false, type: card.type })

const onChange = (e) => {
  state.value.type = e.target.value
  state.value.loading = true;
  setTimeout(() => {
    card.type = state.value.type;
    state.value.loading = false;
  }, 500);
}


// if want to cleanup when card not used
watch(resultCard, (_, before) => before.$dispose())

// cleanup after card destroyed
// onUnmounted(resultCard, () => resultCard.$dispose())
</script>

<template>
  <div class="card">
    <h2>{{ card.title }}</h2>
    <div>
      <p>breakdown:</p>
      <p v-if="state.loading" class="loading">loading breakdown…</p>
      <table v-else class="breakdown">
        <thead>
          <tr>
            <th></th>
            <th>total</th>
            <th>col val</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, i) in resultCard.result" :key="i">
            <th>#{{ i }}</th>
            <td>{{ d }}</td>
            <td>dunno</td>
          </tr>
        </tbody>
      </table>

      <p class="double">
        <select
          @input="onChange"
          :value="state.type"
        >
          <option value="result">Result</option>
          <option value="double">Double</option>
          <option value="ref">Double + ref card</option>
        </select>
      </p>
    </div>
  </div>
</template>

<style>
.card {
  border: 1px lightgrey solid;
  padding: 20px;
}

.card h2 {
  margin: 0;
}

.card > :last-child,
.double {
  margin-bottom: 0;
}

.loading {
  display: inline-block;
  animation: spin 4s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.breakdown {
  border-collapse: collapse;
}

.breakdown th,
.breakdown td {
  text-align: left;
  padding: 5px 10px;
  border: 1px lightgrey solid;
}

.results .bar {
  display: inline-block;
  background-color: #e6eaed;
}

.results li:not(:last-child) .bar {
  margin-bottom: 2px;
}
</style>
