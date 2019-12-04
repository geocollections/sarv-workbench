<template>
  <div class="input-class">
    <v-autocomplete
      background-color="white"
      chips
      small-chips
      deletable-chips
      dense
      hide-details
      hide-no-data
      outlined
      :item-color="$attrs.color"
      item-value="id"
      no-filter
      return-object
      rounded
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-slot:selection="data">
        <v-chip
          v-bind="data.attrs"
          :input-value="data.selected"
          close
          small
          :color="isValidLink ? $attrs.color : ''"
          outlined
          @click="
            isValidLink
              ? openInNewTab(routeObject, data.item.id)
              : data.selected
          "
          @click:close="$emit('chip:close')"
          >{{ data.item[$attrs["item-text"]] }}</v-chip
        >
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
    noFilter: Boolean
  },
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
  methods: {
    openInNewTab(object, id) {
      let routeData = this.$router.resolve({ path: `/${object}/${id}` });
      window.open(routeData.href, "AutocompleteWindow");
    }
  }
};
</script>

<style scoped>
/* Adding border to input because outlined has fixed height */
.input-class >>> .v-input {
  /*border: 1px solid;*/
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
</style>
