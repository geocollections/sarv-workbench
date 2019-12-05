<template>
  <div class="input-class">
    <v-autocomplete
      background-color="white"
      clearable
      clear-icon="fas fa-times"
      dense
      hide-details
      hide-no-data
      outlined
      :item-color="$attrs.color"
      return-object
      :cache-items="isSearchable"
      v-bind="$attrs"
      v-on="$listeners"
      :search-input.sync="search"
      :title="$attrs.value ? $attrs.value[this.$attrs['item-text']] : ''"
      :error="useState ? !$attrs.value : false"
      :success="useState ? !!$attrs.value : false"
    >
      <template v-slot:append-outer>
        <v-btn
          v-if="isValidLink && $attrs.value && $attrs.value.id"
          :to="{ path: `/${routeObject}/${$attrs.value.id}` }"
          :title="`Go to /${routeObject}/${$attrs.value.id}`"
          icon
          :color="$attrs.color"
          small
        >
          <v-icon>far fa-eye</v-icon>
        </v-btn>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
export default {
  name: "AutocompleteWrapper",
  inheritAttrs: false,
  props: {
    isLink: Boolean,
    routeObject: String,
    isSearchable: Boolean,
    method: Function,
    useState: Boolean
  },
  data: () => ({
    search: null
  }),
  computed: {
    isValidLink() {
      if (this.isLink) {
        if (this.routeObject && this.routeObject.trim().length > 0) {
          return true;
        } else {
          console.error("route-object prop must be string!");
          return false;
        }
      } else return false;
    }
  },
  watch: {
    search(newVal, oldVal) {
      let currentValue = (this.$attrs.value && this.$attrs.value[this.$attrs["item-text"]]);

      // console.log("currentVal: " + currentValue);
      // console.log("newVal: " + newVal);
      // console.log("oldVal: " + oldVal);
      if (
        this.isSearchable &&
        newVal &&
        newVal.length > 0 &&
        newVal !== currentValue &&
        newVal !== oldVal
      ) {
        this.$emit("search:items", newVal);
      }
    }
  },
  methods: {
    openInNewTab(object, id) {
      let routeData = this.$router.resolve({ path: `/${object}/${id}` });
      window.open(routeData.href, "AutocompleteWindow");
    }
  }
};
</script>

<style scoped>
.input-class >>> .v-text-field--outlined {
  background-color: unset;
}

/* Setting chip height to min-height because long texts wrap and kinda break the chip styles */
.input-class >>> .v-select__selections {
  height: 32px;
}

/* Adding margin right to chip content because delete button has absolute position and otherwise it would overlap */
.input-class >>> .v-chip__content {
  margin-right: 18px; /* delete icon width is 18px */
}

/* Making delete button in chip absolute because overlapping issues */
.input-class >>> .v-chip__content > i {
  background: white;
  position: absolute;
  right: 4px;
  padding: 12px; /* Adding padding because now when user click near the delete then it deletes */
}

/* Hover opacity fix, otherwise it would be hard to see  */
.input-class >>> .v-chip__content > i:hover {
  opacity: 1;
}

/* Adding margin auto to inner icon (close-icon) */
.input-class >>> .v-input__append-inner {
  margin: auto !important;
}

/* Small size to clear icon */
.input-class >>> .v-input__append-inner > .v-input__icon--clear > .v-icon {
  font-size: 20px;
}
</style>
