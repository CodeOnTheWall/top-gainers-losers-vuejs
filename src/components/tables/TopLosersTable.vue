<!-- TopLosersTable.vue -->
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
      <tr v-for="loser in topLosers" :key="loser.ticker">
        <td>{{ loser.ticker }}</td>
        <td>{{ loser.price }}</td>
        <td>{{ loser.change_amount }}</td>
        <td>{{ loser.change_percentage }}</td>
        <td>{{ loser.volume }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
export default {
  props: ["topLosers"],
};
</script>
