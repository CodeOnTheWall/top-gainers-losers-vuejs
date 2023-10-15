<!-- TopGainersTable.vue -->
<template>
  <table>
    <thead>
      <tr>
        <th>Ticker</th>
        <th>Price</th>
        <th>Change Amount</th>
        <th @click="sortChangePercentage">
          % Change Percentage <ArrowUpDown />
        </th>
        <th>Volume</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="gainer in sortedTopGainers" :key="gainer.ticker">
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
import { ArrowUpDown } from "lucide-vue-next";

export default {
  components: {
    ArrowUpDown,
  },

  props: ["topGainers"],

  data() {
    return {
      // 1 for ascending, -1 for descending
      sortOrder: 1,
      // Column to sort by
      sortBy: "",
    };
  },
  // computed values are cached based on their reactive data
  // so instead of calculating the max% every getChangePercentageColor
  // 'round' I can just calculate it once and use it in my method,
  // which is better for performance, and only re calculate when
  // topGainers changes
  computed: {
    sortedTopGainers() {
      // avoid changing original array by ... spreading
      // because we have sortBy and sortOrder here, whenever these
      // values change, vue will auto re compute these values
      return [...this.topGainers].sort((a, b) => {
        const aValue = this.getSortableValue(a, this.sortBy);
        const bValue = this.getSortableValue(b, this.sortBy);

        // Determine the order based on sortOrder (1 or -1)
        return this.sortOrder * (aValue - bValue);
      });
    },

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
    sortTable(column) {
      // sortOrder can be 1 or -1, since we havnt clicked anything yet,
      // column === this.sortBy will be false, so first click will make
      // this.sortOrder 1, on second click, since sortBy now has a value,
      // column === this.sortBy will be true, and the ternery opp
      // (-this.sortOrder) will make this.sortOrder -1
      this.sortOrder = column === this.sortBy ? -this.sortOrder : 1;
      this.sortBy = column;
    },
    // func that gets clicked/ran first, passed "change_percentage" into
    // above func of sortTable
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
      // Taking in the gainer value, converting to a number based on the type
      const numericValue = parseFloat(value);

      // Calculate alpha based on the numeric value and the max value for the type
      const alpha = numericValue / this.maxValues[type];

      // Construct the RGBA color with the base green and adjusted alpha
      // alpha is level of transparency or opacity
      const dynamicColor = `rgba(0, 94, 32, ${alpha * 0.7})`;

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
