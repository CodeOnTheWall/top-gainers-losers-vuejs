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
        <td
          :style="
            getChangePercentageColor(gainer.change_amount, 'change_amount')
          "
        >
          {{ gainer.change_amount }}
        </td>
        <td
          :style="
            getChangePercentageColor(
              gainer.change_percentage,
              'change_percentage'
            )
          "
        >
          {{ gainer.change_percentage }}
        </td>
        <td :style="getChangePercentageColor(gainer.volume, 'volume')">
          {{ gainer.volume }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
export default {
  props: ["topGainers"],
  // computed values are cached based on their reactive data
  // so instead of calculating the max% every getChangePercentageColor
  // 'round' I can just calculate it once and use it in my method,
  // which is better for performance, and only re calculate when
  // topGainers changes
  computed: {
    maxValues() {
      return {
        // [type] will be the various names such as change_amount
        change_amount: Math.max(
          ...this.topGainers.map((gainer) => parseFloat(gainer.change_amount))
        ),
        // reminder that 'this' in vue 3 is used to access data properties,
        // computed properties, and methods. since topGainers is a passed
        // in prop, i access via this. adding the spread... opp since
        // math.max expects ind args, not an array of objects
        change_percentage: Math.max(
          ...this.topGainers.map((gainer) =>
            parseFloat(gainer.change_percentage.replace("%", ""))
          )
        ),
        volume: Math.max(
          ...this.topGainers.map((gainer) => parseFloat(gainer.volume))
        ),
      };
    },
  },
  methods: {
    getChangePercentageColor(value, type) {
      // Taking in the gainer value, converting to a number based on the type
      const numericValue = parseFloat(value);

      // Calculate alpha based on the numeric value and the max value for the type
      const alpha = numericValue / this.maxValues[type];

      // Construct the RGBA color with the base green and adjusted alpha
      // alpha is level of transparency or opacity
      const dynamicColor = `rgba(0, 94, 32, ${alpha})`;

      return {
        backgroundColor: dynamicColor, // Set the dynamic background color
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../tables/tableStyles/TopGainersTable.scss";
</style>
