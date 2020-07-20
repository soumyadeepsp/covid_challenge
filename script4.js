Vue.component("stat-title", {
  template: `
      <h4 class="text-sm mb-2 uppercase font-medium text-gray-500">
        <slot/>
      </h4>`,
});

Vue.component("stat-num", {
  props: {
    stat: {
      type: Number,
      default: 0,
    },
  },
  template: `
      <h4 class="font-mono font-medium bold text-purple-700">
        {{ stat.toLocaleString() }}
      </h4>`,
});

Vue.component("card", {
  template: `
      <div class="card rounded overvlow-hidden shadow-md p-6 border border-gray-300 mb-4 md:mb-0">
        <slot />
      </div>`,
});

Vue.component("alert", {
  template: `
      <div role="alert">
        <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
          <slot name="title"/>
        </div>
        <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
          <slot name="content"/>
        </div>
      </div>`,
});

Vue.component("pagination", {
  props: {
    hasPrev: {
      type: Boolean,
      default: false,
    },
    hasNext: {
      type: Boolean,
      default: false,
    },
  },
  template: `
      <div class="pagination mt-4 flex">
        <button
          class="bg-purple-600 rounded py-2 px-4 text-white font-semibold"
          :disabled="!hasPrev"
          :class="{ 'cursor-not-allowed opacity-50': !hasPrev }"
          @click="$emit('prev')">
            &larr; Prev
        </button>
        <button
          class="bg-purple-600 rounded py-2 px-4 text-white font-semibold ml-auto"
          :disabled="!hasNext"
          :class="{ 'cursor-not-allowed opacity-50': !hasNext }"
          @click="$emit('next')">
            Next &rarr;
        </button>
      </div>`,
});

const app = new Vue({
  el: "#app",
  data() {
    return {
      api: "https://coronavirus-19-api.herokuapp.com",
      statsLoaded: false,
      countriesLoaded: false,
      errorStats: false,
      errorCountries: false,
      items: [],
      stats: [],
      pageSize: 6,
      pageNumber: 0,
    };
  },
  computed: {
    pageCount() {
      const itemCount = Object.entries(this.items).length;
      const pageSize = this.pageSize;

      return Math.ceil(itemCount / pageSize);
    },
    paginatedData() {
      const data = this.items;
      const start = this.pageNumber * this.pageSize;
      const end = start + this.pageSize;
      const filtered = data.slice(start, end);

      return filtered;
    },
    pagePlace() {
      return `Page ${this.pageNumber + 1} of ${this.pageCount}`;
    },
  },
  mounted() {
    this.fetchCountryData();
    this.fetchStats();
  },
  methods: {
    // fetch stats by country
    fetchCountryData() {
      this.countriesLoaded = false;
      this.errorCountries = false;

      fetch(`${this.api}/countries`)
        .then((res) => res.json())
        .then((data) => (this.items = data))
        .finally(() => (this.countriesLoaded = true))
        .catch((error) => {
          this.countriesLoaded = false;
          this.errorCountries = true;
          console.log(error);
        });
    },
    // fetch basic stats
    fetchStats() {
      this.statsLoaded = false;
      this.errorStats = false;

      fetch(`${this.api}/all`)
        .then((res) => res.json())
        .then((data) => (this.stats = data))
        .finally(() => (this.statsLoaded = true))
        .catch((error) => {
          this.statsLoaded = false;
          this.errorStats = true;
          console.log(error);
        });
    },
    prevPage() {
      this.pageNumber--;
    },
    nextPage() {
      this.pageNumber++;
    },
  },
});
