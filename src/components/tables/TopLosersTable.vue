<!-- TopLosersTable.vue -->
<template>
  <table>
    <thead>
      <tr>
        <th>Ticker</th>
        <th>Price</th>
        <th>Change Amount</th>
        <th @click="sortChangePercentage" class="th-with-flex">
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
import { ref, computed } from "vue";
import { ArrowUpDown } from "lucide-vue-next";

export default {
  components: {
    ArrowUpDown,
  },
  props: ["topLosers"],

  setup(props) {
    // REACTIVE DATA
    // 1 for ascending, -1 for descending
    const sortOrder = ref(1);
    // Column to sort by
    // initial value will be sorted as the array already is
    const sortBy = ref("");
    // END REACTIVE DATA

    // COMPUTED DATA
    const sortedTopLosers = computed(() => {
      return [...props.topLosers].sort((a, b) => {
        const aValue = getSortableValue(a, sortBy.value);
        const bValue = getSortableValue(b, sortBy.value);

        // fixed double click issue by changing from a -b to b - a,
        // since the first click would be going to the order its
        // already in, hence the updownarrow took 2 clicks, this
        // fixes that issue
        // a-b is asc, b-a is desc
        // right now default is ascending (most min to most max)
        // so we have to change to desc (most max/least negative to most min/most negative)
        return sortOrder.value * (bValue - aValue);
      });
    });

    const maxValues = computed(() => {
      return {
        // converting all from strings to nums
        change_amount: Math.min(
          ...props.topLosers.map((loser) => parseFloat(loser.change_amount))
        ),
        // this one requires removing the % in the string as well
        change_percentage: Math.min(
          ...props.topLosers.map((loser) =>
            parseFloat(loser.change_percentage.replace("%", ""))
          )
        ),
        volume: Math.max(
          ...props.topLosers.map((loser) => parseFloat(loser.volume))
        ),
      };
    });
    // END COMPUTED DATA

    // METHODS/FUNCTIONS
    function sortTable(column) {
      sortOrder.value = column === sortBy.value ? -sortOrder.value : 1;
      sortBy.value = column;
    }

    function sortChangePercentage() {
      sortTable("change_percentage");
    }

    function getSortableValue(item, column) {
      const value = item[column];
      return column === "change_percentage"
        ? parseFloat(value.replace("%", ""))
        : parseFloat(value);
    }

    function getChangePercentageColor(value, type) {
      if (type === "volume") {
        const numericValue = parseFloat(value);
        const maxValue = maxValues.value[type];

        const alpha = (numericValue / maxValue) * 0.5 + 0.5;

        const dynamicColor = `rgba(251, 80, 87, ${alpha})`;

        return {
          backgroundColor: dynamicColor,
        };
      } else {
        const numericValue = parseFloat(value);
        // find min (most negative) and max
        const minValue = Math.min(
          ...props.topLosers.map((loser) => parseFloat(loser[type]))
        );
        const maxValue = Math.max(
          ...props.topLosers.map((loser) => parseFloat(loser[type]))
        );
        // console.log(numericValue, maxValue, minValue);

        const normalizedValue =
          (maxValue - numericValue) / (maxValue - minValue);
        const alpha = normalizedValue * 0.5 + 0.5;

        const dynamicColor = `rgba(251, 80, 87, ${alpha})`;

        return {
          backgroundColor: dynamicColor,
        };
      }
    }

    // END METHODS/FUNCTIONS

    return {
      sortedTopLosers,
      sortChangePercentage,
      getChangePercentageColor,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../tables/tableStyles/TopLosersTable.scss";
</style>
