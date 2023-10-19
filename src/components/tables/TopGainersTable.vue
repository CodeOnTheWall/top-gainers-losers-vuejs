<!-- TopGainersTable.vue -->
<template>
  <input
    class="search-input"
    v-model="searchTerm"
    placeholder="Search by Ticker"
  />
  <table>
    <thead>
      <tr>
        <th>Ticker</th>
        <th>Price</th>
        <th @click="() => handleSort('change_amount')">
          <div class="th-with-flex">
            Change Amount
            <ArrowUpDown />
          </div>
        </th>
        <th @click="() => handleSort('change_percentage')">
          <div class="th-with-flex">
            <span>% Change Percentage</span> <ArrowUpDown />
          </div>
        </th>
        <th @click="() => handleSort('volume')">
          <div class="th-with-flex">
            Volume
            <ArrowUpDown />
          </div>
        </th>
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

<script setup>
import { ref, computed } from "vue";
import { ArrowUpDown } from "lucide-vue-next";

const props = defineProps({
  topGainers: Array,
});

// REACTIVE DATA
const searchTerm = ref("");
// 1 for ascending, -1 for descending
const sortOrder = ref(1);
// Column to sort by
const sortBy = ref("");
// END REACTIVE DATA

// COMPUTED DATA

const sortedTopGainers = computed(() => {
  // filter the topGainers data by searchTerm
  // this logic below is to allow to filter by ticker, as well
  // as the other sorting logic
  let gainers = props.topGainers.filter((gainer) =>
    // searchTerm value is from vues v-model
    gainer.ticker.toLowerCase().includes(searchTerm.value.toLowerCase())
  );

  // Sort the filtered gainers data
  return gainers.sort((a, b) => {
    // sending values to getSortableValue func to convert to nums
    const aValue = getSortableValue(a, sortBy.value);
    const bValue = getSortableValue(b, sortBy.value);

    // for now is nan/null since no sortBy, hence first render
    // will render in given order, which is already ascending based
    // on api data array
    // Determine the order based on sortOrder (1 or -1)
    // default now is b - a (desc - most max - most min)
    return sortOrder.value * (aValue - bValue);
  });
});

// computed values are cached based on their reactive data
// so instead of calculating the max% every getChangePercentageColor
// 'round' I can just calculate it once and use it in my method,
// which is better for performance, and only re calculate when
// topGainers changes
const maxValues = computed(() => {
  return {
    // converting all from strings to nums
    change_amount: Math.max(
      ...props.topGainers.map((gainer) => parseFloat(gainer.change_amount))
    ),
    // this one requires removing the % in the string as well
    change_percentage: Math.max(
      ...props.topGainers.map((gainer) =>
        parseFloat(gainer.change_percentage.replace("%", ""))
      )
    ),
    volume: Math.max(
      ...props.topGainers.map((gainer) => parseFloat(gainer.volume))
    ),
  };
});
// END COMPUTED DATA

// METHODS/FUNCTIONS
// sortOrder can be 1 or -1, since we havnt clicked anything yet (no value
// inside sortBy)
// column === sortBy.value will be false, so first click will make
// sortOrder.value 1, on second click, since sortBy now has a value,
// column === this.sortBy will be true, and the ternary opp ?
// will do this: -sortOrder.value
function sortTable(column) {
  sortOrder.value = column === sortBy.value ? -sortOrder.value : 1;
  sortBy.value = column;
}

// function that kicks off the sorting
function handleSort(column) {
  switch (column) {
    case "change_amount":
    case "volume":
    case "change_percentage":
      sortTable(column);
      break;
  }
}

// item is the object with all the properties (change_percentage, change amount,
// ticker etc), column is i.e. change_percentage
// receiving data from sortedTopGainers to be converted to num since
// the properties inside the item object are all strings (top_gainers)
function getSortableValue(item, column) {
  // extracting the value from the item object with same name as column
  // i.e. extracting the value that is under the property/column called
  // change_percentage
  // then converting to num, if column isnt change_percentage, then we can skip
  // the step of removing the % from the string, and directly parse it
  const value = item[column];
  return column === "change_percentage"
    ? parseFloat(value.replace("%", ""))
    : parseFloat(value);
}

function getChangePercentageColor(value, type) {
  const numericValue = parseFloat(value);
  const maxValue = maxValues.value[type];

  // linear interpolation (lerp) function
  // so that we are always between rgba(0, 94, 32, 0.5) and
  // rgba(0, 94, 32, 1)
  // purpose being so that arrays of objects that have significant
  // variance such as volume, that the color% can be scaled properly

  // alpha calculated based on the ratio of the numericValue to maxValue
  // which is a linear interpolation. this is to make it so
  // the color will be evenly distributed between the minimum and maximum
  // colors, regardless of the actual values.
  // the min being rgba(0, 94, 32, 0.5)

  // Calculate the alpha value based on the numeric value and the max value
  // highest value would get alpha of 1, while lowest in the respective data set
  // would have an alpha min of 0.5
  const alpha = (numericValue / maxValue) * 0.5 + 0.5;

  const dynamicColor = `rgba(0, 94, 32, ${alpha})`;

  return {
    backgroundColor: dynamicColor,
  };
}
// END METHODS/FUNCTIONS
</script>

<style lang="scss" scoped>
@import "../tables/tableStyles/TopGainersTable.scss";
</style>
