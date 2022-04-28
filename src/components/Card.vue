<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useCardGraphStore } from "../stores/card-graph.js";
import { useIntersectionObserver } from "vue-composable";

const props = defineProps({
  input: Object,
  output: Object,
});

const store = useCardGraphStore();

const cardInput = computed(() =>
  store.input.cards.find(({ cardId }) => cardId === props.input.cardId)
);

const shouldDouble = computed({
  get: () => cardInput.value.double,
  set: (newValue) => (cardInput.value.double = newValue),
});

const el = ref(null);
const observer = useIntersectionObserver(el);
watch(observer.isIntersecting, (isIntersecting) => {
  if (observer.isIntersecting && !cardInput.value.onScreen) {
    cardInput.value.onScreen = true;
  }
});
</script>

<template>
  <div ref="el" class="card">
    <h2>{{ props.output.title }}</h2>
    <div v-if="props.input.type === 'breakdown'">
      <p>breakdown:</p>
      <p v-if="props.output.loading || !cardInput.onScreen" class="loading">
        loading breakdown…
      </p>
      <table v-else class="breakdown">
        <thead>
          <tr>
            <th></th>
            <th>total</th>
            <th>col val</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, i) in props.output.data">
            <th>#{{ i }}</th>
            <td>{{ d }}</td>
            <td>dunno</td>
          </tr>
        </tbody>
      </table>

      <p class="double">
        <label><input type="checkbox" v-model="shouldDouble" /> …double?</label>
      </p>
    </div>
    <div v-else>
      <p>results:</p>
      <p v-if="props.output.loading || !props.input.onScreen" class="loading">
        loading results…
      </p>
      <ul v-else class="results">
        <li v-for="(d, i) in props.output.data">
          <span class="bar" :style="{ width: `${d * 35}px` }">
            #{{ i }}: {{ d }}</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.card {
  min-height: 300px;
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
