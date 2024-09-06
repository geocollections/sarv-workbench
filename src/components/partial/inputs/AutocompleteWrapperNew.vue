<template>
  <div class="input-class">
    <v-autocomplete
      ref="autocomplete"
      background-color="white"
      clearable
      clear-icon="fas fa-times"
      dense
      hide-no-data
      hide-details="auto"
      outlined
      no-filter
      return-object
      item-color="deep-orange"
      :placeholder="$t('add.autocomplete')"
      :search-input.sync="search"
      :label="label"
      :item-text="itemText"
      :items="suggestions"
      :value="value"
      :rules="rules"
      @change="handleChange"
    >
      <template v-slot:append-outer>
        <v-btn
          v-if="isValidLink"
          :to="route"
          :title="`Go to ${route}`"
          color="deep-orange"
          icon
          small
        >
          <v-icon>fas fa-external-link-square-alt</v-icon>
        </v-btn>
      </template>
      <template v-slot:item="{ item }">
        <slot name="item" :item="item">
          <v-list-item-content>
            <v-list-item-title>{{ item[itemText] }}</v-list-item-title>
          </v-list-item-content>
        </slot>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import debounce from "lodash/debounce";

export default {
  name: "AutocompleteWrapperNew",
  props: {
    route: {
      type: String,
      default: "",
    },
    value: Object,
    label: {
      type: String,
      default: "",
    },
    itemText: {
      type: String,
      default: "name",
    },
    rules: {
      type: Array,
      default: () => [],
    },
    suggestions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      search: "",
      skipSearch: false,
    };
  },
  computed: {
    isValidLink() {
      return this.value !== null && this.route.length > 0;
    },
  },
  watch: {
    search: {
      handler: debounce(async function (newVal, oldVal) {
        if (this.skipSearch) {
          this.skipSearch = false;
          return;
        }
        if (newVal === null) {
          return;
        }
        if (newVal.length < 1) {
          return;
        }
        if (newVal === oldVal) {
          return;
        }
        this.$emit("search:items", newVal);
      }, 300),
    },
    immediate: false,
  },
  methods: {
    handleChange(value) {
      this.skipSearch = true;
      this.$emit("input", value);
    },
  },
};
</script>
