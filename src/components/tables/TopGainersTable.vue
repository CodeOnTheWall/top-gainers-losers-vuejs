<!-- TopGainersTable.vue -->
<template>
  <table>
    <thead>
      <tr>
        <th>Ticker</th>
        <th>Price</th>
        <th>Change Amount</th>
        <th @click="sortChangePercentage" class="th-with-flex">
          <span>% Change Percentage</span>
          <ArrowUpDown />
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
        // wont be any sortBy on initial render, hence will render in the
        // sorting that its already in
        // sending a and b to setSortableValue to convert to num to be able
        // to compare them
        const aValue = this.getSortableValue(a, this.sortBy);
        const bValue = this.getSortableValue(b, this.sortBy);
        console.log("aValue", aValue, "bValue", bValue);

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
    // item is the object, column is i.e. change_percentage
    // receiving data from sortedTopGainers to be converted to num since
    // the properties inside the item object are all strings (top_gainers)
    getSortableValue(item, column) {
      // console.log(item);
      // extracting the value from the item object with same name as column
      // i.e. extracting the value that is under the property/column called
      // change_percentage
      const value = item[column];
      // some columns dont have a % to remove to convert to num, hence the
      // ternary opp
      // this columnValue becomes aValue and bValue
      return column === "change_percentage"
        ? parseFloat(value.replace("%", ""))
        : parseFloat(value);
    },

    getChangePercentageColor(value, type) {
      const numericValue = parseFloat(value);
      const maxValue = this.maxValues[type];
      // linear interpolation (lerp) function
      // so that we are always between rgba(0, 94, 32, 0.5-1)
      // purpose being so that arrays of objects that have significant
      // variance such as volume, that the color% can be scaled properly

      // alpha calculated based on the ratio of the numericValue to maxValue
      // which is a linear interpolation. this is to make it so
      // the color will be evenly distributed between the minimum and maximum
      // colors, regardless of the actual values.
      // the min being rgba(0, 94, 32, 0.5)

      // Calculate the alpha value based on the numeric value and the max value
      const alpha = (numericValue / maxValue) * 0.5 + 0.5;

      // Construct the RGBA color with the base green and adjusted alpha
      const dynamicColor = `rgba(0, 94, 32, ${alpha})`;

      return {
        backgroundColor: dynamicColor,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../tables/tableStyles/TopGainersTable.scss";
</style>
