<!-- SkeletonTable.vue -->
<template>
  <h1>Loading Gainers and Losers...</h1>
  <table>
    <thead>
      <tr>
        <th>Ticker</th>
        <th>Price</th>
        <th>Change Amount</th>
        <th>Change Percentage</th>
        <th>Volume</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in 5" :key="i">
        <td><div class="skeleton"></div></td>
        <td><div class="skeleton"></div></td>
        <td><div class="skeleton"></div></td>
        <td><div class="skeleton"></div></td>
        <td><div class="skeleton"></div></td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
export default {
  name: "LoadingSkeletonTable",
};
</script>

<style scoped>
.skeleton {
  background: #ddd;
  width: 100%;
  height: 1em;
  border-radius: 4px;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
