<!-- VUE NOTES
1. Reactivity: Vue automatically tracks JavaScript state changes and 
efficiently updates the DOM when changes happen.
2. we use SFC - single file components -->

<!-- HTML markup for a vue component -->
<template>
  <div v-if="gainerLoserData" class="container">
    <div class="button-container">
      <h1>
        Top <span class="highlight">G</span>ainers and
        <span class="loss">L</span>osers of US Equities
      </h1>
      <div>
        <button
          @click="selectedTab = 'gainers'"
          :class="{
            gainers: true,
            active: selectedTab === 'gainers',
          }"
        >
          Top Gainers
        </button>

        <button
          @click="selectedTab = 'losers'"
          :class="{
            losers: true,
            active: selectedTab === 'losers',
          }"
        >
          Top Losers
        </button>
      </div>
    </div>

    <TopGainersTable
      v-if="selectedTab === 'gainers'"
      :topGainers="gainerLoserData.top_gainers"
    />
    <TopLosersTable
      v-if="selectedTab === 'losers'"
      :topLosers="gainerLoserData.top_losers"
    />
  </div>
  <div v-else>
    <LoadingSkeletonTable />
  </div>
</template>

<!-- JS logic for the vue component -->
<script lang="ts">
import TopGainersTable from "../components/tables/TopGainersTable.vue";
import TopLosersTable from "../components/tables/TopLosersTable.vue";
import LoadingSkeletonTable from "../components/tables/LoadingTableSkeleton.vue";

import { ref, onMounted, defineComponent, watchEffect, provide } from "vue";

interface Gainer {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
}

interface GainerLoserData {
  metadata: string;
  last_updated: string;
  top_gainers: Gainer[];
  top_losers: Gainer[];
  most_actively_traded: Gainer[];
}

// must use defineComponent when creating vue with ts
export default defineComponent({
  name: "TopGainersLosersList",

  components: {
    TopGainersTable,
    TopLosersTable,
    LoadingSkeletonTable,
  },

  // setup func is the entry point for using composition api inside
  // components. when a component is created, but before mounted, the
  // setup func func is called, defining reactive data. this func is
  // only called once during the components lifecylce
  setup() {
    // ref() returns a reactive object where the data is stored in .value
    // so if i want to change the data id have to access.value first
    // whereas i dont have to in the template since vue auto unwraps
    // the ref value, and i can use the ref directly

    // ref func is used to create a reactive reference, in turn to create
    // reactive data. when the value of the reactive ref changes, vue
    // will update parts of the dom that uses that data. initial arg is the
    // initial value of the reactive ref, which can hold any value type
    const selectedTab = ref("gainers");
    const gainerLoserData = ref<GainerLoserData | null>(null);
    console.log(gainerLoserData);

    const fetchData = async () => {
      const response = await fetch(
        "https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo"
      );
      const data = await response.json();

      // The fetched data is stored in the reactive reference 'data'.
      // vue auto unwraps the ref(), so i dont have to access the .value
      // first, i can directly do i.e. gainerLoserData.metadata
      // this is when used in the template that its unwrapped, but according to docs
      // if i want to change a specific value before, then i would use .value here
      // reference the notes about the increment func for reminder
      gainerLoserData.value = data;
    };

    // onMounted func is a lifecycle hook that runs after the
    // component has been mounted. It's a good place to put code that needs
    // to run when the component is loaded, like fetching data from an
    // API. takes a callback func which is executed after component is mounted
    onMounted(fetchData);

    // Watch for changes in selectedTab and provide it to parent
    // where it will be 'injected'
    // feature to be added but running out of time and not getting it to
    // work just yet with adding background color to body based on if
    // selectedTab is gainers or losers
    // watchEffect(() => {
    //   provide("selectedTab", selectedTab.value);
    // });

    // whatever is returned from the setup func is exposed to be consumed
    // inside the template
    return { gainerLoserData, selectedTab };
  },
});
</script>

<style lang="scss" scoped>
@import "../components//tables/tableStyles/TopGainersLosersList.scss";
</style>
