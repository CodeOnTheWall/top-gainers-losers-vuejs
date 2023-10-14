<!-- VUE NOTES
1. Reactivity: Vue automatically tracks JavaScript state changes and 
efficiently updates the DOM when changes happen.
2. we use SFC - single file components -->

<!-- HTML markup for a vue component -->
<template>
  <div>
    <h1>Top Gainers and Losers</h1>
    <div v-if="gainerLoserData">
      <h2>Top Gainers</h2>
      <ul>
        <li v-for="gainer in gainerLoserData.top_gainers" :key="gainer.ticker">
          {{ gainer.ticker }} - {{ gainer.price }} -
          {{ gainer.change_percentage }}
        </li>
      </ul>
      <h2>Top Losers</h2>
      <ul>
        <li v-for="loser in gainerLoserData.top_losers" :key="loser.ticker">
          {{ loser.ticker }} - {{ loser.price }} - {{ loser.change_percentage }}
        </li>
      </ul>
    </div>
  </div>
</template>

<!-- JS logic for the vue component -->
<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

interface GainerLoserData {
  metadata: string;
  last_updated: string;
  top_gainers: Array<{ [key: string]: string }>;
  top_losers: Array<{ [key: string]: string }>;
  most_actively_traded: Array<{ [key: string]: string }>;
}

export default defineComponent({
  name: "TopGainersLosersList",

  // setup func is the entry point for using composition api inside
  // components. when a component is created, but before mounted, the
  // setup func func is called, defining reactive data. this func is
  // only called once during the components lifecylce
  setup() {
    // ref func is used to create a reactive reference, in turn to create
    // reactive data. when the value of the reactive ref changes, vue
    // will update parts of the dom that uses that data. initial arg is the
    // initial value of the reactive ref, which can hold any value type
    const gainerLoserData = ref<GainerLoserData | null>(null);
    console.log(gainerLoserData);

    const fetchData = async () => {
      const response = await fetch(
        "https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo"
      );
      const data = await response.json();

      // The fetched data is stored in the reactive reference 'data'.
      gainerLoserData.value = data;
    };

    // onMounted func is a lifecycle hook that runs after the
    // component has been mounted. It's a good place to put code that needs
    // to run when the component is loaded, like fetching data from an
    // API. takes a callback func which is executed after component is mounted
    onMounted(fetchData);

    // whatever is returned from the setup func is exposed to be consumed
    // inside the template
    return { gainerLoserData };
  },
});
</script>

<style scoped>
/* Add your styles here */
</style>
