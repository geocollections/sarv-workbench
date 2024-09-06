<template>
  <v-menu bottom offset-y :close-on-content-click="false">
    <template #activator="{ on, attrs }">
      <div
        v-bind="attrs"
        v-on="on"
        style="
          min-height: 40px;
          max-width: 16em;
          min-width: 14em;
          border: 1px solid grey;
        "
        class="pa-1 rounded"
      >
        <v-chip
          v-if="value && !multiple"
          outlined
          label
          :title="value[itemText]"
          style="background-color: white !important"
          close
          small
          @click:close="handleRemove"
        >
          <div style="overflow: hidden; text-overflow: ellipsis">
            {{ value[itemText] }}
          </div>
        </v-chip>
        <v-chip
          v-else-if="multiple"
          v-for="(v, index) in value"
          :key="index"
          outlined
          label
          :title="v[itemText]"
          style="background-color: white !important"
          close
          small
          @click:close="handleListRemove(index)"
        >
          <div style="overflow: hidden; text-overflow: ellipsis">
            {{ v[itemText] }}
          </div>
        </v-chip>
      </div>
    </template>
    <v-card style="width: 300px">
      <v-text-field v-model="search" class="mx-2" label="Search" />
      <v-list style="max-height: 500px" class="overflow-x-auto">
        <v-list-item
          @click="handleValueChange(item)"
          v-for="(item, index) in items"
          :key="index"
          :input-value="isItemActive(item)"
          dense
        >
          <v-list-item-icon class="mr-0">
            <v-icon class="mt-1" small>fas fa-tag</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            {{ item[itemText] }}
          </v-list-item-content>
        </v-list-item>
        <div style="height: 1px" v-intersect="loadMore" />
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "FilterAutocomplete",
  props: {
    value: {
      type: Object,
      required: false,
    },
    query: {
      type: Function,
      required: true,
    },
    itemText: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: "",
      items: [],
      loading: false,
      count: 0,
      offset: 0,
      limit: 10,
      open: false,
    };
  },
  watch: {
    search: {
      async handler() {
        this.items = [];
        this.offset = 0;
        // if (this.search === null || this.search.length < 1) return;
        this.getSuggestions();
      },
      immediate: false,
    },
    query: {
      handler() {
        this.items = [];
        this.search = "";
      },
    },
  },
  created() {
    this.getSuggestions();
  },
  methods: {
    handleValueChange(item) {
      if (!this.multiple) {
        this.$emit("input", item);
      } else {
        if (this.isItemActive(item)) return;
        this.$emit("input", [...this.value, item]);
      }
    },
    toggleList() {
      this.open = !this.open;
    },
    handleRemove() {
      this.$emit("input", null);
    },
    handleListRemove(index) {
      const result = [...this.value];
      result.splice(index, 1);
      this.$emit("input", result);
    },
    async loadMore(_entries, _observer, isIntersecting) {
      if (!isIntersecting) return;
      if (this.count <= this.offset) return;
      if (this.loading) return;

      await this.getSuggestions();
    },
    async getSuggestions() {
      this.loading = true;

      const res = await this.query({
        search: this.search,
        limit: this.limit,
        offset: this.offset,
      });

      this.items.push(...res.data.results);
      this.count = res.data.count;

      this.offset += this.limit;
      this.loading = false;
    },
    isItemActive(item) {
      if (!this.value) return false;
      if (!this.multiple) {
        return item.id === this.value.id;
      } else {
        return this.value.some((v) => v.id === item.id);
      }
    },
  },
};
</script>
