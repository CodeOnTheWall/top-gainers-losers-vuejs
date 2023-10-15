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
      <tr v-for="item in items" :key="item.ticker">
        <td>{{ item.ticker }}</td>
        <td>{{ item.price }}</td>
        <td :style="getStyle(item.change_amount, 'change_amount')">
          {{ item.change_amount }}
        </td>
        <td :style="getStyle(item.change_percentage, 'change_percentage')">
          {{ item.change_percentage }}
        </td>
        <td :style="getStyle(item.volume, 'volume')">
          {{ item.volume }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
export default {
  props: {
    items: Array, // Array of items to display
    tableType: String, // Type of the table, e.g., "gainers" or "losers"
  },
  computed: {
    maxValues() {
      return {
        change_amount: this.getMaxValue("change_amount"),
        change_percentage: this.getMaxValue("change_percentage"),
        volume: this.getMaxValue("volume"),
      };
    },
  },
  methods: {
    getStyle(value, type) {
      const numericValue = parseFloat(value);
      const alpha = numericValue / this.maxValues[type];
      const dynamicColor = `rgba(0, 94, 32, ${alpha})`;

      return {
        backgroundColor: dynamicColor,
      };
    },
    getMaxValue(property) {
      return Math.max(...this.items.map((item) => parseFloat(item[property])));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../tables/tableStyles/TopTable.scss";

.table-gainers {
  // Styles specific to gainers table
}

.table-losers {
  // Styles specific to losers table
}
</style>
