<!-- TopGainersTable.vue -->
<template>
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
      <tr v-for="gainer in topGainers" :key="gainer.ticker">
        <td>{{ gainer.ticker }}</td>
        <td>{{ gainer.price }}</td>
        <td>{{ gainer.change_amount }}</td>
        <td>{{ gainer.change_percentage }}</td>
        <td>{{ gainer.volume }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
// will be passing this child component the prop of "topGainers"
// from the parent component TopGainersLosersList
export default {
  props: ["topGainers"],
};
</script>
