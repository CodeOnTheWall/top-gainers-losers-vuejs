<!-- TopLosersTable.vue -->
<template>
  <table>
    <thead>
      <tr>
        <th>Ticker</th>
        <th>Price</th>
        <th>Change Amount</th>
        <th @click="sortChangePercentage">
          % Change Percentage
          <ArrowUpDown />
        </th>
        <th>Volume</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="loser in sortedTopLosers" :key="loser.ticker">
        <td>{{ loser.ticker }}</td>
        <td>{{ loser.price }}</td>
        <td
          :style="
            getChangePercentageColor(loser.change_amount, 'change_amount')
          "
        >
          {{ loser.change_amount }}
        </td>
        <td
          :style="
            getChangePercentageColor(
              loser.change_percentage,
              'change_percentage'
            )
          "
        >
          {{ loser.change_percentage }}
        </td>
        <td :style="getChangePercentageColor(loser.volume, 'volume')">
          {{ loser.volume }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { ArrowUpDown } from "lucide-vue-next";

export default {
  components: {
    ArrowUpDown,
  },
  props: ["topLosers"],

  data() {
    return {
      // 1 for ascending, -1 for descending
      sortOrder: 1,
      // Column to sort by
      sortBy: "",
    };
  },

  computed: {
    sortedTopLosers() {
      // avoid changing original array by ... spreading
      // because we have sortBy and sortOrder here, whenever these
      // values change, vue will auto re compute these values
      return [...this.topLosers].sort((a, b) => {
        const aValue = this.getSortableValue(a, this.sortBy);
        const bValue = this.getSortableValue(b, this.sortBy);

        // Determine the order based on sortOrder (1 or -1)
        return this.sortOrder * (aValue - bValue);
      });
    },

    maxValues() {
      return {
        // bottom 2 values have negative numbers, so i have to find
        // the min, whereas volume can stay max since were not finding
        // the highest negative number
        change_amount: Math.min(
          ...this.topLosers.map((loser) => parseFloat(loser.change_amount))
        ),
        change_percentage: Math.min(
          ...this.topLosers.map((loser) =>
            parseFloat(loser.change_percentage.replace("%", ""))
          )
        ),
        volume: Math.max(
          ...this.topLosers.map((loser) => parseFloat(loser.volume))
        ),
      };
    },
  },
  methods: {
    sortTable(column) {
      this.sortOrder = column === this.sortBy ? -this.sortOrder : 1;
      this.sortBy = column;
    },

    sortChangePercentage() {
      this.sortTable("change_percentage");
    },
    getSortableValue(item, column) {
      const value = item[column];
      return column === "change_percentage"
        ? parseFloat(value.replace("%", ""))
        : value;
    },

    getChangePercentageColor(value, type) {
      const numericValue = parseFloat(value);

      // reminder that type are the names inside the computed maxValues
      const alpha = Math.abs(numericValue) / Math.abs(this.maxValues[type]);

      // because we still need the absolute number (i.e. -5 is 5) for the alpha
      // we first Math.abs above the value only for the purpose of styling
      // the opagueness
      const dynamicColor = `rgba(251, 80, 87, ${alpha})`;

      return {
        backgroundColor: dynamicColor,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../tables/tableStyles/TopLosersTable.scss";
</style>
